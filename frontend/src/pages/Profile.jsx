import React, { useRef } from 'react'
import dp from "../assets/dp.webp"
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { setUserData } from "../redux/userSlice"
import axios from "axios";
import { serverUrl } from "../main"

function Profile() {

  let navigate = useNavigate()
  let { userData } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [name, setName] = useState(userData.name || "")
  let [frontendImage, setFrontendImage] = useState(userData.image || dp)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let [saving, setSaving] = useState(false)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

const handleProfile = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    let formData = new FormData();
    formData.append("name", name);
    if (backendImage) {
      formData.append("image", backendImage);
    }

    console.log("Uploading profile data...");
    let result = await axios.put(`${serverUrl}/api/user/profile`, formData, { withCredentials: true });

    console.log("Server response:", result.data);

    dispatch(setUserData(result.data)); // ✅ Redux update
    console.log("Redux updated!");

    setSaving(false);

    // ✅ Safe delay before navigating
    setTimeout(() => {
      console.log("Navigating to home...");
      navigate("/");
    }, 200);

  } catch (error) {
    console.error("Profile update error:", error.response?.data || error.message);
    setSaving(false);
  }
};


  return (
    <div className='w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>
      <div className='fixed top-[20px] left-[20px] ' onClick={() => navigate("/")}><IoIosArrowRoundBack className='w-[50px] h-[50px] text-gray-600 cursor-pointer' /></div>

      <div className=' bg-white border-4 border-[#20c7ff] rounded-full  shadow-gray-400 shadow-lg  relative'>
        <div className='w-[200px] h-[200px] overflow-hidden rounded-full cursor-pointer flex justify-center items-center' onClick={() => image.current.click()}><img src={frontendImage} alt="" className='h-[100%]' /></div>
        <div className='absolute bottom-4 right-4 h-[35px] w-[35px] text-gray-700 rounded-full flex justify-center items-center bg-[#20c7ff] shadow-gray-400'><IoCameraOutline className=' h-[24px] w-[24px] text-gray-700' /></div>
      </div>

      <form className='w-[95%] max-w-[500px] flex flex-col gap-[20px] justify-center items-center' onSubmit={handleProfile}>
        <input type="file" accept='image/*' ref={image} hidden onChange={handleImage} />
        <input type="text" placeholder='Enter Your Name' className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] text-gray-900 bg-white rounded-lg shadow-gray-400 shadow-lg' onChange={(e) => setName(e.target.value)} value={name} />
        <input type="text" readOnly className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] text-gray-400 bg-white rounded-lg shadow-gray-400 shadow-lg' value={userData?.userName} />
        <input type="email" readOnly className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] text-gray-400 bg-white rounded-lg shadow-gray-400 shadow-lg' value={userData?.email} />
        <button className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] font-semibold w-[180px] mt-[20px] hover:shadow-inner' disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </form>
    </div>
  )
}

export default Profile
