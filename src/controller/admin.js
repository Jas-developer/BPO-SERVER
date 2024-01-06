import Admin from "../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jobs from "../model/jobs.js";

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

    if (!isMatch) {
      res.status(403).json({
        message: "Invalid credintials",
      });
    }
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

/* 
desc POST
desc POST
will create a job
*/

const createJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, salary, requirements, description, image } = req.body;

    // Getting the admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    if (!title || !salary || !requirements || !image) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Modify the filename in the frontend to make them the same with the title to access the image path
    const imagePath = `public/uploads/${image}`; // Correcting the imagePath

    // Create the job object
    const newJob = {
      title: title,
      image: image,
      salary: salary,
      requirements: requirements,
      description: description,
      imagePath: imagePath,
    };

    // Push the new job to the admin's jobs array
    const createdJob = await Jobs.create(newJob);

    if (!createdJob) {
      return res.status(400).json({
        message: "Unable to create new jobs",
      });
    }

    admin.jobs.push(createdJob._id);
    await admin.save();

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//create an admin profile
const createAdminProfile = async () => {};

export { SignUp, Login, createJob };
