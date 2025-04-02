import ResetPassword from "@/components/auth/ResetPassword";
import Header from "@/components/header/Header";
import React from "react";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="fixed top-0 left-0 w-full z-50 md:hidden mb-10">
        <Header />
      </div>
      <div className="pt-24 md:pt-12" />
      <div className="flex items-center justify-center">
        <div className="rounded-2xl shadow-[0_0px_15px_0_rgba(59,130,246,0.5)]">
          <ResetPassword />
        </div>
      </div>
      <div className="pb-24 md:pb-12" />
    </div>
  );
};

export default ResetPasswordPage;
