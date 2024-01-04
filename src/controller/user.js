import bcrypt from "bcrypt";
import User from "../model/user.js";

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

export { SignUp };
