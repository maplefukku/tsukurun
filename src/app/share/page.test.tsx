import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  usePathname: () => "/share",
}));

vi.mock("@/components/header", () => ({
  Header: () => <header data-testid="header" />,
}));

describe("SharePage", () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    });
    mockWriteText.mockClear();
  });

  // Lazy import to avoid issues with mock order
  async function renderSharePage() {
    const { default: SharePage } = await import("./page");
    return render(<SharePage />);
  }

  it("renders without crashing", async () => {
    await renderSharePage();
  });

  it("renders the Header", async () => {
    await renderSharePage();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("displays the completion heading", async () => {
    await renderSharePage();
    expect(screen.getByText("完成！")).toBeInTheDocument();
  });

  it("displays the completion description", async () => {
    await renderSharePage();
    expect(
      screen.getByText("あなたのWebツールが公開されたよ"),
    ).toBeInTheDocument();
  });

  it("displays the share URL", async () => {
    await renderSharePage();
    expect(
      screen.getByText("https://tsukurun.vercel.app/s/abc123"),
    ).toBeInTheDocument();
  });

  it("renders share action buttons", async () => {
    await renderSharePage();
    expect(screen.getByText("LINEで送る")).toBeInTheDocument();
    expect(screen.getByText("Xでシェア")).toBeInTheDocument();
    expect(screen.getByText("リンクをコピー")).toBeInTheDocument();
  });

  it("copies URL to clipboard when copy button is clicked", async () => {
    await renderSharePage();
    const copyButton = screen.getByRole("button", { name: "URLをコピー" });
    fireEvent.click(copyButton);
    expect(mockWriteText).toHaveBeenCalledWith(
      "https://tsukurun.vercel.app/s/abc123",
    );
  });

  it("renders a link to create another tool", async () => {
    await renderSharePage();
    const createLink = screen.getByText("もう1つ作ってみる").closest("a");
    expect(createLink).toHaveAttribute("href", "/create");
  });

  it("displays the prompt for next creation", async () => {
    await renderSharePage();
    expect(screen.getByText("次はどんなの作る？")).toBeInTheDocument();
  });
});
