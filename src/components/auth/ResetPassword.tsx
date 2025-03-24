import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  Check,
} from "lucide-react";
import resetPassword from "@/assets/resetpassword3.jpg";
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
import { resetPasswordUser } from "@/store/auth.slice";
import { Button } from "../ui/button";
const formSchema = z
  .object({
    code: z.string().min(1, "Mã xác nhận không được để trống"),
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
    passwordConfirmation: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });
const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const code = searchParams.get("code") ?? undefined;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: code,
      password: "",
      passwordConfirmation: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await dispatch(
        resetPasswordUser({
          code: values.code,
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        })
      ).unwrap();
      toast.success("Khôi phục mật khẩu thành công");
      navigate("/login");
    } catch (error) {
      toast.error("Mã xác nhận không đúng");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white  overflow-hidden flex flex-col md:flex-row">
        {/* Left Column - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Về trang chủ</span>
            </Link>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Khôi phục mật khẩu
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng điền mật khẩu mới và xác nhận mật khẩu để hoàn tất quá
              trình đặt lại mật khẩu.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm ">Mật khẩu mới</FormLabel>
                      <div className="relative ">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
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
                  name="passwordConfirmation"
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
                      <Check size={45} />
                      <span className="text-[15px]">Xác nhận</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <div className="mt-6 flex justify-start">
              <Link
                to="/register"
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Quay lại</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Image */}
        <div className="w-full md:w-1/2 bg-gradient-to-br  flex items-center justify-center p-6 md:p-8">
          <motion.div
            className="w-full sm:w-2/3 md:w-full"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 10, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <img
              src={resetPassword}
              alt="Forgot Password"
              className="w-full object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
