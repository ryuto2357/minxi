import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">👤</div>
        <div className="sidebar-username">
          {user?.username}
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/feed">Feed</Link>
        <Link to="/search">Search</Link>
        <Link to="/create">Create</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
