// PostToolUse hook: formats the file Claude just edited or wrote with Prettier.
// Formatting must never block Claude's work, so every failure exits with 0.
import { execFileSync } from 'node:child_process';

let input = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) input += chunk;

try {
  const filePath = JSON.parse(input).tool_input?.file_path;
  if (filePath) {
    // --ignore-unknown skips files Prettier cannot parse; .prettierignore is honored.
    execFileSync('pnpm', ['exec', 'prettier', '--write', '--ignore-unknown', filePath], {
      cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
      stdio: 'ignore',
    });
  }
} catch {
  // Ignore: an unformatted file is better than an interrupted session.
}
