import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser=async (req,res)=>{
    try {
        let userId=req.userId
        let user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:`current user error${error}`})
    }
}


export const editProfile = async (req, res) => {
    try {
        let { name } = req.body;
        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        // Update user
        let user = await User.findByIdAndUpdate(
            req.userId,
            {
                name,
                ...(image && { image }), // only set image if uploaded
            },
            { new: true } // return updated user
        ).select("-password");

        if (!user) {
            return res.status(400).json({ message: "User is Not Found" });
        }

        return res.status(200).json(user); // ✅ RETURN RESPONSE

    } catch (error) {
        return res.status(400).json({ message: `profile error: ${error}` });
    }
};



export const getOtherUser=async (req,res)=>{
    try {
        let users=await User.find({
            _id:{$ne:req.userId}
        }).select("-password")
        return res.status(200).json(users)

       
    } catch (error) {
         return res.status(400).json({message:`get other users error${error}`})
    }

}


export const search=async (req,res)=>{
    try {
        let {query}=req.query
        if(!query){
            return req.status(400).json({message:"query is required"})
        }
        let users=await User.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {userName:{$regex:query,$options:"i"}}
            ]
        })
        return res.status(200).json(users)
    } catch (error) {
        return req.status(400).json({message:"search user error"})
        
    }
}