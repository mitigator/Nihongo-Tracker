import mongoose, { Document, Model } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  otp: string;
  name: string;
  password: string;
  expiresAt: Date;
}

const otpTokenSchema = new mongoose.Schema<IOtpToken>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // MongoDB TTL index — automatically deletes the document after expiry
    index: { expires: 0 },
  },
});

const OtpToken: Model<IOtpToken> =
  mongoose.models.OtpToken ?? mongoose.model<IOtpToken>("OtpToken", otpTokenSchema);

export default OtpToken;