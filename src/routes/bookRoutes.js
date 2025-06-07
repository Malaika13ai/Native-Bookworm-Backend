import express from "express"
import cloudinary  from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/",protectRoute,async(req,res)=>{
    try {


        const {title, caption , rating, image} = req.body;
        if(!image || !title || !caption || !rating) return res.status(400).json({message:"please provide an fields "})

            //upload image to cloudinary

          const uploadResponse=  await cloudinary.uploader.upload(image);
          const imageUrl= uploadResponse.secure_url

          //save to data base 

          const newBook = new Book({
            title,
            caption,
            rating,
            image : imageUrl,
            user: req.user._id
          })

          await newBook.save();
          res.status(201).json(newBook)
    } catch (error) {
        console.log(("error creating book", error));
        res.status(500).json({message:error.message})
        
    }
})



//pagination => infinite loading
router.get("/",protectRoute, async(req , res) =>{
  try {

    //page 1 to 5
   const  page = req.query.age || 1;
   const limit = req.query.limit || 5;
   const skip = (page - 1 ) * limit;

   const books = await Book.find()
   .sort({createdAt: -1}) //descending order
   .skip(skip)
   .limit(limit)
   .populate("user", "username profileImage");

const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages : Math.ceil(totalBooks / limit)
    });

  } catch (error) {
    console.log("Error in get all book route ", error);
         res.status(500).json({message:"internal server error"})
  }
})


router.delete("/:id", protectRoute, async (req , res) =>{
  try {
    //check existence
    const book = await Book.findById(req.params.id);
    if(!book) return res.status(404).json({message : "Book not found"});

    //check if useris the creater of this recommendations
    if(book.user.toString() !== req.user_.id.toString()) return res.status(401).json({message: "Unauthorized"});


    //delete image from cloudinary
     if(book.image && book.image.includes("cloudiary")){
      try {

        // split the image id from cloudinrary
        const publicId = book.image.split("/").pop().split(".")[0];
        //now delete
        await cloudinary.uploader.destroy(publicId);

      } catch (deleteError) {
         console.log("Error deleting image from cloudinary", deleteError);
         res.status(500).json({message:"internal server error"})
      }
     }
     
    await book.deleteOne();

    res.json({message:"book deleted successfully"})
  } catch (error) {
        console.log("Error deleting book ", error);
         res.status(500).json({message:"internal server error"})
  }
})

router.get("/",protectRoute, async(req , res) =>{
  try {
       const books = await Book.find()
   .sort({createdAt: -1})

    res.send({
      books})
  }
  catch (error) {
    console.log("Get user books error ", error.message);
         res.status(500).json({message:"internal server error"})
  }
})




export default router;