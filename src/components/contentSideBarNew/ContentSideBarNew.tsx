import React, { useEffect, useState } from 'react'
import ItemSideBarNews from '../itemSideBarNews/ItemSideBarNews'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { TypeDataNews } from '@/pages/news/typeNews'
import { api } from '@/hooks/useAxios'
import { NavLink } from 'react-router-dom'

interface TypeContentSideBarNew {
    title:string
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
    createdAt: ''
  }
  interface User {
    username: string
    id: number
  }

const ContentSideBarNew:React.FC<TypeContentSideBarNew> = ({title}) => {
    const list = useSelector((state: RootState) => state.news.news) ;
    const [listNews, setListNews] = useState<TypeDataNews[]>([initialValue])
    const user: User= JSON.parse(localStorage.getItem("user") || "null")
    const [watched, setWatched] = useState<TypeDataNews[]>([])


    useEffect(() => {
        let sortedNews: typeof list = [];
    
        switch (title) {
            case 'Tin Tức Mới':
                sortedNews = [...list].sort((a, b) => {
                    const dateA = new Date(a.createdAt ?? '');
                    const dateB = new Date(b.createdAt ?? '');
                    return dateB.getTime() - dateA.getTime(); 
                });
                break;
    
            case 'Tin Tức Nổi Bật':
                sortedNews = [...list].sort((a, b) => {
                    return b.views - a.views; 
                });
                break;
            
            case 'Bài Viết đã xem': {
                const watchIds = watched.map(item => item.documentId);
                const fill : TypeDataNews[]  = [...list].filter((item) => watchIds.includes(item.documentId))
                sortedNews = [...fill]
                break;
            }
            default:
                sortedNews = [...list]; 
                break;
        }

        if(title === 'Bài Viết đã xem') {
            setListNews(sortedNews); 
        } else {
            setListNews(sortedNews.slice(0, 5)); 
        }
    }, [list, title, watched]);
    console.log(watched)
    useEffect(() => {
        const getUser = async () => {
          try {
            const res = await api.get(`users/${user.id}?populate=*`)
            if(res.status === 200) {
                const dataNews = res.data.news.filter((item,index,arr) => 
                  index === arr.findIndex((a) => a.documentId === item.documentId)
                )
                setWatched(dataNews)
            } 
          } catch (error) {
            console.error(error)
          }
        }
        getUser()
      },[])
    console.log(listNews)
    return (
    <div className=' mt-[10px] mb-[6px] xl:w-[350px]  rounded-[6px] overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
        <h2 className='pl-[10px] text-[15px] font-bold uppercase py-[15px] '>{title}</h2>
        <div className='pl-[10px] max-h-[370px] scroll-area flex flex-col  overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
            {listNews.map((item,id) => (
                    <ItemSideBarNews 
                        key={id}
                        name={item?.name}
                        slug={item?.slug}
                        views={item?.views}
                        img={
                            Array.isArray(item?.img) && typeof item?.img[0] === 'object' 
                            ? `http://localhost:1337${item?.img[0].url}`
                            : "/default-image.jpg"
                        }
                        documentId={item?.documentId}
                        introduction={item?.introduction}
                        rating_news = {item?.rating_news}
                        description = {item?.description}
                        listImg = {item?.img}
                        is_block = {item?.is_block}
                        id={item?.documentId}
                    />
            ))}
            {/* {data.map((id) => (
                <ItemSideBarNews 
                    key={id}
                    img="https://si-justplay.com/uploads/source//san-pham/banner-cac-bo-suu-tap/z4984478822843-bda6d734eb866e478c4b4dba42d52a40.jpg"
                    name='123123'
                />
            ))} */}
        </div>
    </div>
  )
}

export default ContentSideBarNew