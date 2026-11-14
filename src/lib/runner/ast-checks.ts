import { parse, type Node } from 'acorn';
import { full, simple } from 'acorn-walk';
import type { AstCheck } from '@/content/types';
import type { TestResult } from './types';

type AnyNode = Node & Record<string, unknown>;

interface ClassInfo {
  name: string;
  methods: Set<string>;
}

function collect(ast: Node) {
  const nodeTypes = new Map<string, number>();
  const classes: ClassInfo[] = [];

  const addClass = (name: string | undefined, body: AnyNode) => {
    if (!name) return;
    const methods = new Set<string>();
    for (const member of (body.body as AnyNode[]) ?? []) {
      if (member.type === 'MethodDefinition' || member.type === 'PropertyDefinition') {
        const key = member.key as AnyNode;
        if (key.type === 'Identifier' || key.type === 'PrivateIdentifier')
          methods.add(key.name as string);
        else if (key.type === 'Literal') methods.add(String(key.value));
      }
    }
    classes.push({ name, methods });
  };

  simple(ast, {
    ClassDeclaration(node) {
      const n = node as unknown as AnyNode;
      addClass((n.id as AnyNode | null)?.name as string | undefined, n.body as AnyNode);
    },
    VariableDeclarator(node) {
      const n = node as unknown as AnyNode;
      const init = n.init as AnyNode | null;
      if (init?.type === 'ClassExpression')
        addClass((n.id as AnyNode).name as string, init.body as AnyNode);
    },
  });
  // Conteo de cada tipo de nodo (para forbidNode y maxIfStatements)
  full(ast, (node) => {
    nodeTypes.set(node.type, (nodeTypes.get(node.type) ?? 0) + 1);
  });

  return { nodeTypes, classes };
}

/** Ejecuta las reglas estáticas sobre el código del usuario. Cada regla es un resultado más. */
export function runAstChecks(code: string, checks: AstCheck[] = []): TestResult[] {
  if (checks.length === 0) return [];
  let ast: Node;
  try {
    ast = parse(code, { ecmaVersion: 'latest', sourceType: 'script' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return checks.map((c) => ({
      name: c.message,
      passed: false,
      kind: 'check' as const,
      error: `No se pudo analizar el código: ${message}`,
    }));
  }
  const { nodeTypes, classes } = collect(ast);

  return checks.map((check): TestResult => {
    const base = { name: check.message, kind: 'check' as const };
    switch (check.rule) {
      case 'forbidNode': {
        const count = nodeTypes.get(check.node) ?? 0;
        return count === 0
          ? { ...base, passed: true }
          : { ...base, passed: false, error: `Se encontró ${check.node} en el código` };
      }
      case 'requireClass': {
        const found = classes.some((c) => c.name === check.name);
        return found
          ? { ...base, passed: true }
          : { ...base, passed: false, error: `Falta la clase ${check.name}` };
      }
      case 'requireMethod': {
        const cls = classes.find((c) => c.name === check.className);
        if (!cls) return { ...base, passed: false, error: `Falta la clase ${check.className}` };
        return cls.methods.has(check.method)
          ? { ...base, passed: true }
          : { ...base, passed: false, error: `${check.className} no define ${check.method}()` };
      }
      case 'maxIfStatements': {
        const count = nodeTypes.get('IfStatement') ?? 0;
        return count <= check.max
          ? { ...base, passed: true }
          : { ...base, passed: false, error: `Hay ${count} if; el máximo es ${check.max}` };
      }
    }
  });
}
