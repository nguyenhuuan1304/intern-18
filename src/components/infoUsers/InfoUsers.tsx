import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


const InfoUsers = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [address, setAddress] = useState('')




  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('firstName',firstName)
    console.log('lastName',lastName)
    console.log('email',email)
    console.log('phone',phone)
    console.log('date',date)
    console.log('address',address)

  }

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
                value={firstName}
                placeholder="Nhập họ và chữ đệm" 
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Tên</Label>
              <Input 
                className="mt-[14px]" 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email liên hệ</Label>
            <Input 
              className="mt-[14px]" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập Email liên hệ" />
          </div>
          <div className="mb-4">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input 
              className="mt-[14px]" 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="dob">Ngày sinh</Label>
            <div className="relative">
            <input
              type="date"
              placeholder="dd/mm/yyyy"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-[14px] w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input 
              className="mt-[14px]" 
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ của bạn" 
            />
          </div>
          <Button type="submit" className="cursor-pointer relative w-[130px] h-[40px] text-white font-bold py-2 rounded-[6px] border border-[#3f7df6] overflow-hidden transition-colors duration-300 group">
            <span className="absolute inset-0 bg-[#3f7df6] transition-transform duration-300 ease-in-out group-hover:translate-x-full"></span>
            <span className="absolute inset-0 bg-white translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
            <span className="font-[500] relative z-10 text-white group-hover:text-[#3f7df6]">CẬP NHẬT</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default InfoUsers