import React from "react";

const Footer: React.FC = () => {
  return (
    <div>
      {/* Khối màu đen phía trên */}
      <div className="bg-black h-[100px]" />

      {/* Phần footer màu xám chứa text */}
      <footer className="bg-[#282828] text-white text-center p-4 flex-shrink-0">
        <div className="container mx-auto">
          © 2025 Kawin.vn - SỈ THỂ THAO KAWIN.VN
        </div>
      </footer>
    </div>
  );
};

export default Footer;
