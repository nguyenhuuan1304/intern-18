import React from "react";
import Register from "@/components/auth/Register";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="pt-12" />
      <div className="flex items-center justify-center">
        <div className="rounded-2xl shadow-[0_0px_15px_0_rgba(59,130,246,0.5)]">
          <Register />
        </div>
      </div>
      <div className="pb-12" />
    </div>
  );
};

export default RegisterPage;
