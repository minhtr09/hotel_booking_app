import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { check, validationResult } from "express-validator";
const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isString(),
    check(
      "password",
      "Password with 6 or more characters is required"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    //check unvalid information
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({
        message: err.array(),
      });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      //already have user
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      //create new user
      user = new User(req.body);
      await user.save();
      //send token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_PRIVATE_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "something went wrong" });
    }
  }
);

export default router;
