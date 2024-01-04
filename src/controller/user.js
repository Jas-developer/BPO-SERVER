import bcrypt from "bcrypt";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
/*
POST
SIGNING UP A USER
*/
const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "User is already existed",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500);
  }
};

/*
desc: LOGIN THE USER 
POSR REQUESR
*/

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid Credintials" });
    }

    const token = jwt.sign({ userId: user._id }, "softwareengineer23", {
      expiresIn: "1h",
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

export { SignUp, Login };
