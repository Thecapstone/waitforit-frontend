import { useEffect, useState } from "react";
import { listPublicArticles } from "./api";
import { ArticleRecord, BlogPost } from "../types";

const WORDS_PER_MINUTE = 200;

export const articleText = (
  article: Pick<ArticleRecord, "body" | "content">,
): string => (article.body || article.content || "").trim();

export const excerpt = (value: string, limit: number): string => {
  const text = value
    .replace(/^#+\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}...` : text;
};

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/** Adapt a generated article to the BlogPost shape the reader modal expects. */
export function toBlogPost(article: ArticleRecord): BlogPost {
  const body = articleText(article);
  const conclusion = (article.conclusion || "").trim();
  const content = conclusion
    ? `${body}\n\n## Conclusion\n\n${conclusion}`
    : body;
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    id: article.id,
    title: article.title,
    slug: article.id,
    subtitle: article.capsule_title
      ? `From the ${article.capsule_title} capsule`
      : "",
    excerpt: excerpt(body, 220),
    author: article.author_name || "WaitForIt developer",
    date: formatDate(article.created_at),
    readTime: `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`,
    tags: [article.capsule_title, article.tag].filter((tag): tag is string =>
      Boolean(tag),
    ),
    content,
    community: true,
  };
}

/** Public-capsule articles, fetched only while someone is signed in. */
export function usePublicArticles(signedIn: boolean) {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!signedIn) {
      setArticles([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    listPublicArticles()
      .then((records) => {
        if (!cancelled) setArticles(records.map(toBlogPost));
      })
      .catch((reason) => {
        if (!cancelled)
          setError(
            reason instanceof Error
              ? reason.message
              : "Unable to load community articles.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  return { articles, loading, error };
}
