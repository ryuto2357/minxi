import { useState } from "react";
import Layout from "../../components/layout/Layout";
import CreatePostForm from "./CreatePostForm";
import CreateContentForm from "./CreateContentForm";

function CreatePage() {
  const [activeTab, setActiveTab] = useState<"post" | "content">("post");

  return (
    <Layout>
      <h1>Create</h1>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("content")}
          style={{ fontWeight: activeTab === "content" ? "bold" : "normal" }}
        >
          Content
        </button>

        <button
          onClick={() => setActiveTab("post")}
          style={{ fontWeight: activeTab === "post" ? "bold" : "normal" }}
        >
          Post
        </button>

        <button disabled>Board</button>
      </div>

      {activeTab === "post" && <CreatePostForm />}
      {activeTab === "content" && <CreateContentForm />}
    </Layout>
  );
}

export default CreatePage;
