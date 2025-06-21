//  import jwt from "jsonwebtoken"
//  import User from "../models/User.js"



//  const protectRoute = async(req , res , next)=>{
//     try {
//         const token = req.header("Authorization".replace("Bearer",""));
//         if(!token) return res.status(401).json({message:"no authentication token , access denied"});

//         //verify token
//         const decoded = jwt.verify(token, process.env.jwt_SECRET)

//         //FIND USER 

//         const user = await User.findById(decoded.userId).select("-password");
//            if(!user) return res.status(401).json({message:"token is not valid"});


//            req.user = user;
//            next();
//     } catch (error) {
//            console.log(("authentication error:", error.message));
//         res.status(401).json({message:"token is not valid"})
//     }
//  }

//  export default protectRoute;




import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
  
     const token = authHeader?.split(" ")[0] === "Bearer"
  ? authHeader.split(" ")[1]
  : null;

    if (!token) return res.status(401).json({ message: "No authentication token, access denied" });

    // Verify token
    const decoded = jwt.verify(token, process.env.jwt_SECRET);
          
    // Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });


    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
