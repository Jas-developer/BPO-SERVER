import Admin from "../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/*
@desc SIGN UP 
@POST request
*/
const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const ifExist = await Admin.findOne({ email });
    if (ifExist) {
      res.status(200).json({ error: "Admin already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/*
desc POST REQUEST
ADMIN LOGIN CONTROLLER
*/

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(404).json({
        error: "Admin not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    const token = jwt.sign({ userId: admin._id }, "softwareengineer23", {
      expiresIn: "1h",
    });

    if (isMatch) {
      res.status(200).json({
        name: admin.name,
        email: admin.email,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/*
desc POST
desc POST
*/

export { SignUp, Login };
