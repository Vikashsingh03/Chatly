import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUser, setUserData } from "../redux/userSlice"

const getOtherUser=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async ()=>{
            try {
                let result=await axios.get(`${serverUrl}/api/user/others`,{withCredentials:true})
                dispatch(setOtherUser(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[userData])
}

export default getOtherUser