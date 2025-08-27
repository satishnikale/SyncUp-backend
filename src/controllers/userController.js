import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";
import { JWT_SECREAT } from "../config.js";

// User signup
const signup = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });

    console.log(existingUser);
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    const users = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await users.save();
    res.status(httpStatus.CREATED).json({ message: "User Creacted" });
  } catch (error) {
    res.json({
      message: `Something went wrong ${error}`,
    });
  }
};

// User signIn
const signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide Creadentials" });
  }

  try {
    const user = await User.find({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }
    // incoming data is array of objects
    if (bcrypt.compare(password, user[0].password)) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        JWT_SECREAT
      );
      return res.status(httpStatus.OK).json({
        message: "Loged in Successfully",
        token: token,
      });
    } else {
      return res.json({
        message: "Invalide Credeantials",
      });
    }
  } catch (error) {
    res.json({ message: `Something went wrong ${error}` });
  }
};

export { signup, signin };
