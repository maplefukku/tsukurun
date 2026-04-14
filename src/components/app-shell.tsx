import { Header } from "@/components/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto w-full max-w-lg px-4">{children}</main>
    </div>
  );
}
