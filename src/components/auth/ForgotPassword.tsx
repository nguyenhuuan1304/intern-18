import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ArrowLeft, Loader2, Check } from "lucide-react";
import forgotPassword from "@/assets/fg.jpg";
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
import { forgotPasswordUser } from "@/store/auth.slice";
import { Button } from "../ui/button";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});
const ForgotPassword: React.FC = () => {
  const { loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await dispatch(
        forgotPasswordUser({
          email: values.email,
        })
      ).unwrap();
      toast.success("Nhấn vào link trong email để khôi phục mật khẩu!");
      form.reset();
    } catch (error: any) {
      const erroMessage = error?.error.message;
      toast.error(erroMessage);
    }
  };
  return (
    // <div className="container mx-auto px-4 py-8 mt-6 sm:mt-8 lg:w-6xl">
    //   <div className="w-full rounded-2xl flex flex-col lg:flex-row">
    //     <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
    //       <div className="flex items-center mb-6 md:mb-8">
    //         <Link
    //           to="/"
    //           className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
    //         >
    //           <ArrowLeft className="h-5 w-5 mr-2" />
    //           <span className="text-sm sm:text-base">Về trang chủ</span>
    //         </Link>
    //       </div>

    //       <motion.div
    //         initial={{ y: 20, opacity: 0 }}
    //         animate={{ y: 0, opacity: 1 }}
    //         transition={{ delay: 0.2 }}
    //       >
    //         <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
    //           Quên mật khẩu
    //         </h2>
    //         <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
    //           Vui lòng điền email bạn đã đăng ký cho tài khoản muốn khôi phục
    //           mật khẩu, chúng tôi sẽ gửi email cho bạn.
    //         </p>

    //         <Form {...form}>
    //           <form
    //             onSubmit={form.handleSubmit(onSubmit)}
    //             className="space-y-4 sm:space-y-6"
    //           >
    //             <FormField
    //               control={form.control}
    //               name="email"
    //               render={({ field }) => (
    //                 <FormItem>
    //                   <FormLabel>Email</FormLabel>
    //                   <div className="relative">
    //                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    //                     <FormControl>
    //                       <Input
    //                         {...field}
    //                         placeholder="Nhập email"
    //                         className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
    //                         disabled={loading}
    //                       />
    //                     </FormControl>
    //                   </div>
    //                   <FormMessage />
    //                 </FormItem>
    //               )}
    //             />

    //             <Button
    //               type="submit"
    //               disabled={loading}
    //               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200 mt-4"
    //             >
    //               {loading ? (
    //                 <>
    //                   <Loader2 className="h-5 w-5 animate-spin" />
    //                   <span className="text-sm sm:text-[15px]">
    //                     Đang xử lý...
    //                   </span>
    //                 </>
    //               ) : (
    //                 <>
    //                   <Check />
    //                   <span className="text-sm sm:text-[15px]">Xác nhận</span>
    //                 </>
    //               )}
    //             </Button>
    //           </form>
    //         </Form>

    //         <div className="mt-4 sm:mt-6 flex justify-start">
    //           <Link
    //             to="/register"
    //             className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
    //           >
    //             <ArrowLeft className="h-5 w-5 mr-2" />
    //             <span className="text-sm sm:text-base">Quay lại</span>
    //           </Link>
    //         </div>
    //       </motion.div>
    //     </div>

    //     {/* Right Column - Image */}
    //     <div className="hidden md:flex md:w-1/2 bg-gradient-to-br items-center justify-center">
    //       <motion.div
    //         className="w-2/3 sm:w-full md:w-2/3"
    //         initial={{ x: -100, opacity: 0 }}
    //         animate={{ x: 10, opacity: 1 }}
    //         transition={{ duration: 2, ease: "easeInOut" }}
    //       >
    //         <img
    //           src={forgotPassword}
    //           alt="Forgot Password"
    //           className="w-full object-cover rounded-lg"
    //         />
    //       </motion.div>
    //     </div>
    //   </div>
    // </div>
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
              Quên mật khẩu
            </h2>
            <p className="text-gray-600 mb-6 w-[270px] sm:w-full ">
              Vui lòng điền email bạn đã đăng ký cho tài khoản muốn khôi phục
              mật khẩu
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
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
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm sm:text-[15px]">
                        Đang xử lý...
                      </span>
                    </>
                  ) : (
                    <>
                      <Check />
                      <span className="text-sm sm:text-[15px]">Xác nhận</span>
                    </>
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
              src={forgotPassword}
              alt="Register background"
              className="max-w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
