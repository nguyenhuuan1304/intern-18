import { UserPen } from 'lucide-react'
import React from 'react'
import { Navigate, NavLink, useNavigate ,Link} from 'react-router-dom';

interface TypeItemNews {
    img?: string;
    title?: string;
    description?: string;
    slug?: string;
    id: string
}


const ItemNews: React.FC<TypeItemNews> = ({img,title, description,slug,id}) => {

  return (
    <>  
            <div 
                className=' flex-grow-0 flex-shrink-0  basis-[32%] max-md:basis-[48%] max-sm:basis-[100%] flex flex-col rounded-[8px] overflow-visible bg-[#fff] cursor-pointer transition transform hover:rounded-[8px] hover:-translate-y-[5px] hover:shadow-[0_4px_60px_0_rgba(0,0,0,.2),0_0_0_transparent]'
            >
             <NavLink  to={`/${slug}/?id=${id}`}>
             
                <div className='h-[182px]'>
                    <img className='h-full w-full object-cover' src={img} alt="" />
                </div>
                <div className='relative  right-[-4%] bg-[#fff] rounded-[10px] w-[80%] p-[20px] text-[#212529] '>
                    <h3 className='my-[10px] text-justify  font-semibold line-clamp-2'>
                        {title}
                    </h3>
                    <div className='flex items-center text-[12px]'>
                        <UserPen className='w-[14px] mr-[6px]'/>
                        <span>Đăng bởi Admin</span>
                    </div>
                    <div className='text-[12px] mt-[10px]  line-clamp-3 text-justify'>{description}</div>
                </div>
             </NavLink>
            </div>
    </>
  )
}

export default ItemNews