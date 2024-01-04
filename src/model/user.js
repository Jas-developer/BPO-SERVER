import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  information: [
    {
      name: String,
      age: String,
      address: String,
      education: String,
      experience: String,
      course: String,
      skills: String,
      resume: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
