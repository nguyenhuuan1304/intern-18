import React, { useEffect, useState, useRef } from "react";
import { Search, X, AlignJustify } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import useDebounce from "@/hooks/useDebounce";
import NavbarMobile from "../navbarMobile/NavbarMobile";

interface typeImage {
  Image: string;
  formats: {
    thumbnail: {
      url: string;
    };
  };
}

export interface typeProduct {
  documentId: string;
  name: string;
  color: string;
  prices: number;
  Image: typeImage;
}

export interface User {
  username: string;
  jwt: string;
  email: string;
}

import CategorySidebar from "@/components/sidebar/CategorySidebar";

const Header = () => {
  const user: User = JSON.parse(localStorage.getItem("user") ?? "{}");
  const [value, setValue] = useState("");
  const [valueIpad, setValueIpad] = useState("");
  const [circle, setCircle] = useState(false);
  const [arrSearch, setArrSearch] = useState<typeProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefIpad = useRef<HTMLInputElement>(null);
  const debounce = useDebounce(value || valueIpad, 500);
  const navigate = useNavigate();

  // State để quản lý hiển thị sidebar category trên mobile
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { api } = useAxios();
  useEffect(() => {
    if (!debounce.trim()) {
      setArrSearch([]);
      return;
    }

    api
      .get(`/products?query=${debounce}&populate=*`)
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
        const configData: typeProduct[] = Object.values(
          res.data.reduce(
            (acc: { [key: string]: typeProduct }, item: typeProduct) => {
              acc[item.documentId] = item;
              return acc;
            },
            {}
          )
        );
        if (configData) {
          setArrSearch(configData);
        }
      });
  }, [debounce]);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Tự động đóng sidebar khi chuyển sang desktop
      if (!mobile && showSidebarMobile) {
        setShowSidebarMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebarMobile]);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setCircle(true);
  };

  const handleCircle = () => {
    setValue("");
    setCircle(false);
    inputRef.current?.focus();
  };

  const showSearchMobile = () => {
    const search = document.getElementById("search-Mobile");
    if (search) {
      search.classList.add("show");
    }
  };

  const handleCircleIpad = () => {
    setValueIpad("");
    inputRefIpad.current?.focus();
    const search = document.getElementById("search-Mobile");
    if (search) {
      search.classList.remove("show");
    }
  };

  const thumbnailUrls: { price: number; name: string; thumbnailUrl: string }[] =
    arrSearch.map((product) => ({
      price: product.prices,
      name: product.name,
      thumbnailUrl: product.Image?.formats?.thumbnail?.url || "Không có ảnh",
    }));

  const handleLogout = (): void => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const totalItems = localStorage.getItem("cartTotalItems") || "0";

  return (
    <div className="layout">
      <div
        className="custom-header custom-header-mobile   z-50 relative
          2xl:mr-[6.5%] 2xl:ml-[6.5%] lg:items-center lg:grid xl:grid-cols-[256px_1fr] lg:gap-x-[5px] lg:h-[125px] lg:pt-1.5 lg:pb-1.5"
      >
        {/* Menu Mobile: khi nhấn vào thì hiển thị sidebar category */}
        <div
          className="lg:hidden text-[#fff] cursor-pointer"
          onClick={() => setShowSidebarMobile(!showSidebarMobile)}
        >
          <AlignJustify />
        </div>
        <div className="row-span-2 md:w-[150px]">
          <NavLink to={"/"}>
            <img
              className="md:w-[150px]"
              src="https://kawin.vn/uploads/source//logo/z4795324951181-8df678a6cf3f0283a5b110357eb0c396.webp"
              alt=""
            />
          </NavLink>
        </div>
        <button className="lg:hidden" onClick={showSearchMobile}>
          <Search className="to text-[#fff]" />
        </button>

        <div className="custom-input-mobile lg:flex lg:h-[46px] lg:relative">
          <div className="custom-input 2xl:w-[420px] lg:h-[46px] lg:mr-[40px] lg:relative">
            <form
              action=""
              className="flex flex-row w-full h-full rounded-[20px] overflow-hidden border border-blue-600"
            >
              <input
                className="lg:w-[350px] lg:py-2.5 lg:px-3.5 lg:text-base lg:font-normal lg:leading-[1.5] lg:outline-none"
                type="text"
                value={value}
                ref={inputRef}
                placeholder="Nhập sản phẩm tìm kiếm"
                onChange={handleInput}
              />
              <button className="custom-search bg-[#0f35c4] w-[70px] cursor-pointer hover:bg-[#4157a6]">
                <Search className="m-auto text-[#fff]" />
              </button>
            </form>
            {(value !== "" || circle) && (
              <button
                className="absolute top-[12px] right-[80px]"
                onClick={handleCircle}
              >
                <X size={22} strokeWidth={0.5} />
              </button>
            )}
            {(value !== "" || circle) && (
              <div className="absolute top-[60px] z-[99] max-h-[336px] w-[420px] bg-white rounded-[5px] shadow-[0_4px_60px_0_rgba(0,0,0,0.2)]">
                <div className="bg-[#f5f5f5] h-[36px] flex items-center">
                  <span className="p-[10px] text-[13px] text-[#666]">
                    sản phẩm gợi ý
                  </span>
                </div>
                {arrSearch.length !== 0 ? (
                  <div className="product-slider-vertical scroll-area">
                    {thumbnailUrls.map((item, index) => (
                      <div key={index} className="flex p-[10px]">
                        <div className="w-[75px] h-[75px] mr-[10px]">
                          <img
                            className="object-cover h-full"
                            src={`http://localhost:1337${thumbnailUrls[0].thumbnailUrl}`}
                            alt=""
                          />
                        </div>
                        <div>
                          <h3 className="mb-[10px] text-[14px] text-[#323c3f]">
                            {item.name}
                          </h3>
                          <span className="text-[#ff5c5f]">{item.price}đ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#fff] h-[36px] flex items-center">
                    <span className="p-[10px] text-[13px] text-[#666]">
                      Không có kết quả tìm kiếm
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex grow justify-between gap-[15px]">
            <div>
              <NavLink
                to="/account/order"
                className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
              >
                <div>
                  <img
                    src="https://kawin.vn/uploads/source//icon/shopping-list-1.webp"
                    alt=""
                  />
                </div>
                <div>
                  <p>kiểm tra đơn hàng</p>
                </div>
              </NavLink>
            </div>
            {user && user.username ? (
              <>
                <div>
                  <NavLink
                    to={"/account"}
                    className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
                  >
                    <div>
                      <img
                        src="https://kawin.vn/uploads/source//icon/account-(1)-1.webp"
                        alt=""
                      />
                    </div>
                    <div className="max-w-[200px] truncate">
                      <p>Hi, {user.username}</p>
                    </div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    to="/login"
                    onClick={handleLogout}
                    className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
                  >
                    <div>
                      <img
                        src="https://kawin.vn/uploads/source//icon/account-1.webp"
                        alt="User icon"
                      />
                    </div>
                    <div>
                      <p className="cursor-pointer">Đăng xuất</p>
                    </div>
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <div>
                  <NavLink
                    to={"/register"}
                    className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
                  >
                    <div>
                      <img
                        src="https://kawin.vn/uploads/source//icon/account-(1)-1.webp"
                        alt=""
                      />
                    </div>
                    <div>
                      <p>Đăng ký</p>
                    </div>
                  </NavLink>
                </div>
                <div>
                  <NavLink
                    to="/login"
                    className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
                  >
                    <div>
                      <img
                        src="https://kawin.vn/uploads/source//icon/account-1.webp"
                        alt=""
                      />
                    </div>
                    <div>
                      <p>Đăng nhập</p>
                    </div>
                  </NavLink>
                </div>
              </>
            )}

            <div>
              <NavLink
                to={"/cart"}
                className="text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[5px] h-full items-center"
              >
                <div className="relative">
                  <img
                    src="https://kawin.vn/uploads/source//icon/group.webp"
                    alt=""
                  />
                  <span className="absolute top-[-10px] right-[-10px] w-[20px] h-[20px] rounded-full leading-[18px] text-center bg-[#ef4562] text-white">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p>Giỏ hàng</p>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="custom-input-mobile bg-[#0f35c4] text-[#fff] mt-[20px] rounded-[4px]">
          <ul className="flex items-center h-[45px]">
            <li className="border-r">
              <NavLink
                to={"/"}
                className="flex items-center h-full pl-[20px] pr-[20px]"
              >
                <div>
                  <img
                    src="https://kawin.vn/uploads/source//icon/home-1.webp"
                    alt=""
                  />
                </div>
                <span className="text-[14px] font-[500] leading-[25px] ml-[10px]">
                  TRANG CHỦ
                </span>
              </NavLink>
            </li>
            <li className="border-r">
              <NavLink to={"/product"} className="pl-[20px] pr-[20px]">
                <span className="text-[14px] font-[500] leading-[25px]">
                  SẢN PHẨM
                </span>
              </NavLink>
            </li>
            <li className="border-r">
              <NavLink
                to={"/lien-he"}
                className="flex items-center h-full pl-[20px] pr-[20px]"
              >
                <div>
                  <img
                    src="https://kawin.vn/uploads/source//icon/headphones-1.webp"
                    alt=""
                  />
                </div>
                <span className="text-[14px] font-[500] leading-[25px] ml-[10px]">
                  LIÊN HỆ
                </span>
              </NavLink>
            </li>
            <li className="border-r">
              <NavLink
                to={"/tin-tuc"}
                className="flex items-center h-full pl-[20px] pr-[20px]"
              >
                <div>
                  <img
                    src="https://si-justplay.com/uploads/source//icon/menu/insurance-1.png"
                    alt=""
                  />
                </div>
                <span className="text-[14px] font-[500] leading-[25px] ml-[10px]">
                  Tin tức
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div id="search-Mobile" className="lg:hidden custom-input-search-mobile">
        <form action="" className="p-[25px] w-full h-full">
          <div className="flex items-center h-full">
            <input
              type="text"
              value={valueIpad}
              onChange={(e) => setValueIpad(e.target.value)}
              className="w-[85%] bg-[#fff] p-[10px] text-[#000]"
              placeholder="tìm kiếm"
              ref={inputRefIpad}
            />
            <div className="grow ml-[10px] flex justify-evenly cursor-pointer">
              <button>
                <Search className="to text-[#fff]" />
              </button>
              <div className="text-[#fff]" onClick={handleCircleIpad}>
                <X size={40} strokeWidth={0.5} color="white" />
              </div>
            </div>
          </div>
        </form>
        <div className="text-[#000] m-[40px]">
          {thumbnailUrls.map((item, index) => (
            <div
              key={index}
              className="h-auto mb-[10px] border-b border-gray-300"
            >
              <a href="" className="flex h-[75px] p-[4px]">
                <img
                  className="object-cover h-full"
                  src={`http://localhost:1337/${thumbnailUrls[0].thumbnailUrl}`}
                  alt=""
                />
                <h3 className="ml-[10px]">{item.name}</h3>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay sidebar category trên mobile */}
      {showSidebarMobile && (
        <div className="fixed top-[60px] left-0 right-0 bottom-0 z-40 bg-white overflow-y-auto">
          <button
            className="absolute top-0 right-0 m-4"
            onClick={() => setShowSidebarMobile(false)}
          >
            <X size={24} strokeWidth={2} color="black" />
          </button>
          <CategorySidebar onCategorySelect={function (slug: string): void {
            throw new Error("Function not implemented.");
          }} />
        </div>
      )}

      <NavbarMobile />
    </div>
  );
};

export default Header;