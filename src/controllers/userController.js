import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";
import { JWT_SECRET } from "../config.js";
import { Meeting } from "../model/meetingModel.js";

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
    // 3. Compare password (await the result)
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    // 4. Generate JWT
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1h" } // optional expiry
    );
    return res.status(httpStatus.OK).json({
      message: "Logged in successfully",
      token: token,
    });
  } catch (error) {
    res.json({ message: `Something went wrong ${error}` });
  }
};

const getUserHistory = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username: username });
    const meetings = await Meeting.find({userId: user.username });
    res.json(meetings);
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

const addToUserHistory = async (req, res) => {
  const { username, meetingCode } = req.body;

  try {
    const user = await User.findOne({ username: username });
    const newMeeting = new Meeting({
      userId: user.username,
      meetingCode: meetingCode,
    });
    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added to history" });
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` });
  }
};

export { signup, signin, getUserHistory, addToUserHistory };
