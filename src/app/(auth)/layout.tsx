export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="from-background to-muted min-h-screen bg-linear-to-br">{children}</div>;
}
