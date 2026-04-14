import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SignupPage from "@/app/(auth)/signup/page";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterMotionProps(props)}>{children}</div>
    ),
    form: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <form {...filterMotionProps(props)}>{children}</form>
    ),
    h1: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <h1 {...filterMotionProps(props)}>{children}</h1>
    ),
    p: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <p {...filterMotionProps(props)}>{children}</p>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

function filterMotionProps(props: Record<string, unknown>) {
  const filtered = { ...props };
  const motionKeys = [
    "initial",
    "animate",
    "exit",
    "transition",
    "whileHover",
    "whileTap",
    "whileFocus",
    "variants",
    "layout",
  ];
  motionKeys.forEach((key) => delete filtered[key]);
  return filtered;
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: vi.fn(),
    },
  }),
}));

describe("SignupPage", () => {
  it("メールアドレスとパスワードの入力欄を表示する", () => {
    render(<SignupPage />);

    expect(screen.getByLabelText(/メール/)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
  });

  it("アカウント作成ボタンを表示する", () => {
    render(<SignupPage />);

    expect(
      screen.getByRole("button", { name: /アカウント作成/ })
    ).toBeInTheDocument();
  });

  it("ログインページへのリンクを表示する", () => {
    render(<SignupPage />);

    const link = screen.getByRole("link", { name: /ログイン/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });
});
