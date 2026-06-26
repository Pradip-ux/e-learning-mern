import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setCourseData } from "../redux/courseSlice";

const useGetPublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/course/getpublished`);

        dispatch(
          setCourseData(
            Array.isArray(res.data)
              ? res.data
              : res.data?.courses || []
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, [dispatch]);
};

export default useGetPublishedCourse;