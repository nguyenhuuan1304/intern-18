import React from 'react'

interface TypeItemSideBarNews {
    img: string,
    name: string
}

const ItemSideBarNews:React.FC<TypeItemSideBarNews> = ({img, name}) => {
  return (
    <div className='h-[80px] mb-[10px] rounded-[4px]  bg-[#fff] cursor-pointer transition transform hover:rounded-[4px] hover:shadow-[0_4px_60px_0_rgba(0,0,0,.2),0_0_0_transparent]'>
        <a href="" className='flex'>
            <img className='w-[80px] h-[80px] object-cover' src={img} alt="" />
            <p className='line-clamp-[2] text-left text-[12px] font-semibold pl-[10px] '>{name}</p>
        </a>
    </div>

  )
}

export default ItemSideBarNews