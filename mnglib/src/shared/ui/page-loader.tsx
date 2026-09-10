function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
    </div>
  );
}

type AsyncErrorProps = {
  onRetry?: () => void;
};

function AsyncError({ onRetry }: AsyncErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-ink-muted">
        Something went wrong while loading content.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-line-strong bg-line px-4 py-1.5 text-xs font-semibold text-ink-muted transition-colors duration-200 hover:border-brand/40 hover:text-ink"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export { AsyncError, PageLoader };
