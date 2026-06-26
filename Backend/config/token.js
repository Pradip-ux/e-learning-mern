// import jwt from "jsonwebtoken";

// const genToken = async (userId) => {
//   try {
//     // It should look like this:
//     const genToken = (id) => {
//       return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     };

//     return token; //  VERY IMPORTANT
//   } catch (error) {
//     console.log("Token generation error:", error);
//     throw error;
//   }
// };

// export default genToken;
import jwt from "jsonwebtoken"
export const genToken= async(userId)=>{
try {
   let token= jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"})
   return token
} catch (error) {
    console.log("token error")
}


}

export default genToken;