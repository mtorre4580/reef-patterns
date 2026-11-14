import { Fragment } from 'react';

function inline(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={i} className="rounded bg-reef px-1 py-px font-mono text-[0.85em] text-foam">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Text with inline `code` and “- ” lists. Enough for challenge instructions. */
export const RichText = ({ text }: { text: string }) => {
  const blocks: { type: 'p' | 'ul'; lines: string[] }[] = [];
  for (const line of text.split('\n')) {
    const isItem = line.startsWith('- ');
    const last = blocks.at(-1);
    if (isItem && last?.type === 'ul') last.lines.push(line.slice(2));
    else if (isItem) blocks.push({ type: 'ul', lines: [line.slice(2)] });
    else if (line.trim()) blocks.push({ type: 'p', lines: [line] });
  }
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) =>
        block.type === 'ul' ? (
          <ul key={i} className="flex list-disc flex-col gap-1 pl-5">
            {block.lines.map((l, j) => (
              <li key={j}>{inline(l)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inline(block.lines[0]!)}</p>
        ),
      )}
    </div>
  );
};
