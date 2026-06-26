import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../App'
import { setReviewData } from '../redux/reviewSlice'
import axios from 'axios'
// import api from "../utils/api";
// import { get } from 'mongoose';

const getAllReviews = () => {

   const dispatch = useDispatch()
  

  useEffect(()=>{
    const getAllReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview" , {withCredentials:true})
        console.log(result.data)
        dispatch(setReviewData(result.data))
        
      } catch (error) {
        console.log(error)
      }
    }
    getAllReviews()
  },[])
  
}

export default getAllReviews
