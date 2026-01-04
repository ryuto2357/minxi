import type { FeedItem } from "../types/feed";
import { apiFetch } from "./client";

export async function fetchFeed(page = 1, limit = 10): Promise<{
  data: FeedItem[];
  totalPages: number;
}> {
  const [contentsRes, postsRes] = await Promise.all([
    apiFetch(`/contents/feed?page=${page}&limit=${limit}`),
    apiFetch(`/posts/feed?page=${page}&limit=${limit}`),
  ]);


  console.log("contentsRes", contentsRes);
  console.log("postsRes", postsRes);

  const contents: FeedItem[] = contentsRes.map((c: any) => ({
    kind: "content",
    ...c
  }));
  const posts: FeedItem[] = postsRes.map((p: any) => ({
    kind: "post",
    ...p
  }));
  
  const merged = [...contents, ...posts];
  console.log("contents", merged);

  merged.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return {
    data: merged,
    totalPages: Math.max(
      contentsRes.totalPages,
      postsRes.totalPages
    ),
  };
}
