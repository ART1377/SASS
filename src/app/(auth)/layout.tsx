export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex flex-1 items-center justify-center p-4 sm:p-6">{children}</div>
    </div>
  );
}
