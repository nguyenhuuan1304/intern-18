import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import { Search ,X , AlignJustify} from 'lucide-react'
import {NavLink } from 'react-router-dom'
import http from '@/hooks/useAxios'
import useDebounce from '@/hooks/useDebounce'
import NavbarMobile from '../navbarMobile/NavbarMobile'

interface typeImage {
    Image: string,
    formats: {
        thumbnail: {
            url: string
        }
    },
}

interface typeProduct {
    documentId:string,
    name:string,
    color: string,
    prices: number,
    Image: typeImage,
}


const Header = () => {
    const [value, setValue] = useState('')
    const [valueIpad, setvalueIpad] = useState('')
    const [circle, setCircle] = useState(false)
    const [arrSearch, setArrSearch] = useState<typeProduct[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const inputRefIpad = useRef<HTMLInputElement>(null)



    const debounce = useDebounce(value || valueIpad,500)

    useEffect(() => {
        if(!debounce.trim()) {
            setArrSearch([])
            return
        }
        
        http.get(`/products?query=${debounce}`)
            .then(res => res.data)
            .then(res => {
                const configData : typeProduct[] = Object.values(res.reduce((acc: { [key: string]: typeProduct }, item: typeProduct) => {
                    // console.log(acc)
                    acc[item.documentId] = item
                    return acc
                }, {}))
                if(configData) {
                    setArrSearch(configData)
                } else {
                    return
                }
        })

    },[debounce])

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        setCircle(true)
    }

    const handleCircle = () => {
        setValue('')
        setCircle(false)
        if(inputRef.current) {
            inputRef.current.focus();
        }

    }


    const showSearchMobile = () => {
        const search = document.getElementById("search-Mobile");
        console.log(search)
        if (search) {
            search.classList.add("show");
        }
    }

    const handleCircleIpad = () => {
        setvalueIpad('')
        
        if(inputRefIpad.current) {
            inputRefIpad.current.focus();
        }

        const search = document.getElementById("search-Mobile");
        if (search) {
            search.classList.remove("show");
        }

    }

    const thumbnailUrls : {price:number ,name:string,thumbnailUrl:string}[] = arrSearch.map(product => ({
        price: product.prices ,
        name: product.name,
        thumbnailUrl: product.Image?.formats?.thumbnail?.url || "Không có ảnh"
    }));
    // console.log(arrSearch)

  return (
    <div className='layout'>
        <div className='custom-header custom-header-mobile headerSmall
            xl:mr-[100px] xl:ml-[100px] lg:items-center lg:grid xl:grid-cols-[256px_1fr] lg:gap-x-[5px] lg:h-[125px] lg:pt-1.5 lg:pb-1.5'>
            <div className='lg:hidden text-[#fff]'>
                <AlignJustify/>
            </div>
            <div className='row-span-2 md:w-[150px]'>
                <NavLink to={'/'} className=''>
                    <img 
                        className='md:w-[150px]'
                        src="https://kawin.vn/uploads/source//logo/z4795324951181-8df678a6cf3f0283a5b110357eb0c396.webp" alt="" />
                </NavLink>
            </div>
            <button className='lg:hidden '
                onClick={showSearchMobile}
            >
                <Search className='to text-[#fff]'/>
            </button>

            <div className='custom-input-mobile  lg:flex lg:h-[46px] lg:relative'>
                <div className=' custom-input 2xl:w-[420px] lg:h-[46px] lg:mr-[40px] lg:relative'>
                    <form action="" className='flex flex-row w-full h-full rounded-[20px] overflow-hidden border border-blue-600'>
                        <input
                            className='lg:mr-[32px] lg:w-[350px] lg:py-2.5 lg:px-3.5 lg:text-base lg:font-normal lg:leading-[1.5] lg:outline-none ' 
                            type="text" 
                            value={value}
                            ref={inputRef}
                            placeholder='Nhập sản phẩm tìm kiếm'
                            onChange={handleInput}
                        />
                        
                        <button className='custom-search bg-[#0f35c4] w-[70px] cursor-pointer hover:bg-[#4157a6]'>
                            <Search className='m-auto text-[#fff]'/>
                        </button>
                    </form>
                    {circle &&
                        <button 
                            className='absolute top-[12px] right-[80px]'
                            onClick={handleCircle}
                        >
                            <X size={22} strokeWidth={0.5} />
                        </button>
                    }

                    {value === '' || circle && 
                        <div className=' absolute top-[60px] z-[99] max-h-[336px] w-[420px] bg-white rounded-[5px] shadow-[0_4px_60px_0_rgba(0,0,0,0.2)]'>
                            <div className='bg-[#f5f5f5] h-[36px] flex items-center'>
                                <span className='p-[10px] text-[13px] text-[#666]'>sản phẩm gợi ý</span>
                            </div>
                            {arrSearch.length != 0 && 
                                <div className=''>
                                    <div className='product-slider-vertical scroll-area'>
                                        {thumbnailUrls.map((item,index) => (
                                            <div key={index} className='flex p-[10px]'>
                                                <div className='w-[75px] h-[75px] mr-[10px]'>
                                                    <img className='object-cover h-full' src={`http://localhost:1337/${thumbnailUrls[0].thumbnailUrl}`} alt="" />
                                                </div>
                                                <div>
                                                    <h3 className='mb-[10px] text-[14px] text-[#323c3f]'>{item.name}</h3>
                                                    <span className='text-[#ff5c5f]'>{item.price}đ</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ||
                                <div className='bg-[#fff] h-[36px] flex items-center'>
                                    <span className='p-[10px] text-[13px] text-[#666]'>Không có kết quả tìm kiếm</span>
                                </div>
                            }
                        </div>
                    }
                </div>

                <div className='flex grow justify-between'>
                    <div>
                        <NavLink to="/account/order" className='text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[10px] h-full items-center'>
                            <div>
                                <img src="https://kawin.vn/uploads/source//icon/shopping-list-1.webp" alt="" />
                            </div>
                            <div>
                                <p>kiểm tra đơn hàng</p>
                            </div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={'/account'}   className='text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[10px] h-full items-center'>
                            <div>
                                <img src="https://kawin.vn/uploads/source//icon/account-(1)-1.webp" alt="" />
                            </div>
                            <div>
                                <p>Hi, Hữu An Sport Quy Nhơn</p>
                            </div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to="/login" className='text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[10px] h-full items-center'>
                            <div>
                                <img src="https://kawin.vn/uploads/source//icon/account-1.webp" alt="" />
                            </div>
                            <div>
                                <p>Đăng xuất</p>
                            </div>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to={"/thanh-toan"} className='text-[#343434] w-[auto] grid grid-cols-[30px_auto] gap-[10px] h-full items-center'>
                            <div className='relative'>
                                <img src="https://kawin.vn/uploads/source//icon/group.webp" alt="" />
                                <span className='absolute top-[-10px] right-[-10px] w-[20px] h-[20px] rounded-full leading-[18px] text-center bg-[#ef4562] text-white'>
                                    0
                                </span>
                            </div>
                            <div>
                                <p>Giỏ hàng</p>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className='custom-input-mobile bg-[#0f35c4] text-[#fff] mt-[20px]'>
                <ul className='flex items-center h-[45px]'>
                    <li className='border-r'>
                        <NavLink to={"/"} className='flex items-center h-full pl-[20px] pr-[20px]'>
                            <div>
                                <img src="https://kawin.vn/uploads/source//icon/home-1.webp" alt="" />
                            </div>
                            <span className='text-[14px] font-[500] leading-[25px] ml-[10px]'>TRANG CHỦ</span>
                        </NavLink>
                    </li>
                    <li className='border-r'>
                        <NavLink to={'/san-pham'} className='pl-[20px] pr-[20px]'>
                            <span className='text-[14px] font-[500] leading-[25px]'>SẢN PHẨM</span>
                        </NavLink>
                    </li>
                    <li className='border-r'>
                        <NavLink to={'/lien-he'} className='flex items-center h-full pl-[20px] pr-[20px]'>
                            <div>
                                <img src="https://kawin.vn/uploads/source//icon/headphones-1.webp" alt="" />
                            </div>
                            <span className='text-[14px] font-[500] leading-[25px] ml-[10px]'>LIÊN HỆ</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
        <div id='search-Mobile' className='lg:hidden custom-input-search-mobile'>
            <form action="" className='p-[25px] w-full h-full'>
                <div className='flex items-center h-full'>
                    <input 
                        type="text" 
                        value={valueIpad}
                        onChange={(e) => setvalueIpad(e.target.value)}
                        className='w-[85%] bg-[#fff] p-[10px] text-[#000]'
                        placeholder='tìm kiếm'
                    />
                    <div className='grow-[1] ml-[10px] flex justify-evenly cursor-pointer'>
                        <button >
                            <Search className='to text-[#fff]'/>
                        </button>
                        <div
                            className='text-[#fff]'
                            onClick={handleCircleIpad}
                        >
                            <X size={40} strokeWidth={0.5} color='white'/>
                        </div>
                    </div>
                </div>
            </form>
            <div className='text-[#000] m-[40px]'>
                {thumbnailUrls.map((item,index) => (
                    <div key={index} className='h-[auto] mb-[10px] border-b border-gray-300'>
                        <a href="" className='flex h-[75px] p-[4px]'>
                            <img className='obj' src={`http://localhost:1337/${thumbnailUrls[0].thumbnailUrl}`} alt="" />
                            <h3 className='ml-[10px]'>{item.name}</h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
        <NavbarMobile/>
        {/* <div id='navbar-Mobile' className='lg:hidden sm:hidden custom-navbar-mobile'>
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
                <div className='relative'>
                    <a href="">
                        <Store />
                        <span>Giỏ hàng</span>
                    </a>
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
        </div> */}
    </div>
  )
}

export default Header