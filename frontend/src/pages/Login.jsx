import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
  let navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false) // 👈 password visibility state
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")
  let dispatch=useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(`${serverUrl}/api/auth/login`, {
        email, password
      }, { withCredentials: true })

      dispatch(setUserData(result.data))
      dispatch(setSelectedUser(null))
      navigate("/")
      setEmail("")
      setPassword("")
      setLoading(false)
      setErr("") // ✅ Login success hone par error clear kar do

      // TODO: navigate to home or dashboard if needed
    } catch (error) {
      console.log(error)
      setLoading(false)

      // ✅ Agar password/email galat hai toh error dikhaye
      setErr(error?.response?.data?.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className='w-full h-[100vh] bg-slate-200 flex items-center justify-center' >
      <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-grey-400 shadow-lg flex flex-col gap-[30px]' >

        <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center'>
          <h1 className='text-gray-600 font-bold text-[30px]'>Login To <span className='text-pink-600'>Chatly</span></h1>
        </div>

        <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleLogin}>
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

          {/* ✅ Galat password/email par error message dikhaye */}
          {err && (
            <p className='text-red-600 bg-red-100 px-4 py-2 rounded shadow-sm'>
              {err}
            </p>
          )}

          <button
            type='submit'
            className='px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] font-semibold w-[180px] mt-[20px] hover:shadow-inner '
            disabled={loading}>
            {loading ? "Logging in..." : "LogIn"}
          </button>

          <p>
            Want to create a new Account?{" "}
            <span className='text-[#ff2020] font-semibold cursor-pointer' onClick={() => navigate("/signup")}>
              SignUp
            </span>
          </p>
        </form>

      </div>
    </div>
  )
}

export default Login
