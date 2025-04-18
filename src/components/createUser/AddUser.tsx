import React, { useState } from 'react'
import { Input } from '../ui/input'
import { CheckCircle, Eye, EyeOff, Mail, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from 'react-toastify';
import { registerUser } from '@/store/auth.slice';
import { useAppDispatch } from '@/store/store';

interface TypeElement {
    element: HTMLElement |null,
  }

const formSchema = z
  .object({
    username: z.string().min(1, "Tên đăng nhập không được để trống!"),
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
    passwordConfirmation: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu không khớp",
    path: ["passwordConfirmation"],
  });



const AddUser:  React.FC<TypeElement> = ({element}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const dispatch = useAppDispatch()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        },
    });

    const handleCloseAddNews = () => {
        if(element) {
            element.style.display = 'none'
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const user = {
                username: values.username,
                email: values.email,
                password: values.password,
            };
            const res = await dispatch(registerUser(user)).unwrap();
            if (res.user) {
                toast.success("Đăng ký thành công");
                handleCloseAddNews()
            }   
        } catch (error) {
          console.log("error", error);
          const errorMessage = error?.error.message;
          toast.error(errorMessage);
        }
      };
  return (
    <div className='relative md:w-[50%] max-md:h-screen bg-white text-[#000] m-[auto] md:mt-[50px] p-[20px]'>
        <div className="absolute top-[4px] right-[12px] ">
            <button 
                className="cursor-pointer p-[10px] text-[#fff] bg-[#2b7fff] hover:bg-blue-600 rounded-[4px]"
                onClick={handleCloseAddNews}
            >
            <X/>
            </button>
        </div>
        <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                <h2 className="text-xl font-bold mb-4">Tạo User</h2>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm ">Tên đăng nhập</FormLabel>
                        <div className="relative ">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                            <Input
                            {...field}
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            //   disabled={loading}
                            />
                        </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm mt-5 '>Email liên hệ</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập email liên hệ"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            // disabled={loading}
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
                    <FormItem className="">
                        <FormLabel className="text-sm mt-5 ">
                        Mật khẩu
                        </FormLabel>
                        <div className="relative">
                        <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                            <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới"
                            className="w-full px-10 py-6 border rounded-lg  focus:outline-blue-500 focus:outline-2 transition-colors"
                            //   disabled={loading}
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
                  <FormItem className="">
                    <FormLabel className="text-sm  mt-5">
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
                        //   disabled={loading}
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
                    className="mt-6 cursor-pointer relative w-[130px] h-[40px] text-white font-bold py-2 rounded-[6px] border border-[#3f7df6] overflow-hidden transition-colors duration-300 group"
                    // disabled={loading}
                >
                <span className="absolute inset-0 bg-[#3f7df6] transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute inset-0 bg-white translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
                <span className="font-[500] relative z-10 text-white group-hover:text-[#3f7df6]">submit</span>
                </Button>
                {/* <Button
                    type="submit"
                    className="mt-6 cursor-pointer relative w-[130px] h-[40px] text-white font-bold py-2 rounded-[6px] border border-[#3f7df6] overflow-hidden transition-colors duration-300 group"
                    // disabled={loading}
                >
                <span className="absolute inset-0 bg-[#3f7df6] transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
                <span className="absolute inset-0 bg-white translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
                <span className="font-[500] relative z-10 text-white group-hover:text-[#3f7df6]">Edit</span>
                </Button> */}
            </form>
        </Form>
    </div>
  )
}

export default AddUser