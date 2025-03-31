import React from 'react'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'

const AddUser = () => {
  return (
    <div className='w-[50%] bg-white text-[#000] m-[auto]'>
        <form action="">
            <h1>Add User</h1>
            <div>
                <Label htmlFor="address">Tên đăng nhập</Label>
                <Input
                className="mt-[14px]"
                id="address"
                // value={form.address || ""}
                // onChange={handleChange}
                placeholder="Tên đăng nhập của bạn"
                />
            </div>
            <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                className="mt-[14px]"
                id="address"
                // value={form.address || ""}
                // onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
                />
            </div>
            <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                className="mt-[14px]"
                id="address"
                // value={form.address || ""}
                // onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
                />
            </div>
        </form>
    </div>
  )
}

export default AddUser