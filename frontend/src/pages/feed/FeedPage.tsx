import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { fetchFeed } from "../../api/feed";
import type { FeedItem } from "../../types/feed";
import "./FeedPage.css";

function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFeed();
  }, [page]);

  async function loadFeed() {
    setLoading(true);
    setError("");

    try {
      const res = await fetchFeed(page);
      setItems(res.data);
      console.log(res);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1>Feed</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "lightcoral" }}>{error}</p>}

      {items.map((item) => (
        <div key={item.id + item.kind} className="feed-item">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <small>
            by {item.creator.username} · ❤️ {item._count.likes} · 💬{" "}
            {item._count.comments}
          </small>
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 12px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}

export default FeedPage;
