import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  salary: String,
  requirements: String,
  image: String,
  imagePath: String,
  discription: String,
  applicantsId: [String],
});

const Jobs = mongoose.model("Jobs", jobSchema);
export default Jobs;
