export default function Tag({ children }) {
  return (
    <span className="font-mono text-xs uppercase tracking-wide text-muted border border-rule px-2 py-1">
      {children}
    </span>
  );
}
