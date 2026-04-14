export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Suggestion = {
  id: string;
  title: string;
  description: string;
};
