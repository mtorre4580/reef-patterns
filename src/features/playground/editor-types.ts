export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  theme: 'dark' | 'light';
  label: string;
}
