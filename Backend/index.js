import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import connectDB from "./config/db.js";
import User from "./models/User.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "https://zevox-tech-store.vercel.app",
  credentials: true
}));

app.use(express.json());
app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "ecommerce-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        password: "GOOGLE_OAUTH_" + Math.random().toString(36).slice(2),
        avatar: profile.photos?.[0]?.value || "",
      });
    } else if (!user.googleId) {
      user.googleId = profile.id;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/auth-success?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&role=${user.role || "user"}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=auth_failed`);
    }
  }
);

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => res.send("✅ GuptaStore API is running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
