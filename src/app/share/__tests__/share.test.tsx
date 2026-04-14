import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// next/link モック
vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

// next/navigation モック
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// framer-motion モック（アニメーションを無効化）
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    h1: ({ children, ...props }: any) => {
      const { initial, animate, transition, ...rest } = props;
      return <h1 {...rest}>{children}</h1>;
    },
    p: ({ children, ...props }: any) => {
      const { initial, animate, transition, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Header コンポーネントモック
vi.mock("@/components/header", () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

// lucide-react モック
vi.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon" />,
  Copy: () => <span data-testid="copy-icon" />,
  ExternalLink: () => <span data-testid="external-link-icon" />,
  MessageCircle: () => <span data-testid="message-circle-icon" />,
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
}));

import SharePage from "@/app/share/page";

describe("SharePage", () => {
  const mockWriteText = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  it("共有URLが表示される", () => {
    render(<SharePage />);
    const codeEl = screen.getByText("https://tsukurun.vercel.app/s/abc123");
    expect(codeEl).toBeInTheDocument();
  });

  it("コピーボタンをクリックするとclipboard.writeTextが呼ばれる", async () => {
    render(<SharePage />);
    const copyButton = screen.getByLabelText("URLをコピー");
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(
      "https://tsukurun.vercel.app/s/abc123"
    );
  });

  it("「リンクをコピー」ボタンでもclipboard.writeTextが呼ばれる", () => {
    render(<SharePage />);
    const linkCopyButton = screen.getByText("リンクをコピー");
    fireEvent.click(linkCopyButton);

    expect(mockWriteText).toHaveBeenCalledWith(
      "https://tsukurun.vercel.app/s/abc123"
    );
  });

  it("コピー後にチェックアイコンが表示される", async () => {
    render(<SharePage />);
    const copyButton = screen.getByLabelText("URLをコピー");
    fireEvent.click(copyButton);

    // コピー後、Checkアイコンが表示されている（ボタン内にcheck-iconがある）
    await waitFor(() => {
      const checkIcons = screen.getAllByTestId("check-icon");
      // ページ上部の完了チェック + コピーボタン内のチェック
      expect(checkIcons.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("「完成！」の見出しが表示される", () => {
    render(<SharePage />);
    expect(screen.getByText("完成！")).toBeInTheDocument();
  });

  it("LINEで送るボタンが表示される", () => {
    render(<SharePage />);
    expect(screen.getByText("LINEで送る")).toBeInTheDocument();
  });

  it("Xでシェアボタンが表示される", () => {
    render(<SharePage />);
    expect(screen.getByText("Xでシェア")).toBeInTheDocument();
  });
});
