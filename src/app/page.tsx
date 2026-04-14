import { AppShell } from "@/components/app-shell";
import { HeroSection } from "./hero-section";
import { ExamplesSection } from "./examples-section";

export default function LandingPage() {
  return (
    <AppShell>
      <HeroSection />
      <ExamplesSection />
      <footer className="pb-8 pt-4 text-center text-xs text-muted-foreground">
        30分で完成。コード不要。
      </footer>
    </AppShell>
  );
}
