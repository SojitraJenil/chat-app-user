import React from "react";
import { useRouter } from "next/router";
import BottomBar from "../bottombar/BottomBar";
import TopBar from "../topbar/TopBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isUserRoute = router.pathname === "/users";

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* TopBar */}
      {isUserRoute && (
        <div className="flex-none">
          <TopBar />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* BottomBar */}
      {
        isUserRoute &&
        <div className="flex-none">
          <BottomBar />
        </div>
      }
    </div>
  );
};

export default Layout;
