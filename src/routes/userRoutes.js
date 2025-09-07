import { Router } from "express";
import {
  signup,
  signin,
  addToUserHistory,
  getUserHistory,
} from "../controllers/userController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
const userRoutes = Router();

userRoutes.route("/signup").post(signup);
userRoutes.route("/signin").post(signin);
userRoutes.route("/addToActivity").post(addToUserHistory);
userRoutes.route("/getAllActivity").get(getUserHistory);

export default userRoutes;
