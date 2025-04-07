import { House,Newspaper,Store,User } from 'lucide-react'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom'
import ShoppingCartMobile from '../shoppingCartMobile/ShoppingCartMobile'

const NavbarMobile = () => {
    const [showShoppingCart , setShowShoppingCart] = useState(false)
    const location = useLocation();
    const pathToActive = {
        '/': 'home',
        '/tin-tuc': 'news',
        '/account': 'user'
    };
    const [active, setActive] = useState(pathToActive[location.pathname as keyof typeof pathToActive] || '' )

    const showShoppingMobile = () => {
       setShowShoppingCart(!showShoppingCart)
    }

    const handleActive = (name:string) => {
        setActive(name)
    }
  return (
    <div>
        <ShoppingCartMobile show={showShoppingCart}/>
        <div id='navbar-Mobile' className='lg:hidden sm:hidden custom-navbar-mobile'>
            <div onClick={() => handleActive('home')}>
                <NavLink 
                    to={'/'}
                    className={active === 'home' ? 'text-blue-500' : ''}
                >
                    <House />
                </NavLink>
            </div>
            <div onClick={() => handleActive('user')}>
                <NavLink 
                    to={'/tin-tuc'}
                    className={active === 'news' ? 'text-blue-500' : ''}
                >
                    <Newspaper />
                </NavLink>
            </div>
            <div className='relative'  onClick={showShoppingMobile}>
                <div 
                    onClick={() => handleActive('store')}
                    className={active === 'store' ? 'text-blue-500' : ''}
                >
                    <Store className='w-full'/>
                </div>
                <div className='absolute  right-[-12px] top-[-6px] flex items-center justify-center text-[#fff] bg-[red] w-[20px] h-[20px] rounded-full  '>
                    <span>0</span>
                </div>
            </div>
            <div onClick={() => handleActive('user')}>
                <NavLink 
                    to={'/account'}
                    className={active === 'user' ? 'text-blue-500' : ''}
                >
                    <User />
                </NavLink>
            </div>
        </div>
    </div>
    
  )
}

export default NavbarMobile