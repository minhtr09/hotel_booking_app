import express, { Request, Response } from "express";
import multer from "multer";
import Hotel, { HotelType } from "../models/hotel";
import cloudinary from "cloudinary";
import { body } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();
//store in the memory and upload to cloudinary later
const storage = multer.memoryStorage();
//define upload limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB upload limit
  },
});

//add hotels
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNightWeekdays")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("pricePerNightWeekends")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  verifyToken,
  upload.array("imageFiles", 6),

  async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      //1. Upload the images to Cloudinary
      const imageUrls = await uploadImages(imageFiles);

      //2. if upload was successful, add the URLs to the new hotel
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      console.log(req.userId);

      //3. save the new hotel to database
      const hotel = new Hotel(newHotel);
      await hotel.save();
      //4. return a 201 status code
      res.status(201).send(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

//view my hotel
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    console.log(req.userId);
    const hotels = await Hotel.find({ userId: req.userId });
    console.log(hotels);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
