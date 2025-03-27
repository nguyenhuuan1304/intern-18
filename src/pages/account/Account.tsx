import React, { useEffect, useState, ReactNode } from "react";
import Header, { User as TypeUser} from "@/components/header/Header";
import ServiceMenu from "@/components/ServiceMenu";
import Layout from "@/components/layout/Layout";
import InfoUsers from "@/components/infoUsers/InfoUsers";
import InfoShoppingCard from "@/components/infoShoppingCard/InfoShoppingCard";
import { LockKeyholeOpen, LogOut, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "@/components/changePassword/ChangePasssword";


interface TypeNavbarItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const Account = () => {
  const user: TypeUser & { id: string } = {
    ...JSON.parse(localStorage.getItem("user") || "null"),
    
  };
  const [selectTab, setSelectTab] = useState(() => {
    return localStorage.getItem("selectedTab") || "info";
  });
  const navigate = useNavigate();

  const dataNavbar: TypeNavbarItem[] = [
    { id: "info", label: "Thông tin tài khoản", icon: <User /> },
    { id: "password", label: "Đổi mật khẩu", icon: <LockKeyholeOpen /> },
    { id: "orders", label: "Đơn hàng", icon: <ShoppingCart /> },
    { id: "logout", label: "Đăng xuất", icon: <LogOut /> },
  ];

  const handleSelectTab = (item: string) => {
    console.log(item);
    if (item === "logout") {
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      setSelectTab(item);
      localStorage.setItem("selectedTab", item);
    }
  };

  return (
    <Layout>
      <div className="layout flex-col">
        <Header />
        <div className="max-w-[1400px] xl:mx-[auto] flex-shrink-0  max-xl:mx-[4%] custom-content-account  max-md:mx-[6%]  py-8 max-sm:mx-0 max-md:pr-2 max-md:pl-2 max-xl:">
          <div className="hidden md:block "><ServiceMenu /> </div>
          <div className="bg-white shadow-2xl my-[50px] flex gap-[5px] mx-[10px] max-xl:mx-[10px]  max-md:flex-col max-md:max-w-[540px] max-sm:m-[auto]">
            <div className=" w-[25%] max-sm:w-[100%] max-md:w-[100%]">
              <div className="text-[#212529] text-[15px] flex flex-col items-center p-[10px] border-b border-[#F7F8FA]">
                <p className="font-medium ">KH00094915970282</p>
                <p>{user.username}</p>
              </div>
              <ul className="text-[#4a4a4a]">
                {dataNavbar.map((item) => (
                    <li key={item.id} className="my-[10px] ">
                    <button
                      className={`
                          ${
                            item.id === selectTab
                              ? "bg-[#0590f9] text-[#fff]"
                              : ""
                          }
                          flex p-[10px] rounded-[4px] hover:bg-[#0590f9] hover:cursor-pointer hover:text-[#fff] w-[100%]
                          `}
                      onClick={() => handleSelectTab(item.id)}
                    >
                      {item.icon}
                      <p className="ml-[20px]">{item.label}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-[1] max-md:w-[100%]">
              {selectTab === "info" && <InfoUsers user={user}/>}
              {selectTab === "password" && <ChangePassword />}
              {selectTab === "orders" && <InfoShoppingCard />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
