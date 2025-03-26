import React from 'react'
import ItemSideBarNews from '../itemSideBarNews/ItemSideBarNews'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

interface TypeContentSideBarNew {
    title:string
}

const ContentSideBarNew:React.FC<TypeContentSideBarNew> = ({title}) => {
    const list = useSelector((state: RootState) => state.news.news) ;
    return (
    <div className='mt-[10px] mb-[6px] rounded-[6px] overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
        
        <h2 className='pl-[10px] text-[15px] font-bold uppercase py-[15px] '>{title}</h2>
        <div className='pl-[10px] max-h-[370px] scroll-area flex flex-col  overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
            {list.map((item,id) => (
                <ItemSideBarNews 
                    key={id}
                    img={
                        Array.isArray(item?.img) && typeof item?.img[0] === 'object' 
                        ? `http://localhost:1337${item?.img[0].url}`
                        : "/default-image.jpg"
                    }
                    name={item?.name}
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