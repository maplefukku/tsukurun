import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(auth)/login/page";

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
      signInWithPassword: vi.fn(),
    },
  }),
}));

describe("LoginPage", () => {
  it("メールアドレスとパスワードの入力欄を表示する", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/メール/)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/)).toBeInTheDocument();
  });

  it("ログインボタンを表示する", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /ログイン/ })
    ).toBeInTheDocument();
  });

  it("サインアップページへのリンクを表示する", () => {
    render(<LoginPage />);

    const link = screen.getByRole("link", { name: /アカウント作成/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });
});
