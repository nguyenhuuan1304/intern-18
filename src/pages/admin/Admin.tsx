import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingBag,
  Newspaper,
  LogOut,
  Package,
  Menu,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import ManagerUser from "./ManagerUser";
import ManagerNews from "./ManagerNews";
import ManagerProduct from "./ManagerProduct";
import ManagerOrder from "./ManageOrder";
 
interface TypeAdmin {
  id: string;
  icon: ReactNode;
}
 
const AdminDashboard = () => {
  const [page, setPage] = useState("User");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
 
  const navbarAdmin: TypeAdmin[] = [
    { id: "User", icon: <Users /> },
    { id: "Manager Product", icon: <ShoppingBag /> },
    { id: "Manager Order", icon: <Package /> },
    { id: "Manager News", icon: <Newspaper /> },
    { id: "Logout", icon: <LogOut /> },
  ];
 
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
 
  return (
    <div className="flex h-screen">
      {/* <Sidebar setPage={setPage} handleLogout={handleLogout} /> */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex`}
      >
        <div className="flex flex-col w-full h-full pt-6">
          {navbarAdmin.map((item) => (
            <Button
              key={item.id}
              className={`${
                item.id === page ? "bg-[#2c3e63]" : ""
              } cursor-pointer mt-4 text-[18px] hover:bg-[#2c3e63] flex items-center gap-2 justify-start px-4 py-2`}
              onClick={
                item.id === "Logout"
                  ? handleLogout
                  : () => {
                      setPage(item.id);
                      setSidebarOpen(false); // đóng sidebar khi chọn page trên mobile
                    }
              }
              variant="ghost"
            >
              {item.icon}
              {item.id}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-6">
        {/* Top bar (hamburger menu) */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </Button>
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
        {page === "User" && <ManagerUser />}
        {page === "Manager Product" && <ManagerProduct />}
        {page === "Manager Order" && <ManagerOrder />}
        {page === "Manager News" && <ManagerNews />}
        <Outlet />
      </div>
    </div>
  );
};
 
export default AdminDashboard;