import { useEffect } from "react";
import { serverUrl } from "../App";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { setCreatorCourseData } from "../redux/courseSlice";
// import api from "../utils/api";
import axios from "axios";


const useGetCreatorCourse = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const creatorCourses = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true });
                
                // Only dispatch if result and data exist
                if (result?.data) {
                    dispatch(setCreatorCourseData(result.data));
                }
            } catch (error) {
                // This will prevent the "TypeError" while your backend is down
                console.error("Backend connection failed. Please start your server.");
            }
        };

        creatorCourses();
    }, [dispatch]);
};
export default useGetCreatorCourse;

// import React, { useEffect } from 'react'
// import { serverUrl } from '../App'
// import axios from 'axios'
// import { setCreatorCourseData } from '../redux/courseSlice'
// import { useDispatch, useSelector } from 'react-redux'
// import { toast } from 'react-toastify'

// const useGetCreatorCourse = () => {
//     const dispatch = useDispatch()
//     const {userData} = useSelector(state=>state.user)
//   return (
//     useEffect(()=>{
//     const creatorCourses = async () => {
//       try {
//         const result = await axios.get(serverUrl + "/api/course/getcreator" , {withCredentials:true})
        
//          await dispatch(setCreatorCourseData(result.data))

        
//         console.log(result.data)
        
//       } catch (error) {
//         console.log(error)
//         toast.error(error.response.data.message)
//       }
      
//     }
//     creatorCourses()
//   },[userData])
//   )
// }

// export default useGetCreatorCourse
