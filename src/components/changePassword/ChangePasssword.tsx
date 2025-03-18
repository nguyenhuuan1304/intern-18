import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";


const ChangePassword = () => {
  const [oldPassWord , setOldPassWord] = useState('')
  const [newPassWord,setNewPassWord] = useState('')
  const [confirmNewPassword,setConfirmNewPassword] = useState('')
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });


  const handleTogglePassWord = (type :'old' | 'new' | 'confirm') => {
    setShowPassword(pre => (
      {
        ...pre,
        [type] : !pre[type]
      }
    ));
  }


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(newPassWord !== confirmNewPassword) {
      setError('Mật khẩu không khớp')
    } else {
      setError('')
    }
    console.log('oldPassWord',oldPassWord)
    console.log('newPassWord',newPassWord)
    console.log('confirmNewPassword',confirmNewPassword)
    console.log('error',error)
  }


  return (
    <div>
      <div className="p-6 bg-white  rounded-lg">
        <form action="" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">THÔNG TIN TÀI KHOẢN</h2>
          <div className="relative mb-4">
            <Label htmlFor="mật khẩu cũ">Mật khẩu cũ</Label>
            <Input 
              type={showPassword.old ? 'password' : 'text'}
              className="mt-[14px]" 
              value={oldPassWord}
              onChange={(e) => setOldPassWord(e.target.value)}
              placeholder="Nhập lại mật khẩu cũ" 
            />
            <button
              type="button"
              className="absolute top-[46%] inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition"
              onClick={() => handleTogglePassWord('old')}
            > 
              {showPassword ? <EyeOff  size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative mb-4">
            <Label htmlFor="phone">Nhập mật khẩu mới</Label>
            <Input 
              type={showPassword.new ? 'password' : 'text'}
              className="mt-[14px]" 
              value={newPassWord} 
              onChange={(e) => setNewPassWord(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
             <button
              type="button"
              className="absolute top-[46%] inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition"
              onClick={() => handleTogglePassWord('new')}
            >
              {showPassword ? <EyeOff  size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative mb-4">
            <Label htmlFor="phone">Nhập lại mật khẩu mới</Label>
            <Input 
              type={showPassword.confirm ? 'password' : 'text'}
              className="mt-[14px]" 
              value={confirmNewPassword} 
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Nhập lại mật mới"
            />
            <button
              type="button"
              className="absolute top-[46%] inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500 transition"
              onClick={() => handleTogglePassWord('confirm')}
            >
              {showPassword ? <EyeOff  size={20} /> : <Eye size={20} />}
            </button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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

export default ChangePassword