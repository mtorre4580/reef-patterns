import type { CodeEditorProps } from '@/features/playground/editor-types';
import { executeChallenge } from '@/lib/runner/execute';
import type { RunRequest } from '@/lib/runner/types';
import type { WorkerLike } from '@/lib/runner/run';

/** Plain editor for tests: Monaco does not run in jsdom. */
export const FakeEditor = ({ value, onChange, label }: CodeEditorProps) => {
  return <textarea aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} />;
};

/** Same-thread worker for component tests. */
export function createInlineWorker(): WorkerLike {
  const worker: WorkerLike = {
    onmessage: null,
    onerror: null,
    postMessage(message) {
      void executeChallenge(message as RunRequest).then((data) =>
        worker.onmessage?.({ data } as MessageEvent),
      );
    },
    terminate() {},
  };
  return worker;
}
