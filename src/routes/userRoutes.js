import { Router } from "express";

const router = Router();

router.route("/signup");
router.route("/signin");
router.route("/addToActivity");
router.route("/getAllActivity");

export default router;
