import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import "./CreateContentForm.css";

function CreateContentForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title || !description || !mediaUrl) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/contents", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          type,
          thumbnail: mediaUrl,
          isPrivate,
          status: "PUBLISHED"
        }),
      });

      navigate("/feed");
    } catch (err: any) {
      setError(err.message || "Failed to create content");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="create-content-form" onSubmit={handleSubmit}>
      <div className="create-content-title">Create Content</div>

      {error && <p className="create-content-error">{error}</p>}

      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Content title"
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your content"
      />

      <label>Content Type</label>
      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      <label>{type === "image" ? "Image URL" : "Video URL"}</label>
      <input
        value={mediaUrl}
        onChange={(e) => setMediaUrl(e.target.value)}
        placeholder="https://..."
      />

      <label className="checkbox">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        Private content
      </label>

      <div className="create-content-actions">
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Publish"}
        </button>
      </div>
    </form>
  );
}

export default CreateContentForm;
