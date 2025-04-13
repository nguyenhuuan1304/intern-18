import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  Mail,
  Loader2,
  UserPlus2,
  PhoneCall,
  MapPin,
} from "lucide-react";
import bgRegister from "@/assets/bgRegister.webp";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { registerUser } from "@/store/auth.slice";
import { Button } from "../ui/button";

const formSchema = z
  .object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/(?=.*[a-z])/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(/(?=.*[A-Z])/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(/(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 số")
      .regex(
        /(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
      ),
    confirmPassword: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    phone: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(/^\d{10}$/, "Số điện thoại phải có 10 chữ số"),
    address: z.string().min(1, "Địa chỉ không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const registerPayload = {
        email: values.email,
        username: values.username,
        password: values.password,
        phone: values.phone,
        address: values.address,
      };
      const res = await dispatch(registerUser(registerPayload)).unwrap();
      if (res.user) {
        toast.success("Đăng ký thành công");
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error?.error.message;
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 lg:w-6xl">
      <div className="w-full rounded-2xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6 md:mb-8">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Về trang chủ</span>
            </Link>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Đăng ký
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8">
              Tham gia cùng chúng tôi👋
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập tên đăng nhập"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email liên hệ</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập email liên hệ"
                              className="w-full px-10 py-6  border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                              disabled={loading}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Số điện thoại</FormLabel>
                        <div className="relative">
                          <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập số điện thoại"
                              className="w-full px-10 py-6  border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                              disabled={loading}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập địa chỉ"
                            className="w-full px-10 py-6  border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm">Mật khẩu</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Nhập mật khẩu"
                              className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                              disabled={loading}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm">
                          Xác nhận mật khẩu
                        </FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Xác nhận mật khẩu"
                              className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                              disabled={loading}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200 mt-4"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      <span className="text-sm sm:text-[15px]">
                        Đang xử lý...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-[15px]">Đăng ký</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center mt-6 text-gray-600 text-sm sm:text-base">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </motion.div>
        </div>

        <div className="hidden md:flex md:w-1/2 lg:w-1/2 bg-gradient-to-br items-center justify-center">
          <motion.div
            className="flex items-center justify-center p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={bgRegister}
              alt="Register background"
              className="max-w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
