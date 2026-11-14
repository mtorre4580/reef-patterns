import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { highlightJs } from '@/lib/highlight';

interface CodeBlockProps {
  code: string;
  label?: string;
  className?: string;
}

/** Bloque de código de solo lectura resaltado con Shiki (tema Abyss Reef). */
export function CodeBlock({ code, label = 'Código de ejemplo', className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    highlightJs(code)
      .then((result) => active && setHtml(result))
      .catch(() => active && setHtml(null));
    return () => {
      active = false;
    };
  }, [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // sin permisos de portapapeles
    }
  }

  return (
    <figure
      className={cn(
        'relative overflow-hidden rounded-panel border border-line bg-trench',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-kelp">
        <span>{label} · JavaScript</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 rounded-control px-2 py-1 hover:bg-reef hover:text-foam"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </figcaption>
      {html ? (
        <div
          className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed [&_pre]:outline-none"
          // El HTML lo genera Shiki a partir de contenido propio del repo
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </figure>
  );
}
