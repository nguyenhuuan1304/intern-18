import { House,Columns4,Store,ShoppingBag,User } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import ShoppingCartMobile from '../shoppingCartMobile/ShoppingCartMobile'

const NavbarMobile = () => {
    const [showShoppingCart , setShowShoppingCart] = useState(false)

    const showShoppingMobile = () => {
       setShowShoppingCart(!showShoppingCart)
    }

  return (
    <div>
        <ShoppingCartMobile show={showShoppingCart}/>
        <div id='navbar-Mobile' className='lg:hidden sm:hidden custom-navbar-mobile'>
            <div>
                <NavLink to={'/'}>
                    <House />
                    <span>Trang chủ</span>
                </NavLink>
            </div>
            <div>
                <NavLink to={'/danh-muc-san-pham'}>
                    <Columns4 />
                    <span>Danh mục</span>
                </NavLink>
            </div>
            <div className='relative'  onClick={showShoppingMobile}>
                <div>
                    <Store className='w-full'/>
                    <span>Giỏ hàng</span>
                </div>
                <div className='absolute top-0 -right-1 flex items-center justify-center text-[#fff] bg-[red] w-[20px] h-[20px] rounded-full  '>
                    <span>0</span>
                </div>
            </div>
            <div>
                <a href="">
                    <ShoppingBag/>
                    <span>Đơn hàng</span>
                </a>
            </div>
            <div>
                <NavLink to={'/'}>
                    <User />
                    <span>tài khoản</span>
                </NavLink>
            </div>
        </div>
    </div>
    
  )
}

export default NavbarMobile