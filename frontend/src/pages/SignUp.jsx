import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { serverUrl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("") // ❗ Error message for UI
  let dispatch=useDispatch()


  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("") // clear previous error

    try {
      const response = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName,
        email,
        password
      }, { withCredentials: true })

    dispatch(setUserData(response.data))
    navigate("/profile")
      setUserName("")
      setEmail("")
      setPassword("")
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log("Axios Error:", error)

      // ✅ Handle different error formats from backend
      if (error.response) {
        // error.response.data.message → your custom error
        const backendMsg = error.response.data?.message

        if (typeof backendMsg === "string") {
          // Check if backend sent meaningful message
          if (backendMsg.toLowerCase().includes("email")) {
            setErr("Email already exists")
          } else if (backendMsg.toLowerCase().includes("username")) {
            setErr("Username already exists")
          } else {
            setErr(backendMsg)
          }
        } else {
          // fallback if no clear message
          setErr("Something went wrong on server.")
        }
      } else if (error.request) {
        setErr("No response from server. Check your internet.")
      } else {
        setErr("Unexpected error occurred.")
      }
    }
  }

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center'>
      <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-grey-400 shadow-lg flex flex-col gap-[30px]'>
        <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-gray-600 font-bold text-[30px]'>Welcome To <span className='text-pink-600'>Chatly</span></h1>
        </div>

        <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder='UserName'
            className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] text-gray-700 bg-white rounded-lg shadow-gray-200 shadow-lg'
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />

          <input
            type="email"
            placeholder='Email'
            className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] text-gray-700 bg-white rounded-lg shadow-gray-200 shadow-lg'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-200 shadow-lg relative'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              className='w-full h-full outline-none px-[20px] py-[10px] text-gray-700 bg-white'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className='absolute top-[10px] right-[20px] cursor-pointer text-[20px]'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* 🔴 Error message */}
          {err && (
            <p className='text-red-600 bg-red-100 px-2 py-2 rounded shadow-sm text-sm font-medium'>
              {err}
            </p>
          )}

          <button
            className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] font-semibold w-[180px] mt-[20px] hover:shadow-inner'
            disabled={loading}
          >
            {loading ? "Loading..." : "SignUp"}
          </button>

          <p>Already Have An Account? <span className='text-[#ff2020] font-semibold cursor-pointer' onClick={() => navigate("/login")}>Login</span></p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
