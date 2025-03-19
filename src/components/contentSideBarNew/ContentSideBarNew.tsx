import React from 'react'
import ItemSideBarNews from '../itemSideBarNews/ItemSideBarNews'

interface TypeContentSideBarNew {
    title:string
}

const ContentSideBarNew:React.FC<TypeContentSideBarNew> = ({title}) => {
    const data = [1,2,3,4,5]
    return (
    <div className='mt-[10px] mb-[6px] rounded-[6px] overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
        <h2 className='pl-[10px] text-[15px] font-bold uppercase py-[15px] '>{title}</h2>
        <div className='pl-[10px] max-h-[370px] scroll-area flex flex-col  overflow-y-auto bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)]'>
            {data.map((id) => (
                <ItemSideBarNews 
                    key={id}
                    img="https://si-justplay.com/uploads/source//san-pham/banner-cac-bo-suu-tap/z4984478822843-bda6d734eb866e478c4b4dba42d52a40.jpg"
                    description='Bộ sưu tập quần áo bóng rổ đẹp RockFire - Just Play'
                />
            ))}
        </div>
    </div>
  )
}

export default ContentSideBarNew