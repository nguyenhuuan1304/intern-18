import ResetPassword from "@/components/auth/ResetPassword";
import React from "react";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="pt-12" />
      <div className="flex items-center justify-center">
        <div className="rounded-2xl shadow-[0_0px_15px_0_rgba(59,130,246,0.5)]">
          <ResetPassword />
        </div>
      </div>
      <div className="pb-12" />
    </div>
  );
};

export default ResetPasswordPage;
