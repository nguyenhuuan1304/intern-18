import React, { useEffect, useState } from 'react'
import Header, { User } from '@/components/header/Header'
import Title from '@/components/product/Title'
import ItemNews from '@/components/itemNews/ItemNews'
import ContentSideBarNew from '@/components/contentSideBarNew/ContentSideBarNew'
import ServiceMenu from '@/components/ServiceMenu'
import { motion } from "framer-motion";
import { useSelector } from 'react-redux'
import { useAppDispatch,RootState } from '@/store/store' 
import { getPostListNews } from '@/store/news.slice'
import CreatePostNews from '@/components/createPostNews/CreatePostNews'

const News = () => {
    const user : User = JSON.parse(localStorage.getItem('user') || "null")
    const listNews  = useSelector((state: RootState) => state.news.news) ?? [];
    console.log(listNews)
    const dispatch = useAppDispatch()
    useEffect(() => {
        const promise = dispatch(getPostListNews())
        return () => {
          promise.abort()
        }
    },[dispatch])

    const handleShowAddNews = () => {
        const element = document.getElementById('modal')
        console.log(element)
        if(element)
        {
            element.style.display = 'block'
        }
    }

    return (
    <div className=''>
        <Header/>
        <ServiceMenu/>
        <Title 
            title='Tin tức' 
            breadcrumb={[
                { label: "Trang chủ", path: "/" },
                { label: "Tin tức" }
            ]}
        />  
        {user && 
            <div className='max-w-[1400px] mx-[auto] flex justify-end'>
                <button 
                    onClick={handleShowAddNews}
                    className='p-[10px] hover:bg-[#1a87a6] bg-[#007595] text-[#fff] cursor-pointer rounded-[4px] mt-[10px] mr-[8%]'
                >
                    Create new postNews
                </button>
            </div>
        }
        <div className='max-w-[1400px] mx-[auto] flex mx-[6%] layout max-lg:flex-wrap' >
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
                <div>
                    <ItemNews
                        title='Bộ sưu tập quần áo cầu lông Flick nam nữ đẹp ấn tượng'
                        slug = {product?.slug}
                        id = {product?.documentId}
                        img= { 
                            Array.isArray(product?.img) && typeof product?.img[0] === 'object' 
                            ? `http://localhost:1337${product?.img[0].url}` 
                            : `${null}`
                        }
                        description='Áo cầu lông FlickLấy cảm hứng từ những cú đánh nhẹ nhưng nhanh đến bất ngờ, họa tiết trên mẫu áo cầu lông Flick được thiết kế tựa như những mũi tên gió – nhẹ và bén.'
                    />
                </div>
             </motion.div>

            ))}
                
            </div>
            <div className='basis-[20%] bg-white text-[#333] max-lg:basis-[100%]'>
                <ContentSideBarNew title='Tin Tức Mới'/>
                <ContentSideBarNew title='Tin Tức Nổi Bậc'/>
            </div>
        </div>
        <div id='modal' className=' modal'>
            <CreatePostNews element = {document.getElementById('modal')}/>
        </div>
    </div>
  )
}

export default News