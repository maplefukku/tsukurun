import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        return React.forwardRef((props: any, ref: any) => {
          const {
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileTap,
            layout,
            ...rest
          } = props;
          return React.createElement(prop as string, { ...rest, ref });
        });
      },
    },
  ),
  AnimatePresence: ({ children }: any) => children,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/create",
}));

vi.mock("@/lib/templates/registry", () => ({
  getTemplateById: () => null,
}));

// jsdom doesn't implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

import CreatePage from "./page";

describe("CreatePage", () => {
  it("renders without crashing", () => {
    render(<CreatePage />);
  });

  it("displays the header with title", () => {
    render(<CreatePage />);
    expect(screen.getByText("つくるん")).toBeInTheDocument();
  });

  it("displays the initial assistant message", () => {
    render(<CreatePage />);
    expect(
      screen.getByText(
        /こんにちは！最近ハマってることとかある？何でもいいよ/,
      ),
    ).toBeInTheDocument();
  });

  it("renders the text input with placeholder", () => {
    render(<CreatePage />);
    expect(
      screen.getByPlaceholderText("なんでも聞いてね..."),
    ).toBeInTheDocument();
  });

  it("renders the send button", () => {
    render(<CreatePage />);
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument();
  });

  it("send button is disabled when input is empty", () => {
    render(<CreatePage />);
    const sendButton = screen.getByRole("button", { name: "送信" });
    expect(sendButton).toBeDisabled();
  });

  it("enables send button when text is entered", () => {
    render(<CreatePage />);
    const textarea = screen.getByPlaceholderText("なんでも聞いてね...");
    fireEvent.change(textarea, { target: { value: "テスト" } });
    const sendButton = screen.getByRole("button", { name: "送信" });
    expect(sendButton).not.toBeDisabled();
  });

  it("has a back link to home", () => {
    render(<CreatePage />);
    const backLink = screen.getByRole("link", { name: "戻る" });
    expect(backLink).toHaveAttribute("href", "/");
  });
});
