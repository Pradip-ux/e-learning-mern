import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../App";
// import api from "../utils/api";

// api.get("/api/user/me");
const useCurrentUser = () => {
  const dispatch = useDispatch();

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const result = await axios.get(
        serverUrl + "/api/user/me",
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      dispatch(setUserData(null));
    }
  };

  fetchUser();
}, [dispatch]);
};


export default useCurrentUser;