import { Router } from "express";
import { signup, signin } from "../controllers/userController.js";
const userRoutes = Router();

userRoutes.route("/signup").post(signup);
userRoutes.route("/signin").post(signin);
userRoutes.route("/addToActivity");
userRoutes.route("/getAllActivity");

export default userRoutes;
