import { TypeUser } from '@/pages/admin/ManagerUser';
import { RatingNews, TypeDescription, typeImg } from '@/pages/news/typeNews';
import { RootState, useAppDispatch } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { StrapiBlock } from '../createPostNews/until';
import { updateNews } from '@/store/news.slice';


interface TypeItemSideBarNews {
    name?: string;
    title?: string;
    introduction?: string;
    slug?: string;
    views: number,
    description: TypeDescription[] | string | StrapiBlock[];
    rating_news: RatingNews[]| number[]
    img: string ,
    listImg :typeImg[] | number[],
    is_block: boolean,
    documentId: string,
    id:string
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

const ItemSideBarNews: React.FC<TypeItemSideBarNews> = ({views,id, is_block,listImg, description, rating_news, introduction, documentId, slug, img, name }) => {
  const listNews = useSelector((state : RootState) => state.news.news)
  const dispatch = useAppDispatch()
  
  // const [newsItem, setNewsItem] = useState<TypeDataNews>(initialValue)
  const user: TypeUser & { id: string } = {
      ...JSON.parse(localStorage.getItem("user") || "null"),
    };

  
  if (!slug || !documentId) return null;

  const handleUpdateViews = async () => {
      const newsItem = listNews.find((item) => item.documentId === documentId) || initialValue
      const userPermission = newsItem.users_permissions_users.find((item) => item.id === user.id) 
      const idUser = newsItem.users_permissions_users.map(item => item.id) 
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
              id : documentId || '',
              documentId : documentId || '',
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
    <div
      onClick={handleUpdateViews} 
      className='h-[80px] mb-[10px] rounded-[4px] bg-[#fff] cursor-pointer transition transform hover:rounded-[4px] hover:shadow-[0_4px_60px_0_rgba(0,0,0,.2),0_0_0_transparent]'>
      <NavLink to={`/${slug}/?id=${documentId}`} className='flex'>
        <img className='w-[80px] h-[80px] object-cover' src={img} alt={name} />
        <p className='line-clamp-[2] text-left text-[12px] font-semibold pl-[10px]'>{name}</p>
      </NavLink>
    </div>
  );
};

export default ItemSideBarNews