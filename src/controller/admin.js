import Admin from "../model/admin";
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
    
};
export { SignUp };
