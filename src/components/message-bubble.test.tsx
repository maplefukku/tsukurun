import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
    }
  ),
  AnimatePresence: ({ children }: any) => children,
}));

import { MessageBubble } from "./message-bubble";
import type { Message } from "@/lib/types";

describe("MessageBubble", () => {
  const userMessage: Message = {
    id: "1",
    role: "user",
    content: "こんにちは",
  };

  const assistantMessage: Message = {
    id: "2",
    role: "assistant",
    content: "お手伝いします",
  };

  it("renders without crashing", () => {
    render(<MessageBubble message={userMessage} />);
  });

  it("displays the message content for user messages", () => {
    render(<MessageBubble message={userMessage} />);
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
  });

  it("displays the message content for assistant messages", () => {
    render(<MessageBubble message={assistantMessage} />);
    expect(screen.getByText("お手伝いします")).toBeInTheDocument();
  });

  it("does not show avatar for user messages", () => {
    const { container } = render(<MessageBubble message={userMessage} />);
    // Avatar uses AvatarFallback with Sparkles icon; user messages should not have it
    const avatars = container.querySelectorAll("[data-slot='avatar']");
    expect(avatars.length).toBe(0);
  });
});
