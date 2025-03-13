// components/layout/Layout.tsx
import React from "react";
import Footer from "./Footer";
import AuthSection from "../AuthSection";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{children}</main>
      <div className="mb-5">
        <AuthSection />
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
