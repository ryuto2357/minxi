import type { JSX, ReactNode } from "react";
import Sidebar from "./Sidebar";
import "./layout.css";

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="layout">
            <Sidebar />
            <main className="layout-main">
                {children}
            </main>
        </div>
    )
}

export default Layout;