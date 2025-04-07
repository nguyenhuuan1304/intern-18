import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";
import loginBg from "@/assets/login-bg.svg";
import loginTree from "@/assets/login-tree.svg";
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
import { loginUser } from "@/store/auth.slice";
import { Button } from "../ui/button";
const formSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống!"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/(?=.*[a-z])/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/(?=.*[A-Z])/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    ),
});
const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const loginPayload = {
        identifier: values.username,
        password: values.password,
      };
      const res = await dispatch(loginUser(loginPayload)).unwrap();
      console.log(res.user)
      if (res.user) {
        toast.success("Đăng nhập thành công");
        navigate("/");
        const userData = {
          jwt: res.jwt,
          username: res.user.username,
          email: res.user.email,
          id : res.user.id,
          phone: res.user.phone,
          birthday: res.user.birthday,
          address: res.user.address,
          firstName: res.user.firstName,
          documentId: res.user.documentId,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        if(res.user.username === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      const errorMessage = error?.error?.message;
      toast.error(errorMessage);
    }
  };
  return (
    <div className="container w-full max-w-screen-lg mx-auto px-2 md:px-4 md:w-[1100px]">
      <div className="w-full  overflow-hidden flex flex-col md:flex-row  ">
        {/* Left Column - Form */}
        <div className="w-full md:w-1/2 p-10 ">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
            <p className="text-gray-600 mb-8">Chào mừng bạn quay trở lại! 👋</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 "
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
                            placeholder="Nhập họ tên"
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-sm">Mật khẩu</FormLabel>
                        <FormLabel
                          className="text-sm text-blue-700 cursor-pointer"
                          onClick={() => navigate("/forgot")}
                        >
                          Quên mật khẩu ?
                        </FormLabel>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                      <LogIn size={45} />
                      <span className="text-[15px]">Đăng nhập</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className="text-center mt-6 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Column - Image */}
        <div className="flex w-full md:w-1/2 p-6 md:p-8 bg-gradient-to-br ">
          <motion.div
            className="flex w-1/2 items-center justify-center p-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: -10, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <img
              src={loginBg}
              alt="Login background"
              className="max-w-52 md:max-w-96  h-auto"
            />
          </motion.div>
          <div className="flex md:w-1/2 items-center justify-center p-2 md:p-4 lg:p-6">
            <img
              src={loginTree}
              alt="Login tree"
              className="max-w-32 md:max-w-96 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
