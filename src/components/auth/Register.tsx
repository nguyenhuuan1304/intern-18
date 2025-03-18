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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {loading} = useAppSelector((state) => state.auth);
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
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const registerPayload = {
        email: values.email,
        username: values.username,
        password: values.password,
      };
      const res = await dispatch(registerUser(registerPayload)).unwrap();
      if(res.user) {
       toast.success("Đăng ký thành công");
      navigate("/login")
      }
    } catch (error ) {
     if (error instanceof Error) {
     toast.error("Email hoặc tên đăng nhập đã tồn tại!");
  } 
    }
  };
  return (
    <div className=" container w-full md:w-[100%]">
      <div className="w-full rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row ">
        {/* Left Column - Form and extra content */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center mb-8">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h2>
            <p className="text-gray-600 mb-8">Tham gia cùng chúng tôi👋</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email liên hệ</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập email liên hệ"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm ">Mật khẩu</FormLabel>
                        <div className="relative ">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Nhập mật khẩu"
                              className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                              disabled={loading}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
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
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm ">
                          Xác nhận mật khẩu
                        </FormLabel>
                        <div className="relative">
                          <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-[15px]">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus2 />
                      <span className="text-[15px]">Đăng ký</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center mt-6 text-gray-600">
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
        <div className="flex  md:w-1/2 bg-gradient-to-brp-12 items-center justify-center">
          <motion.div
            className="flex w-1/2 items-center justify-center p-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 10, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <img
              src={bgRegister}
              alt="Register background"
              className="max-w-sm md:max-w-lg  object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
