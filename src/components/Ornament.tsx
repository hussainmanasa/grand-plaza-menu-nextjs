/** Hairline – diamond – hairline divider in the accent colour. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 text-accent ${className}`}>
      <span className="h-px w-12 bg-current opacity-60" />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className="h-px w-12 bg-current opacity-60" />
    </div>
  );
}
