import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema({
  userId: { type: String, require: true },
  meetingCode: { type: String, require: true },
  Date: { type: Date, default: Date.now(), require: true },
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export { Meeting };
