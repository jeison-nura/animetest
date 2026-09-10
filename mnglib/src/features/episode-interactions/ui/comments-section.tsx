"use client";

import { useState, type FormEvent } from "react";

import { Button, StarRating, Textarea } from "@/shared/ui";
import type { EpisodeComment } from "../model/types";

type CommentsSectionProps = {
  initialComments: EpisodeComment[];
};

function CommentsSection({ initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = commentText.trim();

    if (!text || rating === 0) {
      return;
    }

    setComments((prev) => [
      {
        id: Date.now(),
        author: "You",
        initials: "Y",
        color: "#7c3aed",
        rating,
        text,
        date: "Just now",
      },
      ...prev,
    ]);
    setCommentText("");
    setRating(0);
  }

  return (
    <section
      aria-label="Episode comments"
      className="rounded-xl border border-line-soft bg-card p-5"
    >
      <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-ink-faint">
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <div>
          <p className="mb-1.5 text-xs font-medium text-ink-bright">
            Your rating
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <Textarea
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Share your thoughts about this episode..."
          rows={3}
          required
        />
        <Button
          type="submit"
          className="self-start"
          disabled={!commentText.trim() || rating === 0}
        >
          Post Comment
        </Button>
      </form>

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <div
              className="flex size-10 shrink-0 select-none items-center justify-center rounded-full font-display text-xs font-black text-white/80"
              style={{
                background: `linear-gradient(135deg, ${comment.color}, ${comment.color}66)`,
              }}
            >
              {comment.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm font-semibold text-ink">
                  {comment.author}
                </p>
                <span aria-hidden className="text-xs text-ink-ghost">
                  ·
                </span>
                <span className="text-xs text-ink-faint">{comment.date}</span>
                <StarRating value={comment.rating} readOnly size="sm" />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {comment.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export { CommentsSection };