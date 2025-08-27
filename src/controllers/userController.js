import { User } from "../model/userModel";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const signUp = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.find({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    const user = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await user.save();
    res.status(httpStatus.CREATED).json({ message: "User Creacted" });
    
  } catch (error) {
    res.json({
      message: `Something went wrong ${error}`,
    });
  }
};
