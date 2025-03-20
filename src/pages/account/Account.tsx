import React, { useEffect, useState, ReactNode } from 'react'
import Header from '@/components/header/Header'
import ServiceMenu from '@/components/ServiceMenu'
import Layout from '@/components/layout/Layout'
import InfoUsers from '@/components/infoUsers/InfoUsers'
import InfoShoppingCard from '@/components/infoShoppingCard/InfoShoppingCard'
import { LockKeyholeOpen, LogOut, ShoppingCart, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ChangePassword from '@/components/changePassword/ChangePasssword'

interface TypeNavbarItem {
  id: string;
  label: string;
  icon: ReactNode; // ReactNode để có thể chứa JSX như icon
}

const Account = () => {
  const [selectTab, setSelectTab] = useState(() => {
    return localStorage.getItem("selectedTab") || "info";
  })
  const navigate = useNavigate()

  const dataNavbar : TypeNavbarItem[] = [
    { id: "info", label: "Thông tin tài khoản", icon: <User/> },
    { id: "password", label: "Đổi mật khẩu",icon: <LockKeyholeOpen/>  },
    { id: "orders", label: "Đơn hàng" ,icon: <ShoppingCart/>  },
    { id: "logout", label: "Đăng xuất",icon: <LogOut/>  },
  ]


  const handleSelectTab = (item: string) => {
    console.log(item)
    if(item === 'logout') {
      navigate('/login')
    } else {
      setSelectTab(item)
      localStorage.setItem("selectedTab", item);
    }
  }
  console.log(selectTab)

  return (
    <Layout>
        <div className='layout flex-col'>
          <Header/>
          <div className="flex-shrink-0  xl:mx-[4%] custom-content-account  max-md:mx-[6%]  py-8 max-sm:mx-0 max-md:pr-2 max-md:pl-2 max-xl:">
            <div className="hidden md:block ">
              <ServiceMenu /> 
            </div>
            <div className='bg-white shadow-2xl my-[50px] flex gap-[5px] max-lg:mx-[10px]  max-md:flex-col max-md:max-w-[540px] max-sm:m-[auto]'>
              <div className=' w-[25%] max-sm:w-[100%] max-md:w-[100%]'>
                <div className='text-[#212529] text-[15px] flex flex-col items-center p-[10px] border-b border-[#F7F8FA]'>
                  <p className='font-medium '>KH00094915970282</p>
                  <p>Hữu An Sport Quy Nhơn</p>
                </div>
                <ul className='text-[#4a4a4a]'>
                  {dataNavbar.map((item) => (
                    <li key={item.id}>
                      <a href="" 
                        className={`
                          ${item.id === selectTab ? 'bg-[#0f35c4] text-[#fff]' : ''}
                          flex p-[10px] hover:bg-[#0f35c4] hover:text-[#fff]
                          `}
                        onClick={() => handleSelectTab(item.id)}
                      >
                        {item.icon}
                        <p className='ml-[20px]'>{item.label}</p>
                      </a>
                    </li>
                    
                  ))}
                </ul>
              </div>
              <div className='flex-[1] max-md:w-[100%]'>
                { selectTab === 'info' && <InfoUsers/>  }
                { selectTab === 'password' && <ChangePassword/>  }
                { selectTab === 'orders' && <InfoShoppingCard/>  }
              </div>
            </div>
          </div>
        </div>
      </Layout>

  )
}

export default Account