import type { Prompt } from "@/lib/db";

// The list of profile prompts people can pick from. Each profile answers 3 of them.
export const PROMPTS = [
  "My ideal Sunday",
  "I'm weirdly good at",
  "We'll get along if",
  "The way to win me over is",
  "A small thing that makes my day",
  "My most useless skill",
];

// A short "Oct 28, 6:07 PM" style time for lists and chat.
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

// Keep up to 3 prompt answers: [{ question, answer }].
// ZOMBIE: the question is not checked against the list in lib/prompts.ts, and the answer has no moderation.
export function cleanPrompts(input: unknown): Prompt[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((p) => ({ question: String(p?.question ?? ""), answer: String(p?.answer ?? "").slice(0, 300) }))
    .filter((p) => p.question && p.answer.trim())
    .slice(0, 3);
}

