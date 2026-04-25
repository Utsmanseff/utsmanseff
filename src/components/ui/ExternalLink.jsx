export default function ExternalLink({ href, children, className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-amber underline decoration-amber/50 underline-offset-4 hover:decoration-amber transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
