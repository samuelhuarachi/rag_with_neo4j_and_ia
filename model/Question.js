import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true, unique: true },
  criadoEm: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", userSchema);

export default Question;