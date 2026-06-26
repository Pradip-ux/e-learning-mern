import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetEnrolledCourses = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourses = async () => {2
      try {
        const res = await axios.get(
          `${serverUrl}/api/course/getenrolled`,
          { withCredentials: true }
        );

        console.log("ENROLLED:", res.data);

        dispatch(
          setUserData((prev) => ({
            ...prev,
            enrolledCourses: res.data,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchCourses();
  }, [dispatch]);
};

export default useGetEnrolledCourses;