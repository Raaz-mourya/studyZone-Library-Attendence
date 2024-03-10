const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    seatNumber: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: Number, required: true },
    status: { type: String, default: "pending" },
    role: { type: String, default: "student" },
  },
  { timestamps: true }
  // timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
);

module.exports = mongoose.model("Student", studentSchema);
