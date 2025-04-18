import { UserPen } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavLink} from 'react-router-dom';
import { RatingNews, TypeDataNews } from '@/pages/news/typeNews';
import { TypeDescription } from '@/pages/news/typeNews'; 
import { StrapiBlock } from '../createPostNews/until';
import { typeImg } from '@/pages/news/typeNews';
import { updateNews } from '@/store/news.slice';
import { RootState, useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';
import { TypeUser } from '@/pages/admin/ManagerUser';

interface TypeItemNews {
    name?: string;
    title?: string;
    introduction?: string;
    slug?: string;
    id: string,
    views: number,
    description: TypeDescription[] | string | StrapiBlock[];
    rating_news: RatingNews[]| number[]
    img: string ,
    listImg :typeImg[] | number[],
    is_block: boolean,
}



const initialValue = {
  id: '',
  name: "",
  img:  [],
  description:  [],
  rating_news: [],
  documentId: "",
  slug: "",
  introduction : "",
  views: 0,
  is_block: false,
  users_permissions_users : [],
}



const ItemNews: React.FC<TypeItemNews> = ({ is_block, listImg , img,name, introduction,slug,id,views,rating_news,description}) => {
  const listNews = useSelector((state : RootState) => state.news.news)
  // const [newsItem, setNewsItem] = useState<TypeDataNews>(initialValue)
  const user: TypeUser & { id: string } = {
      ...JSON.parse(localStorage.getItem("user") || "null"),
    };
  const dispatch = useAppDispatch()
 
  const handleUpdateViews = async () => {
    const newsItem = listNews.find((item) => item.documentId === id) || initialValue
    const userPermission = newsItem.users_permissions_users.find((item) => item.id === user.id) 
    const idUser = newsItem.users_permissions_users.map(item => item.id) 
    console.log(idUser)
    if(!userPermission) {
      const usersID = user.id
      idUser.push(usersID)
    } 

    try {
          const imageIds = listImg ? listImg.map((img) => img.id) : []; // Lấy danh sách ID ảnh

          const updatedPost = {
            name : name || '',
            img: imageIds || [],
            description : description || '',
            id : id || '',
            documentId : id || '',
            slug : slug || '',
            introduction : introduction || '',
            users_permissions_users: idUser,
            is_block,
            views: views + 1,
            rating_news,
          };
      
          await dispatch(updateNews({ id, body: updatedPost })).unwrap();
        } catch (error) {
          console.error("Error updating news views:", error);
        }
  };

  return (
    <>  
            <div 
                onClick={handleUpdateViews}
                className=' flex-grow-0 flex-shrink-0  basis-[32%] max-md:basis-[48%] max-sm:basis-[100%] flex flex-col rounded-[8px] overflow-visible bg-[#fff] cursor-pointer transition transform hover:rounded-[8px] hover:-translate-y-[5px] hover:shadow-[0_4px_60px_0_rgba(0,0,0,.2),0_0_0_transparent]'
            >
             <NavLink  to={`/${slug}/?id=${id}`}>
             
                <div className='h-[182px]'>
                    <img className='rounded-[6px] h-full w-full object-cover' src={img} alt="" />
                </div>
                <div className='relative  right-[-4%] bg-[#fff] rounded-[10px] w-[80%] p-[20px] text-[#212529] '>
                    <h3 className='my-[10px] text-justify  font-semibold line-clamp-2'>
                        {name}
                    </h3>
                    <div className='flex items-center text-[12px]'>
                        <UserPen className='w-[14px] mr-[6px]'/>
                        <span>Đăng bởi Admin</span>
                    </div>
                    <div className='text-[12px] mt-[10px]  line-clamp-3 text-justify'>{introduction}</div>
                </div>
             </NavLink>
            </div>
    </>
  )
}

export default ItemNews