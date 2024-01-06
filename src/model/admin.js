import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile: {
    name: String,
    image: String,
    age: String,
    position: String,
    phone: String,
    email: String,
    imagePath: String,
  },

  jobs: [String],
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
