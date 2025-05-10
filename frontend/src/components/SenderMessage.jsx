import React from 'react'
import dp from "../assets/dp.webp"
import { useRef } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function SenderMessage({image, message}) {
  let scroll = useRef()
  let {userData}=useSelector(state=>state.user)

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-[10px]' >
      <div className='w-fit max-w-[90%] sm:max-w-[500px] bg-[rgb(23,151,194)]  px-4 sm:px-[20px] py-2 sm:py-[10px] text-white rounded-2xl text-[16px] sm:text-[19px] rounded-tr-none ml-auto shadow-gray-500 shadow-lg flex gap-2 sm:gap-[10px] flex-col ' ref={scroll}>
        {image && (
          <img
            src={image}
            alt=""
            className='w-[120px] sm:w-[150px] rounded-lg'
            onLoad={handleImageScroll}
          />
        )}
        {message && <span>{message}</span>}
      </div>
          <div className='w-[40px] h-[40px] overflow-hidden rounded-full cursor-pointer flex justify-center top-0 right-[-50px] items-center shadow-gray-500 shadow-lg bg-slate-200'>
    <img src={userData.image || dp} alt="" className='h-full w-full object-cover' />
    </div>
    </div>
  )
}

export default SenderMessage
