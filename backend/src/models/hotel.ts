import mongoose from "mongoose";

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childConnt: number;
  facilities: string[];
  pricePerNightWeekdays: number;
  pricePerNightWeekends: number;
  imageUrls: string[];
  startRating: number;
  lastUpdated: Date;
};

const hotelSchema = new mongoose.Schema<HotelType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childConnt: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNightWeekdays: { type: Number, required: true },
  pricePerNightWeekends: { type: Number, required: true },
  startRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;