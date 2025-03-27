import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {  Users, ShoppingBag, Newspaper, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ManagerUser from "./ManagerUser";
import ManagerNews from "./ManagerNews";
import ManagerProduct from "./ManagerProduct";

interface TypeAdmin {
    id: string,
    icon : ReactNode
} 

 

const AdminDashboard = () => {
  const [page, setPage] = useState("User");
  const navigate = useNavigate()

  const navbarAdmin: TypeAdmin[] = [
    { id: "User",  icon: <Users /> },
    { id: "Manager Product",  icon: <ShoppingBag /> },
    { id: "Manager News",  icon: <Newspaper /> },
    { id: "Logout",  icon: <LogOut /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* <Sidebar setPage={setPage} handleLogout={handleLogout} /> */}
      <div className="w-64 h-screen bg-gray-900 text-white flex flex-col ">
        {navbarAdmin.map((item) => (
            <Button 
                className={`${item.id === page ? 'bg-[#2c3e63]' : ''} cursor-pointer mt-[10%] text-[20px] hover:bg-[#2c3e63] flex justify-start`}
                onClick={item.id === "Logout" ? handleLogout : () => setPage(item.id)}
                key={item.id}
            >
                {item.icon} 
                {item.id}
            </Button>
        ))}
      </div>
      <div className="flex-1 p-6">
        {page === "User" && <ManagerUser/>}
        {page === "Manager Product" && <ManagerProduct/>}
        {page === "Manager News" && <ManagerNews/>}
      </div>
    </div>
  );
};

export default AdminDashboard;
