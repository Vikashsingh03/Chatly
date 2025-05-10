import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { BiLogOutCircle } from "react-icons/bi"
import { serverUrl } from '../main'
import axios from "axios"
import { setSearchData, setSelectedUser, setUserData } from '../redux/userSlice'
import getOtherUser from '../customHooks/getOtherUser'
import { useNavigate } from 'react-router-dom'

function SideBar() {
  let { userData, otherUser, selectedUser ,onlineUsers,searchData} = useSelector(state => state.user)
  let [search, setSearch] = useState(false)
  let [input,setInput]=useState("")

  let dispatch = useDispatch()
  let navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(getOtherUser(null))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }


    const handleSearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(input){
       handleSearch()
    }
  },[input])

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 ${!selectedUser ? "block" : "hidden"} `}>

      <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-[#20c7ff] overflow-hidden rounded-full mt-[10px] cursor-pointer flex justify-center items-center text-gray-700 shadow-gray-500 shadow-lg fixed bottom-[20px] left-[10px]' onClick={handleLogOut}>
        <BiLogOutCircle className='w-[22px] h-[22px] sm:w-[25px] sm:h-[25px]' />
      </div>

      <div className='w-full h-auto min-h-[250px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center flex-col px-[20px] py-[20px] gap-[10px]'>
        <h1 className='text-white font-bold text-[22px] sm:text-[25px]'>Chatly</h1>
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-gray-800 font-semibold text-[20px] sm:text-[25px]'>Hii, {userData.name || "User"}</h1>
          <div
            className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] overflow-hidden rounded-full cursor-pointer flex justify-center items-center shadow-gray-500 shadow-lg bg-slate-200'
            onClick={() => navigate("/profile")}
          >
            <img src={userData.image || dp} alt="" className='h-full w-full object-cover' />
          </div>
        </div>

        <div className='w-full flex flex-wrap gap-[10px] sm:gap-[20px] items-center overflow-y-auto py-[15px]'>
          {!search &&
            <div
              className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-slate-50 overflow-hidden rounded-full mt-[10px] cursor-pointer flex justify-center items-center shadow-gray-500 shadow-lg'
              onClick={() => setSearch(true)}
            >
              <IoIosSearch className='w-[22px] h-[22px] sm:w-[25px] sm:h-[25px]' />
            </div>
          }

          {search &&

            <form className='w-full h-[50px] sm:h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[15px] rounded-full overflow-hidden px-[15px] sm:px-[20px] cursor-pointer '>
              <IoIosSearch className='w-[22px] h-[22px] sm:w-[25px] sm:h-[25px]' />
              <input type="text" placeholder='Search Users.....' className='w-full h-full border-0 outline-none text-[16px] sm:text-[17px]' onChange={(e)=>setInput(e.target.value)} value={input} />
              <RxCross2 className='w-[22px] h-[22px] sm:w-[25px] sm:h-[25px] cursor-pointer text-red-600 font-bold' onClick={() => setSearch(false)} />

</form>
          }

          {!search && otherUser?.map((user, idx) =>(
          onlineUsers?.includes(user._id) &&
          <div className='relative rounded-full shadow-gray-500 shadow-lg mt-[10px] flex items-center justify-center'onClick={() => dispatch(setSelectedUser(user))}>
            <div key={idx} className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]  overflow-hidden rounded-full cursor-pointer flex justify-center bg-slate-200 items-center '>
              <img src={user.image || dp} alt="" className='h-full w-full object-cover' />
            </div>
            <span className='w-[14px] h-[14px] rounded-full absolute bg-[#3aff20] right-[-1px] bottom-[6px] shadow-gray-500 shadow-md'></span>
            </div>   
          ))}
        </div>
      </div>

      <div className='w-full h-[50%] overflow-auto flex flex-col gap-[15px] sm:gap-[20px] items-center mt-[20px] '>
        {otherUser?.map((user, idx) => (
          <div key={idx} className='w-full sm:w-[95%] h-[60px] flex items-center  gap-[15px] sm:gap-[20px] bg-white shadow-gray-500 shadow-lg  rounded-full hover:bg-[#b2ccdf] cursor-pointer px-[-2px]' onClick={() => dispatch(setSelectedUser(user))}>
          <div className='relative rounded-full shadow-gray-500 shadow-lg mt-[10px]  my-2.5 flex items-center justify-center'>
            <div key={idx} className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]  overflow-hidden rounded-full cursor-pointer flex justify-center bg-slate-200 items-center  '>
            <img src={user.image || dp} alt="" className='h-full w-full object-cover' />
            </div>
            {onlineUsers?.includes(user._id) &&<span className='w-[14px] h-[14px] rounded-full absolute bg-[#3aff20] right-[-1px] bottom-[6px] shadow-gray-500 shadow-md'></span>}
            </div> 
            <h1 className='text-gray-800 font-semibold text-[17px] sm:text-[20px]'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>

    </div>
  )
}

export default SideBar
