import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

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
  AnimatePresence: ({ children, mode, ...rest }: any) => children,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement("a", { href, ...props }, children),
}));

let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => "/preview",
}));

vi.mock("@/components/header", () => ({
  Header: () => <header data-testid="header" />,
}));

import PreviewPage from "./page";

function mockFetchSuccess(html: string) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ html }),
  });
}

function mockFetchError(error: string, status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error }),
  });
}

describe("PreviewPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSearchParams = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(<PreviewPage />);
  });

  it("renders the Header", () => {
    render(<PreviewPage />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("shows error when no templateId is provided", async () => {
    render(<PreviewPage />);
    expect(
      screen.getByText("テンプレートが指定されていないよ"),
    ).toBeInTheDocument();
  });

  it("shows the first loading step when templateId is provided", async () => {
    mockSearchParams = new URLSearchParams("template=countdown");
    mockFetchSuccess("<html>test</html>");
    render(<PreviewPage />);
    expect(screen.getByText("アイデアを整理してるよ...")).toBeInTheDocument();
  });

  it("advances through loading steps on interval", async () => {
    mockSearchParams = new URLSearchParams("template=countdown");
    mockFetchSuccess("<html>test</html>");
    render(<PreviewPage />);

    expect(screen.getByText("アイデアを整理してるよ...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("デザインを考え中...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByText("コードを書いてるよ...")).toBeInTheDocument();
  });

  it("shows preview with generated HTML after loading completes", async () => {
    mockSearchParams = new URLSearchParams("template=countdown");
    mockFetchSuccess("<html><body>Generated Content</body></html>");

    render(<PreviewPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("友達にシェアする")).toBeInTheDocument();
    expect(screen.getByText("もう少し変えたい")).toBeInTheDocument();

    const iframe = screen.getByTitle("プレビュー") as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute("srcdoc")).toContain("Generated Content");
  });

  it("shows share and edit links after loading", async () => {
    mockSearchParams = new URLSearchParams("template=calculator");
    mockFetchSuccess("<html>calc</html>");

    render(<PreviewPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const shareLink = screen.getByText("友達にシェアする").closest("a");
    expect(shareLink).toHaveAttribute("href", "/share");

    const editLink = screen.getByText("もう少し変えたい").closest("a");
    expect(editLink).toHaveAttribute("href", "/create");
  });

  it("shows error message when API returns an error", async () => {
    mockSearchParams = new URLSearchParams("template=countdown");
    mockFetchError("テンプレートが見つからないよ", 404);

    render(<PreviewPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(
      screen.getByText("テンプレートが見つからないよ"),
    ).toBeInTheDocument();
  });

  it("supports templateId query parameter", async () => {
    mockSearchParams = new URLSearchParams("templateId=menu-board");
    mockFetchSuccess("<html>menu</html>");

    render(<PreviewPage />);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ templateId: "menu-board" }),
      }),
    );
  });

  it("calls /api/generate with the correct templateId", async () => {
    mockSearchParams = new URLSearchParams("template=profile-card");
    mockFetchSuccess("<html>profile</html>");

    render(<PreviewPage />);

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/generate",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ templateId: "profile-card" }),
      }),
    );
  });
});
