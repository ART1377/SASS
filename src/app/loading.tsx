export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
          <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full" />
          <div className="bg-primary/10 relative flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="text-primary h-8 w-8 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse text-lg font-medium">
          در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}
