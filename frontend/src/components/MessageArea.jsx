import React, { useState, useRef } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io"
import { RiEmojiStickerFill } from "react-icons/ri";
import dp from "../assets/dp.webp"
import { LuSendHorizontal } from "react-icons/lu"
import { FaImages } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../redux/userSlice'
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReciverMessage from './ReciverMessage';
import axios from "axios"
import { serverUrl } from '../main'
import { setMessages } from '../redux/messageSlice';
import { useEffect } from 'react';

function MessageArea() {
  let { selectedUser, userData ,socket} = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if(input.length==0 && backendImage==null){
      return 
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...messages, result.data]))
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      image.current.value = null; // ✅ Reset file input
    } catch (error) {
      console.log(error);
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
    setShowPicker(false)
  }

  useEffect(()=>{
    socket.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })
    return ()=>socket.off("newMessage")


  },[messages,setMessages])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-slate-200 border-l-2 border-gray-400`}>

      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col'>
          {/* Top Bar */}
          <div className='w-full h-[100px] bg-[#1797c2] rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
            <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white cursor-pointer' />
            </div>
            <div className='w-[50px] h-[50px] overflow-hidden rounded-full cursor-pointer flex justify-center items-center shadow-gray-500 shadow-lg bg-slate-200 '>
              <img src={selectedUser?.image || dp} alt="" className='h-[100%]' />
            </div>
            <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || "user"}</h1>
          </div>

          {/* Message Area */}
          <div className='w-full h-[80vh] flex flex-col py-[70px] px-[20px] overflow-auto relative gap-[20px]'>

            {/* ✅ Emoji Picker */}
            {showPicker && (
              <div className='absolute bottom-[120px] left-[20px] z-10'>
                <EmojiPicker
                  width={250}
                  height={350}
                  onEmojiClick={onEmojiClick}
                  className='shadow-gray-600 shadow-lg z-[100]'
                />
              </div>
            )}

            {/* ✅ Messages Outside of Emoji Picker */}
   {messages &&
  // ✅ Filter sirf selectedUser ke messages ke liye
  messages
    .filter(mess =>
      (mess.sender === selectedUser._id && mess.receiver === userData._id) ||
      (mess.sender === userData._id && mess.receiver === selectedUser._id)
    )
    .map((mess, index) => (
      mess.sender === userData._id
        ? <SenderMessage key={index} image={mess.image} message={mess.message} />
        : <ReciverMessage key={index} image={mess.image} message={mess.message} />
))}
        </div>
        </div>
      }

      {/* Welcome message if no user selected */}
      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <h1 className='text-gray-700 font-bold text-[50px]'>Welcome to Chatly</h1>
          <span className='text-gray-600 font-semibold text-[30px]'>Chat Friendly !</span>
        </div>
      }

      {/* Bottom Message Input Section */}
      {selectedUser &&
        <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center'>
          {frontendImage &&
            <img src={frontendImage} alt="" className='absolute bottom-[100px] right-[20%] w-[80px] rounded-lg shadow-gray-500 shadow-lg' />
          }
          <form className='w-[95%] lg:w-[70%] h-[60px] bg-[rgb(23,151,194)] rounded-full shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px] cursor-pointer relative' onSubmit={handleSendMessage}>
            <div onClick={() => setShowPicker(prev => !prev)}>
              <RiEmojiStickerFill className='w-[25px] h-[25px] text-white bg-transparent' />
            </div>
            <input type="file" hidden accept='image/*' ref={image} onChange={handleImage} />
            <input type="text" placeholder='Message' className='w-full h-full px-[10px] outline-none border-0 text-[19px] text-white bg-transparent placeholder-white' onChange={(e) => setInput(e.target.value)} value={input} />
            <div onClick={() => image.current.click()}>
              <FaImages className='w-[25px] h-[25px] text-gray-900' />
            </div>
        {(input.length > 0 || backendImage !== null) && <button type="submit">
              <LuSendHorizontal className='w-[25px] h-[25px] text-black' />
        </button>}
          </form>
        </div>
      }
    </div>
  )
}

export default MessageArea
