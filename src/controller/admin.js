import Admin from "../model/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Jobs from "../model/jobs.js";
import User from "../model/user.js";

/*
@desc SIGN UP 
@POST request
*/
const SignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const ifExist = await Admin.findOne({ email });
    if (ifExist) {
      return res.status(200).json({ error: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Admin.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
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

    if (!title || !salary || !requirements || !image || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Modify the filename in the frontend to make them the same with the title to access the image path
    const imagePath = `public/uploads/${image}`;

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
const createAdminProfile = async (req, res) => {
  try {
    const { image, phone, age, position } = req.body;
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    admin.profile = {
      name: admin.name,
      image: image,
      email: admin.email,
      phone: phone,
      age: age,
      position: position,
      imagePath: `public/uploads/${image}`,
    };

    await admin.save();

    return res.status(201).json(admin);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// get the info of admin
const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.log(error);
  }
};

//delete a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobId } = req.body;
    const admin = await Admin.findById(id);
    if (!admin) {
      res.status(404).json({
        message: "Admin not found",
      });
    }

    if (!jobId) {
      return res.status(404).json({
        message: "Field are required",
      });
    }
    const ifJobExist = await Jobs.findById(jobId);
    if (!ifJobExist) {
      return res.status(400).json({
        message: "Job already deleted",
      });
    }
    const filteredJobs = admin.jobs.filter((job) => job !== jobId);
    admin.jobs = filteredJobs;
    await admin.save();

    await Jobs.findByIdAndDelete(jobId);
    const jobs = await Jobs.find();
    return res.status(201).json(jobs);
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// update a job
const updateJob = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    // sent by client
    const { title, salary, requirements, image, discription } = req.body;

    // find the admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // check if the job is comming from the admin
    if (admin.jobs.includes(jobId)) {
      // getting the job
      const job = await Jobs.findById(jobId);
      //  update the job
      job = {
        title: title !== undefined ? title : job.title,
        salary: salary !== undefined ? salary : job.salary,
        requirements:
          requirements !== undefined ? requirements : job.requirements,
        image: image !== undefined ? image : job.image,
        discription: discription !== undefined ? discription : job.discription,
        imagePath:
          image !== undefined ? `public/uploads/${image}` : job.imagePath,
      };

      await job.save();
      return res.status(201).json(job);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

const getApplicants = async (req, res) => {
  try {
    const { id, jobId } = req.params;
    // get the admin
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    // now check if the job  is from the admin
    if (admin.job.includes(jobId)) {
      const job = await Jobs.findById(jobId);
      const Applicants = await Promise.all(
        job.applicantsId.map((applicant) => User.findById(applicant))
      );

      const formattedApplicants = Applicants.map(({ information }) => {
        const {
          name,
          age,
          address,
          education,
          experience,
          course,
          skills,
          resume,
        } = information;

        return {
          name,
          age,
          address,
          education,
          experience,
          course,
          skills,
          resume,
        };
      });
      return res.status(200).json(job, formattedApplicants);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export {
  SignUp,
  Login,
  createJob,
  createAdminProfile,
  getAdmin,
  deleteJob,
  updateJob,
  getApplicants,
};
