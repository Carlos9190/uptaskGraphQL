import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.DB_MONGO;

  if (mongoURI) {
    try {
      await mongoose.connect(mongoURI);
      console.log("DB connected");
    } catch (error) {
      console.error("There was an error", error);
      process.exit(1);
    }
  }
};
