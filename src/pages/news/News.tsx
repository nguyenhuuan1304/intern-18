import React, { useEffect, useState } from 'react'
import Header from '@/components/header/Header'
import Title from '@/components/product/Title'
import ItemNews from '@/components/itemNews/ItemNews'
import ContentSideBarNew from '@/components/contentSideBarNew/ContentSideBarNew'
import ServiceMenu from '@/components/ServiceMenu'
import { motion } from "framer-motion";
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { getPostList } from '@/redux/slice'
import { api } from '@/hooks/useAxios'

import { typeProduct } from '@/components/header/Header'

const News = () => {
    // const listProduct = useSelector((state: RootState) => state.product.product) ?? [];
    // const data:number[] = [1,2,3,4,5,6,7,7,7,7,7,7,7]
    const [listNews,setListNews] = useState([])
    const dispatch = useAppDispatch()
    useEffect(() => {
        const promise = dispatch(getPostList())
        return () => {
          promise.abort()
        }
    },[dispatch])

    useEffect(() => {
        api.get('news?populate=*')
        .then(res => {
            if (!res.data || !Array.isArray(res.data.data)) {
                throw new Error("Dữ liệu API không hợp lệ");
            }
            console.log(res.data.data)
            setListNews(res.data.data)
        })
    },[])

    console.log(listNews)
  return (
    <div className=''>
        <Header/>
        {/* <ServiceMenu/> */}
        <Title 
            title='Tin tức' 
            breadcrumb={[
                { label: "Trang chủ", path: "/" },
                { label: "Sản phẩm" }
            ]}
        />  
        <div className='flex mx-[6%] layout ' >
            <div className=' my-[4%] grid h-[100%] grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 max-lg:basis-[100%] basis-[80%] gap-x-[10px] gap-y-[20px] '>
            {listNews.map((product,id) => (
                 <motion.div
                 key={id}
                 className="block w-[100%] h-[100%]  bg-white shadow-md rounded-lg overflow-visible p-2  space-x-5 group hover:shadow-lg transition-shadow duration-300"
                 initial={{ opacity: 0, y: 50 }} 
                 whileInView={{ opacity: 1, y: 0 }} 
                 transition={{ duration: 0.6, delay: id * 0.1 }} 
                 viewport={{ once: true }} 
             >
                <ItemNews
                    key={id}
                    title='Bộ sưu tập quần áo cầu lông Flick nam nữ đẹp ấn tượng'
                    slug = {product.slug}
                    id = {product.documentId}
                    img={`http://localhost:1337${product?.img?.[0]?.url}`}
                    description='Áo cầu lông FlickLấy cảm hứng từ những cú đánh nhẹ nhưng nhanh đến bất ngờ, họa tiết trên mẫu áo cầu lông Flick được thiết kế tựa như những mũi tên gió – nhẹ và bén.'
                />
            </motion.div>
            ))}
                
            </div>
            <div className='basis-[20%] bg-white text-[#333] max-lg:hidden'>
                <ContentSideBarNew title='Tin Tức Mới'/>
                <ContentSideBarNew title='Tin Tức Nổi Bậc'/>
            </div>
        </div>
    </div>
  )
}

export default News