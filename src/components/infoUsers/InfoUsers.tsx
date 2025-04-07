import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { User } from "@/components/header/Header";
import { toast } from "react-toastify";
import useAxios from "@/hooks/useAxios";
import useDebounce from "@/hooks/useDebounce";
import { getProvinces, getDistricts, getWards } from "../cart/service/addressService";
import Select from "react-select";

interface typeInfo {
  user: User & { id: string };
}

const initialValue: User = {
  username: "",
  email: "",
  phone: "",
  birthday: "",
  address: "",
  firstName: "",
};

const InfoUsers: React.FC<typeInfo> = ({ user }) => {
  const [form, setForm] = useState<User>(initialValue);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [isFormChange, setIsFormChange] = useState(false);
  const { api } = useAxios();
  const debounce = useDebounce(form.username, 500) as string;
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [streetAddress, setStreetAddress] = useState("");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedWard, setSelectedWard] = useState<any>(null);

  useEffect(() => {
    if (!isFormChange || !debounce) return;
    console.log(form.username);
    const fetchData = async () => {
      try {
        const res = await api.get(`users?filters[username][$eq]=${debounce}`);
        const user = res.data;
        if (user && user.length > 0) {
          setError((pre) => ({ ...pre, ["username"]: "tài khoản đã tồn tại" }));
        } else {
          setError((pre) => ({ ...pre, ["username"]: "" }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [debounce]);

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    if (selectedProvince) {
      getDistricts(selectedProvince.value).then(setDistricts);
      setSelectedDistrict(null);
      setSelectedWard(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getWards(selectedDistrict.value).then(setWards);
      setSelectedWard(null);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get(`/users/${user.id}`);
        setForm(res.data);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchUserData();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let message = "";
    if (id === "phone") {
      const isPhone = /^[0-9]{10,11}$/;
      if (!isPhone.test(value)) {
        message = "Số điện thoại không hợp lệ! (độ tài từ 10-11 chữ số)";
      } else {
        message = "";
      }
    }

    if (id === "email") {
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/; // Regex kiểm tra email hợp lệ
      if (!emailRegex.test(value)) {
        message = "Email không hợp lệ! Vui lòng nhập đúng định dạng.";
      } else {
        message = ""; // Reset lỗi nếu hợp lệ
      }
    }

    setForm((pre) => ({ ...pre, [e.target.id]: e.target.value }));
    setError((pre) => ({ ...pre, [id]: message }));
    setIsFormChange(true);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(form);
    e.preventDefault();
    try {
      const res = await api.put(`users/${user.id}`, form);
      if (res) {
        toast.success("Update success", { autoClose: 1500 });
      } else {
        toast.error("Update fail", { autoClose: 1500 });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(form);
  };

  return (
    <div>
      <div className="p-6 bg-white  rounded-lg">
        <form action="" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">THÔNG TIN TÀI KHOẢN</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                className="mt-[14px]"
                id="firstName"
                value={form.firstName || ""}
                placeholder="Nhập họ và chữ đệm"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Tên</Label>
              <Input
                className="mt-[14px]"
                id="username"
                value={form.username || ""}
                onChange={handleChange}
              />
              {error.username && (
                <p style={{ color: "red" }}>{error.username}</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email liên hệ</Label>
            <Input
              className="mt-[14px]"
              id="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Nhập Email liên hệ"
            />
            {error.email && <p style={{ color: "red" }}>{error.email}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              className="mt-[14px]"
              id="phone"
              value={form.phone || ""}
              onChange={handleChange}
            />
            {error.phone && <p style={{ color: "red" }}>{error.phone}</p>}
          </div>
          <div className="mb-4">
            <Label htmlFor="dob">Ngày sinh</Label>
            <div className="relative">
              <input
                type="date"
                id="birthday"
                placeholder="dd/mm/yyyy"
                value={form.birthday || ""}
                onChange={handleChange}
                className="mt-[14px] w-full px-3 py-2 border rounded-md outline-none"
              />
            </div>
          </div>

          <div className="relative">
            {/* Form nhập địa chỉ (ẩn/hiện) */}
            {isAddressFormOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h3 className="text-lg font-medium mb-4">Nhập địa chỉ</h3>

                  {/* Chọn Tỉnh */}
                  <div className="mb-4">
                    <Select
                      options={provinces}
                      value={selectedProvince}
                      onChange={setSelectedProvince}
                      placeholder="Chọn tỉnh"
                      className="mb-2 w-full"
                    />
                  </div>

                  {/* Chọn Huyện */}
                  <div className="mb-4">
                    <Select
                      options={districts}
                      value={selectedDistrict}
                      onChange={setSelectedDistrict}
                      placeholder="Chọn huyện"
                      isDisabled={!selectedProvince}
                      className="mb-2 w-full"
                    />
                  </div>

                  {/* Chọn Xã */}
                  <div className="mb-4">
                    <Select
                      options={wards}
                      value={selectedWard}
                      onChange={setSelectedWard}
                      placeholder="Chọn xã"
                      isDisabled={!selectedDistrict}
                      className="mb-2 w-full"
                    />
                  </div>

                  {/* Nhập số nhà, tên đường */}
                  <div className="mb-4">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Số nhà, tên đường"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                    />
                  </div>

                  {/* Nút Lưu và Đóng */}
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setIsAddressFormOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => setIsAddressFormOpen(false)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <p
                onClick={() => setIsAddressFormOpen(true)}
                className="text-blue-500 cursor-pointer"
              >
                Nhập địa chỉ
              </p>
            </div>

            {/* Hiển thị thông tin đã chọn */}
            <div className="mb-4">
              <Input
                className="mt-[14px]"
                id="address"
                value={
                  streetAddress || selectedWard?.label || selectedDistrict?.label || selectedProvince?.label
                    ? `${streetAddress ? `${streetAddress}, ` : ""}${selectedWard?.label ? `${selectedWard.label}, ` : ""
                    }${selectedDistrict?.label ? `${selectedDistrict.label}, ` : ""}${selectedProvince?.label ? selectedProvince.label : ""
                    }`
                    : form.address || ""
                }
                onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
              />
            </div>
            {validationErrors.address && (
              <p className="text-red-500 mt-1">{validationErrors.address}</p>
            )}
          </div>

          <Button
            type="submit"
            className="cursor-pointer relative w-[130px] h-[40px] text-white font-bold py-2 rounded-[6px] border border-[#3f7df6] overflow-hidden transition-colors duration-300 group"
          >
            <span className="absolute inset-0 bg-[#3f7df6] transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
            <span className="absolute inset-0 bg-white translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
            <span className="font-[500] relative z-10 text-white group-hover:text-[#3f7df6]">
              CẬP NHẬT
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InfoUsers;
