import React, { useEffect, useState } from 'react'
import ContentSideBarNew from '@/components/contentSideBarNew/ContentSideBarNew'
import Header from '@/components/header/Header'
import ServiceMenu from '@/components/ServiceMenu'
import { CalendarMinus2, ChevronLeft, ChevronRight, Eye, Facebook, Instagram, Lightbulb, Newspaper, Star, Twitter } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion ,AnimatePresence} from "framer-motion";
import { api } from '@/hooks/useAxios'
import { useSearchParams } from "react-router-dom";
import { BlocksRenderer, type BlocksContent } from '@strapi/blocks-react-renderer';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store' 
import { TypeDataNews } from '../news/typeNews'

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
  url : string
}

interface TypeNews {
  name: string;
  description: string;
  img: TypeImg[];
}

const DetailProductNews : React.FC<DetailProductNewsProps> = ({ category }) => {
  const listNews = useSelector((state: RootState) => state.news.news) || []
  const [news,setNews] = useState<TypeNews>({name: '', description: '', img: []})
  const [navStart, setNavStart] = useState(0)
  const [data, setData] = useState<TypeDataNews[]>(listNews); // Lưu trữ bản sao của dữ liệu
  const [searchParams, setSearchParams] = useSearchParams();
  const [savedId, setSavedId] = useState<string | null>(null);
  const listImg : TypeImg[] = news.img || []
  const content: BlocksContent = Array.isArray(news?.description) ? news.description : [];

  console.log(data)
  useEffect(() => {
    const id = searchParams.get("id") || null;
    
    if (id) {
      setSavedId(id);
      localStorage.setItem("savedId", id); // Lưu vào localStorage
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
      const firstIndex = newData.shift();
      newData.push(firstIndex); // Dịch chuyển phần tử đầu tiên về cuối
      return newData;
    });
    setNavStart(pre => pre + 1)
  };

  const prevSlide = () => {
    setData((prev) => {
      const newData = [...prev];
      const lastIndex = newData.pop();
      newData.unshift(lastIndex); // Dịch chuyển phần tử cuối về đầu
      return newData;
    });
    setNavStart(pre => pre - 1)

  };
  // Tự động chuyển slide 5s/lần
  // useEffect(() => {
  //   const timer = setInterval(nextSlide, 3000);
  //   return () => clearInterval(timer);  
  // }, []);


  useEffect(() => {
    if(savedId === null) {
      return
    } else {
      api.get(`/news/${savedId}?populate=*`)
      .then(res => {
        setNews(res.data.data)
      })

    }
  },[savedId])
 

  return (
    <div className=''>
      <Header/>
      <ServiceMenu/>
      <div className=' h-[38px] bg-[#f5f5fb] w-full flex items-center  '>
        <div className='ml-[7.5%] text-[14px] text-[#2e2e2e] flex flex-wrap items-center'>
          <a href="">
            <span>Trang chủ</span>
          </a>
          <span className='mx-[5px]'>/</span>
          <NavLink to="/tin-tuc">
            <span>{category}</span>
          </NavLink>
          <a href="">
            <span className='mx-[5px]'>/</span>
          </a>
          <a href="" className='  '>
            <span>{news.name}</span>
          </a>
        </div>
      </div>
      <div className='max-w-[1400px] 2xl:mx-[auto]  flex max-lg:flex-wrap flex-col lg:flex-row  max-2xl:mx-[4%] my-[10px] gap-6'>
        <div className=' my-[4%] flex flex-col basis-[80%] gap-x-[10px] gap-y-[20px]'>
            <h3 className='text-[20px] font-[500]'>{news.name}</h3>
            <div className='flex flex-wrap'>
              <div className='flex items-center px-[12px] mr-[20px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]'>
                <div>
                  <CalendarMinus2 className='block h-[18px] mr-[5px]'/>
                </div>
                <span>Vài ngày trước</span>
              </div>
              <div className='flex items-center px-[12px] mr-[20px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]'>
                <Eye className='block h-[18px] mr-[5px]'/>
                <span>Lượt xem: 360</span>
              </div>
              <div className='flex items-center px-[12px] mr-[20px] text-[#494949] text-[12px] h-[32px] bg-[#ececec] rounded-[20px]'>
                <Newspaper className='block h-[18px] mr-[5px]'/>
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

              {/* <span className=''>BST bóng đá : CRX - JUSTPLAY</span>
              <span>Bộ trang phục siêu đẹp CRX sẽ giúp bạn tự tin, phấn khởi khi ra sân bóng, cùng bạn đồng hành chiến thắng, giành lấy vinh quang.Bộ trang phục siêu đẹp CRX sẽ giúp bạn tự tin, phấn khởi khi ra sân bóng, cùng bạn đồng hành chiến thắng, giành lấy vinh quang.Bộ trang phục siêu đẹp CRX sẽ giúp bạn tự tin, phấn khởi khi ra sân bóng, cùng bạn đồng hành chiến thắng, giành lấy vinh quang.</span>
              <span>? BST CRX mang đến những dấu ấn riêng biệt để tạo sự nổi bật :</span>
              <span>- Họa tiết trên áo và tay áo rất độc đáo, đẹp và bắt mắt.</span>
              <span>- Phối quần và cổ áo màu đậm tạo điểm nhấn tổng thể.</span>
              <span>- Lai áo đuôi tôm phía sau rất xịn sò, cá tính</span>
              <span>? Chất vải thun CR3 cao cấp chuyên thấm hút mồ hôi tốt, thoát nhiệt nhanh, độ co giãn tuyệt đối yên tâm vận động khi thi đấu, tập luyện với cường độ cao.</span>
              <span>? Màu sắc rực rỡ, tươi sáng: Trắng xanh - Trắng tím - Đỏ - Vàng - Xanh Ngọc - Xanh da</span>
              <span>? Kích cỡ: S - M - L - XL – XXL- XXXL</span>
              <span>? Giá niêm yết: 165.000 VNĐ</span> */}
            </div>
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
            <div className='flex items-center  '>
              <div className=' text-[#ffb500] flex mr-[10px] gap-1 cursor-pointer '>
                <Star className='hover:fill-[#ffff00]'/>
                <Star className='hover:fill-[#ffff00]'/>
                <Star className='hover:fill-[#ffff00]'/>
                <Star className='hover:fill-[#ffff00]'/>
                <Star className='hover:fill-[#ffff00]'/>
              </div>
              <div className='text-[#333333] text-[12px]'>
                <strong>{0}</strong>
                <span>/5</span>
                <span>(</span>
                <strong> {0} </strong>
                <span>bình chọn)</span>
              </div>
            </div>
            <div className='flex text-[14px] text-[#333]  items-center'>
              <div>
                Lọc theo:
              </div>
              <div className='flex items-center gap-[5px] flex-wrap'>
                <div className='flex hover:cursor-pointer  bg-[#E6EEF7] text-[#0d5cb6] py-[6px] px-[22px] rounded-[10px] mx-[5px]'>
                  <span>Tất cả</span>
                </div>
                <div className='flex hover:cursor-pointer bg-[#eeeeee] py-[5px] px-[20px] rounded-[10px]'>
                  <span>1</span>
                  <Star className='ml-[4px] text-[10px] fill-[#ccc] text-[#ccc]'/>
                </div>
                <div className='flex hover:cursor-pointer bg-[#eeeeee] py-[5px] px-[20px] rounded-[10px]'>
                  <span>2</span>
                  <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                </div>
                <div className='flex hover:cursor-pointer bg-[#eeeeee] py-[5px] px-[20px] rounded-[10px]'>
                  <span>3</span>
                  <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                </div>
                <div className='flex hover:cursor-pointer bg-[#eeeeee] py-[5px] px-[20px] rounded-[10px]'>
                  <span>4</span>
                  <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                </div>
                <div className='flex hover:cursor-pointer bg-[#eeeeee] py-[5px] px-[20px] rounded-[10px]'>
                  <span>5</span>
                  <Star className='ml-[4px] fill-[#ccc] text-[#ccc] text-[10px]'/>
                </div>
              </div>
            </div>
            <div className='flex bg-[#ffe38b] text-[#fff] rounded-[6px] items-center'>
              <div className='bg-[#fbda72] py-[15px] px-[18px] relative top-[10px] left-[12px] rounded-[6px]'>
                <Lightbulb className='w-[24px] h-[30px]'/>
              </div>
              <div className='ml-[24px]'>
                <span>Lưu ý Không có review nào</span>
              </div>
            </div>
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
        <div className='basis-[20%] bg-white text-[#333] max-lg:basis-[100%]'>
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

export default DetailProductNews