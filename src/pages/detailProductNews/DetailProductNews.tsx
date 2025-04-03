import React, { useEffect, useState } from 'react'
import ContentSideBarNew from '@/components/contentSideBarNew/ContentSideBarNew'
import Header from '@/components/header/Header'
import ServiceMenu from '@/components/ServiceMenu'
import { CalendarMinus2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, Facebook, Instagram, Lightbulb, Newspaper, Star, Twitter } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion ,AnimatePresence} from "framer-motion";
import { api } from '@/hooks/useAxios'
import { useSearchParams } from "react-router-dom";
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@/store/store' 
import { TypeDataNews } from '../news/typeNews'
import { getPostListNews } from '@/store/news.slice'
import { toast } from "react-toastify";


interface User {
  username: string
}

interface DetailProductNewsProps {
  category: string; 
}
// interface TypeData {
//     id: number;
//     title: string;
//     product_images: string;
//     path: string;
// }

interface TypeImg {
  url: string;
}

interface TypeNews {
  name: string;
  description: string;
  img: TypeImg[];
}

interface TypeRating {
  username: string,
  rating: number,
  news: {
    documentId: string
  },
  description?: string ,
  createdAt: string,
  updatedAt:string

}

const DetailProductNews : React.FC<DetailProductNewsProps> = ({ category }) => {
  const listNews = useSelector((state: RootState) => state.news.news) || []
  const [news,setNews] = useState<TypeNews>({name: '', description: '', img: []})
  const [navStart, setNavStart] = useState(0)
  const [data, setData] = useState<TypeDataNews[]>(listNews); // Lưu trữ bản sao của dữ liệu
  const [searchParams, setSearchParams] = useSearchParams();
  const [listRating, setListRating] = useState<TypeRating[]>([])
  const [filterRating, setFilterRating] = useState<TypeRating[]>(listRating)
  const [viewCount, setViewCount] = useState(3); 
  const [active, setActive] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [avg, setAvg] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [savedId, setSavedId] = useState<string | null>(null);
  const listImg: TypeImg[] = news.img || [];
  const content: BlocksContent = Array.isArray(news?.description)? news.description: [];
  const user: User= JSON.parse(localStorage.getItem("user") || "null")?.username
  const dispatch = useAppDispatch()

  useEffect(() => {
    const promise = dispatch(getPostListNews())
      return () => {
        promise.abort()
      }
  },[dispatch])

  useEffect(() => {
    if (listNews.length > 0) {
      setData(listNews);
    }
  }, [listNews]);

  useEffect(() => {
    const id = searchParams.get("id") || null;
    if (id) {
      setSavedId(id);
      localStorage.setItem("savedId", id); 
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      const storedId = localStorage.getItem("savedId");
      if (storedId) {
        setSavedId(storedId);
      }
    }
  }, [searchParams]);

  const nextSlide = () => {
    setData((prev) => {
      const newData = [...prev];
      const firstIndex = newData.shift() ?? {} as TypeDataNews;
      newData.push(firstIndex); // Dịch chuyển phần tử đầu tiên về cuối
      return newData;
    });
    setNavStart((pre) => pre + 1);
  };

  const prevSlide = () => {
    setData((prev) => {
      const newData = [...prev];
      const lastIndex = newData.pop() ?? {} as TypeDataNews;;
      newData.unshift(lastIndex); // Dịch chuyển phần tử cuối về đầu
      return newData;
    });
    setNavStart((pre) => pre - 1);

  };
  // Tự động chuyển slide 5s/lần
  // useEffect(() => {
  //   const timer = setInterval(nextSlide, 3000);
  //   return () => clearInterval(timer);  
  // }, []);


  useEffect(() => {
    const getData = async () => {
      try {
        if (savedId === null) {
          return;
        } else {
          const res = await api.get(`/news/${savedId}?populate=*`)
          if(res.status === 200) {
            setNews(res.data.data);
            const data : TypeRating[]= res.data.data?.rating_news || []
            console.log(data)
            setListRating(data.map((item) =>({
              ...item,
              description: (() => {
                switch (item.rating) {
                  case 1:
                    return 'rất không hài lòng';
                  case 2:
                    return 'không hài lòng';
                  case 3:
                    return 'tạm ổn';
                  case 4:
                    return 'hài lòng';
                  case 5:
                    return 'rất hài lòng';
                  default:
                    return '';
                }
              })()
            })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            console.log(res.data.data?.rating_news)
          }
    
        }
      } catch (error) {
        console.error(error)
      }

    }
    getData()
   
  }, [savedId]);

  // useEffect(() => {
  //   const getRatingNews = async () => {
  //     try {
  //       const res = await api.get('http://localhost:1337/api/rating-news?filters[news][documentId][$eq]=c2hv3sfjc0phc3xzms359pzh&pagination[pageSize]=3&pagination[page]=1&sort=createdAt:desc')
  //       if(res.status === 200) {
  //         const data : TypeRating[]= res.data.data
  //         setListRating(data.map((item) =>({
  //           ...item,
  //           description: item.rating < 2 ? "không hài lòng" : item.rating >=3 && item.rating <=4 ? "hài lòng" : "rất hài lòng"
  //         })) )
  //       }
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   getRatingNews()
  // },[])

  useEffect(() => {
    const rai = listRating.reduce((acc,cur) => {
        return acc + cur.rating
    },0)
    setAvg(rai)
    setFilterRating(listRating.slice(0,viewCount));
    setQuantity(listRating.length)
  }, [listRating,viewCount]);

  const handleViewRating = (index : number) => {
    if(index === 0) {
      setFilterRating(listRating)
      setActive(index)
      return
    }
    const filter = listRating.filter((item) => item.rating === index)
    setFilterRating(filter)
    setActive(index)
  }
  
  const handleRating = async (index : number) => {
    if(!user) {
      toast.info("You must be login in to rate this news", { autoClose: 1500 });
      return
    }
    const body = {
      data : {
        "username": user,
        "rating": index,
        "news": savedId
      }
    }
    try {
      const res = await api.post('rating-news?populate=news',body)
      if(res.status === 201) {
        toast.success("Thanks you for rating the news", { autoClose: 1500 });
      }
    } catch (error) {
        toast.error("Rating failed", { autoClose: 1500 });
      console.error(error)
    }
  }
  const handleViewMore = () => {
    if(viewCount < listRating.length) {
      setViewCount(pre => pre + 3)
    }
  }

  const handleViewLess = () => {
    setViewCount(3)
  }

  console.log(viewCount)
  return (
    <div className=''>
      <Header/>
      <ServiceMenu/>
      <div className=' h-[38px] bg-[#f5f5fb] w-full flex items-center  '>
        <div className='ml-[7.5%] text-[14px] text-[#2e2e2e] flex flex-wrap items-center'>
          <a href="">
            <span>Trang chủ</span>
          </a>
          <span className="mx-[5px]">/</span>
          <NavLink to="/tin-tuc">
            <span>{category}</span>
          </NavLink>
          <a href="">
            <span className="mx-[5px]">/</span>
          </a>
          <a href="" className="  ">
            <span>{news.name}</span>
          </a>
        </div>
      </div>
      <div className="max-w-[1400px] 2xl:mx-[auto]  flex max-lg:flex-wrap flex-col lg:flex-row  max-2xl:mx-[4%] my-[10px] gap-6">
        <div className=" my-[4%] flex flex-col basis-[80%] gap-x-[10px] gap-y-[20px]">
          <h3 className="text-[20px] font-[500]">{news.name}</h3>
          <div className="flex flex-wrap gap-1">
            <div className="flex items-center px-[12px] mr-[10px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]">
              <div>
                <CalendarMinus2 className="block h-[18px] mr-[5px]" />
              </div>
              <span>Vài ngày trước</span>
            </div>
            <div className="flex items-center px-[12px] mr-[10px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]">
                <Eye className="block h-[18px] mr-[5px]" />
                <span>Lượt xem: 360</span>
            </div>
            <div className="flex items-center px-[12px] mr-[10px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]">
                <Newspaper className="block h-[18px] mr-[5px]" />
                <span>Tin tức</span>
            </div>
          </div>
          <div  className='text-[#333333] text-[14px]'>
            <span>(Có 81 người đang xem cùng bạn)</span>
          </div>
          <div  className='flex flex-col text-[#333333] text-[14px] leading-[25px]'>
 
          </div>
            <div className='markdown flex flex-col text-[#333333] text-[14px] leading-[25px]'>
              <BlocksRenderer  content={content}/>
            <div className='flex flex-wrap lg:basis-[48%]  max-md:flex-1 max-md:flex-shrink max-md:flex-basis-full gap-[10px]'>
              {listImg.map((item, id) => (
                <div key={id} className='w-[300px] '>
                  <img className='h-[466px] object-cover' src={`http://localhost:1337${item?.url}`} alt="" />
                </div>
              ))}
              {/* <div className='w-[350px]'>

                <img src="https://cdn2-retail-images.kiotviet.vn/justplay/b035542358144fd985094e2eb26496d9.jpg" alt="" />
              </div>
              <div className='w-[350px]'>
                <img src="https://cdn2-retail-images.kiotviet.vn/justplay/b035542358144fd985094e2eb26496d9.jpg" alt="" />
              </div>
              <div className='w-[350px]'>
                <img src="https://cdn2-retail-images.kiotviet.vn/justplay/b035542358144fd985094e2eb26496d9.jpg" alt="" />
              </div> */}
            </div>
          </div>      
          <div className='flex items-center  '>
                <div className='text-[#ffb500] flex mr-[10px] gap-1 cursor-pointer'>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star 
                      key={index}
                      onClick={() => handleRating(index)}
                      className={index <= hoverIndex ? 'fill-[#ffb500]' : ''}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(-1)}
                    />
                  ))}
                </div>
               <div className='text-[#333333] text-[12px]'>
                  <strong>{avg ? (avg / listRating.length).toFixed(1) : "0.0"}</strong>
                 <span>/5 </span>
                 <span>(</span>
                 <strong> {quantity} </strong>
                 <span>bình chọn)</span>
               </div>
             </div>
             <div className='flex text-[14px] text-[#333]  items-center'>
               <div>
                 Lọc theo:
               </div>
               <div className='flex items-center gap-[5px] flex-wrap'>
                 <div 
                    onClick={() => handleViewRating(0)}
                    className={` ${active === 0 ? 'bg-[#e6eef7] text-[#0d5cb6]' : ''}flex hover:cursor-pointer bg-[#e6eef7] text-[#0d5cb6] py-[6px] px-[22px] rounded-[10px] mx-[5px]`}
                  >
                   <span>Tất cả</span>
                 </div>
                 <div 
                    className={` ${active === 1 ? 'bg-[#e6eef7] text-[#0d5cb6]' : 'bg-[#eeeeee]'} flex hover:cursor-pointer hover:opacity-[0.8] py-[5px] px-[20px] rounded-[10px]`}
                    onClick={() => handleViewRating(1)}
                  >
                   <span>1</span>
                   <Star className='ml-[4px] text-[10px] fill-[#ccc] text-[#ccc]'/>
                 </div>
                 <div 
                    onClick={() => handleViewRating(2)}
                    className={` ${active === 2 ? 'bg-[#e6eef7] text-[#0d5cb6]' : 'bg-[#eeeeee]'} flex hover:cursor-pointer  hover:opacity-[0.8] py-[5px] px-[20px] rounded-[10px]`}
                  >
                   <span>2</span>
                   <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                 </div>
                 <div 
                    onClick={() => handleViewRating(3)}
                    className={` ${active === 3 ? 'bg-[#e6eef7] text-[#0d5cb6]' : 'bg-[#eeeeee]'} flex hover:cursor-pointer hover:opacity-[0.8] py-[5px] px-[20px] rounded-[10px]`}
                  >
                   <span>3</span>
                   <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                 </div>
                 <div 
                    onClick={() => handleViewRating(4)}
                    className={` ${active === 4 ? 'bg-[#e6eef7] text-[#0d5cb6]' : 'bg-[#eeeeee]'} flex hover:cursor-pointer hover:opacity-[0.8] py-[5px] px-[20px] rounded-[10px]`}

                  >
                   <span>4</span>
                   <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                 </div>
                 <div 
                    onClick={() => handleViewRating(5)}
                    className={` ${active === 5 ? 'bg-[#e6eef7] text-[#0d5cb6]' : 'bg-[#eeeeee]'} flex hover:cursor-pointer hover:opacity-[0.8] py-[5px] px-[20px] rounded-[10px]`}

                  >
                   <span>5</span>
                   <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                 </div>
               </div>
             </div>
             {listRating.length > 0 && 
                <div className='my-[20px] '>
                  {filterRating.map((item,index) => (
                      <div key={index} className='flex flex-col gap-2 border-t border-t-gray-150 py-5'>
                          <div className=' w-[150px] flex flex-row items-center gap-2 '>
                            <img 
                              className='h-[40px] w-[40px] rounded-[50%]'
                              src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg" alt="" 
                            />
                            <span className='truncate'>{item.username}</span>
                          </div>
                          <div className=' flex:1 flex flex-col '>
                            <div className=' text-[#ffb500] flex mr-[10px] gap-0.5 cursor-pointer '>
                              {[...Array(item.rating)].map((_,id) => (
                                <Star key={id} className='fill-[#ffb500] h-[12px] w-[20px]'/>
                              ))}
                            
                            </div>
                            <div>
                              <p>Đánh giá bài viết {item.description}</p>
                            </div>
                          </div>
                            <div>
                              <span>{new Date(item?.createdAt).toLocaleString()}</span>
                            </div>
                      </div>
                  ))}
                  {active === 0 && viewCount < listRating.length
                    &&
                    <div 
                      className='flex  text-[#333] hover:cursor-pointer hover:opacity-[0.7]'
                      onClick={handleViewMore}
                    >
                      <button className='pointer-events-none'>View More</button>
                      <ChevronDown className='relative top-[2px]'/>
                    </div>
                  }
                  {
                    active === 0 && viewCount >= listRating.length && listRating.length >= 3 &&
                    <div 
                      className='flex  text-[#333] hover:cursor-pointer hover:opacity-[0.7]'
                      onClick={handleViewLess}
                    >
                      <button className='pointer-events-none'>View less</button>
                      <ChevronUp className='relative top-[2px]'/>
                    </div>
                  }
                  
                </div>
             ||
                <div className='flex bg-[#ffe38b] text-[#fff] rounded-[6px] items-center'>
                  <div className='bg-[#fbda72] py-[15px] px-[18px] relative top-[10px] left-[12px] rounded-[6px]'>
                    <Lightbulb className='w-[24px] h-[30px]'/>
                  </div>
                  <div className='ml-[24px]'>
                    <span>Lưu ý Không có review nào</span>
                  </div>
                </div>
             }
             <div className='flex mt-[10px] px-6 py-2.5 border border-gray-300 gap-[10px] items-center'>
               <span className='font-[450]'>Chia sẻ</span>
               <div className='bg-[#516eab] text-[#fff] h-[32px] w-[32px] flex items-center justify-center'>
                   <a  href="">
                     <Facebook/>
                   </a>
               </div>
               <div className='bg-[#29c5f6] h-[32px] w-[32px] flex items-center justify-center'>
                   <a className=''><Twitter className='text-[#fff] '/></a>
               </div>
               <div className='bg-[#ca212a] text-[#fff] h-[32px] w-[32px] flex items-center justify-center'>
                   <a href=""><Instagram /></a>
               </div>
             </div>
         </div>
         <div className=''>
           <ContentSideBarNew title='Tin Tức Mới'/>
           <ContentSideBarNew title='Tin Tức Nổi Bậc'/>
           <ContentSideBarNew title='Sản phẩm đã xem'/>
         </div>
       </div>
       <div className='flex mx-[5%] lg:mx-[9%] flex-col gap-4'>
         <h3 className='font-[500]'>
           Bài viết liên quan
         </h3>
         <div className='slider-container relative grid grid-cols-4 gap-[25px] h-[472px] overflow-hidden  max-sm:grid-cols-1 max-lg:grid-cols-3'>
           {data.slice(0,  4).map((item,id) => (
           <div key={id}>
             {/* <AnimatePresence mode="wait"> */}
                 <motion.div
                     key={navStart}
                     initial={{ opacity: 0, x: 100 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -100 }}
                     transition={{ duration: 0.5 }}
                   >
                   <div className='anima' >
                         <div className="h-[300px] transform -translate-y-1 shadow-[0_4px_60px_0_rgba(0,0,0,0.2),_0_0_0_transparent]" >
 
                         <NavLink to={`/${item.slug}/?id=${item.documentId}`}>
                             <img 
                               className='block h-[100%] object-cover w-[100%]' 
                               src={ Array.isArray(item?.img) && typeof item?.img[0] === 'object' 
                                ? `http://localhost:1337${item?.img[0].url}` 
                                : `${null}`
                              } alt="" 
                            />
                          </NavLink>
                         </div>
                         <div>
                           <span className='my-[10px] mx-0 tracking-[2px] text-[13px] text-[#212529]'>
                             Vài ngày trước | Đăng bởi admin
                           </span>
                           <h3>
                             <a href="" className=' my-[5px] text-[20px] font-[500] text-[#337ab7] bg-transparent line-clamp-2 text-justify'>
                             {item.name}
                             </a>
                           </h3>
                           <a href="" className='text-[#687385] text-[14px] my-[10px] line-clamp-3 text-justify'>
                             <span>Mang đến sự đa dạng và phong phú hơn về trang phục cho vị trí người trấn giữ khung thành, Justplay ra mắt BST quần áo thủ môn JUSTPLAY GEA</span>
                           </a>
                         </div>
                   </div>
                 </motion.div>
            {/* </AnimatePresence> */}
           </div>
           ))} 
            <button
               onClick={prevSlide}
               className="prevSlide absolute left-4 top-[40%] cursor-pointer -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>
             <button
               onClick={nextSlide}
               className=" nextSlide absolute right-4 top-[40%] cursor-pointer -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-all"
             >
               <ChevronRight className="w-6 h-6" />
             </button>
         </div>
       </div>
     </div>
   )
 }

export default DetailProductNews;
