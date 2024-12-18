import React from "react";
import BottomBar from "../bottombar/BottomBar";
import TopBar from "../topbar/TopBar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-white">
      <TopBar />

      <div className="flex-1 overflow-y-auto  ">{children}</div>

      <BottomBar />
    </div>
  );
};

export default Layout;
