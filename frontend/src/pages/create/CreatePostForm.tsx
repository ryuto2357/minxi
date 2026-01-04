import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import "./CreatePostForm.css";

function CreatePostForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !description) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify({ title, description, status: "PUBLISHED"}),
      });

      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="create-post-title">Create Post</div>

      {error && <p className="create-post-error">{error}</p>}

      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write something..."
      />

      <div className="create-post-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

export default CreatePostForm;
