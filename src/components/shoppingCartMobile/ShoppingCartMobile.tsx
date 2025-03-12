import React from 'react'
import { X } from 'lucide-react'


const ShoppingCartMobile = ({show} : {show : boolean}) => {


  return (
    <div className={`lg:hidden sm:hidden shoppingMobile ${show ? "show1" : "hidden"}`}>
        <div className='bg-[#000] text-[#fff] h-[50px] w-full flex relative'>
            <h1 className='text-[22px] font-[500] line-[20px] w-[90%] items-center m-[auto] text-center'>GIỎ HÀNG</h1>
            <div className='absolute right-[16px] bottom-[16px]'>
                <X/>
            </div>
        </div>
        <div className='h-[60px] flex items-center justify-center mt-[120px]'>
            <a className='bg-[#000] text-[#fff] pr-[25px] pl-[25px] pt-[10px] pb-[10px] mr-[5px] rounded-[6px]'>
                CHỌN THÊM
            </a>
            <a href="" className='bg-[red] text-[#fff] pr-[25px] pl-[25px] pt-[10px] pb-[10px] rounded-[6px]'>
                ĐẶT NGAY
            </a>
        </div>
    </div>
  )
}

export default ShoppingCartMobile