export default function Tag({ children }) {
  return (
    <span className="font-mono text-xs uppercase tracking-wide text-mute border border-rule px-2 py-1 rounded-sm">
      {children}
    </span>
  );
}
