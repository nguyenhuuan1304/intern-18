import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ArrowLeft } from "lucide-react";
import forgotPassword from "@/assets/forgot-password.jpg";
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
const formSchema = z.object({
  email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
 
});
const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className=" w-[1100px]">
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quên mật khẩu
            </h2>
            <p className="text-gray-600 mb-8">
              Vui lòng điền email bạn đã đăng ký cho tài khoản muốn khôi phục
              mật khẩu, chúng tôi sẽ gửi email cho bạn
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập email"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
                >
                  Xác nhận
                </button>
              </form>
            </Form>
            <div className="flex justify-between">
              <p className="text-center mt-6 text-gray-600 flex">
                <ArrowLeft className="text-blue-600 mr-3 h-5 w-5" />
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  Quay lại
                </Link>
              </p>
              <p className="text-center mt-6 text-gray-600"></p>
            </div>
          </motion.div>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br p-12">
          <motion.div
            className="flex w-1/2 items-center justify-center p-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 100, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <img
              src={forgotPassword}
              alt="Login background"
              className="h-auto  max-w-lg "
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
