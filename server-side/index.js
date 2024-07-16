import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

// Global Variables
const User_Registration_Keys = [
  "name",
  "password",
  "number",
  "email",
  "role",
  // "status"
  // "balance"
];

// Configuring App
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chatter-box-x.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

// Configuring Database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.poi1lw7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});
let db;

// Cookie Options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
};

// Test Route
app.get("/", async (req, res) => {
  res.json({ status: "success", message: "Server is Running!" });
});

// Auth Routes
// User Registration: Public
app.post("/users/register", async (req, res) => {
  const body = req.body;

  const allData = User_Registration_Keys.every((item) =>
    Object.keys(body).includes(item)
  );

  if (!allData) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  let result, status;
  try {
    const existsNumber = await db
      .collection("users")
      .findOne({ number: body.number });
    if (existsNumber) {
      res
        .status(400)
        .json({ success: false, message: "Number already Exists!" });
      return;
    }

    const existsEmail = await db
      .collection("users")
      .findOne({ email: body.email });
    if (existsEmail) {
      res
        .status(400)
        .json({ success: false, message: "Email already Exists!" });
      return;
    }
    body["status"] = "pending";
    body["balance"] = 0;

    const dbResult = await db.collection("users").insertOne(body);
    result = { success: true, ...dbResult };
    status = 200;
  } catch (error) {
    result = {
      success: false,

      message: "Failed to Create User",
      error: error.message,
    };
    status = 500;
  }

  res.status(status).json(result);
});

// User Login: Public
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  try {
    const exists = await db.collection("users").findOne({
      $or: [{ email: email }, { number: email }],
    });

    if (!exists) {
      res
        .status(400)
        .json({ success: false, message: "Authentication Failed!" });
      return;
    }

    if (password !== exists.password) {
      res
        .status(400)
        .json({ success: false, message: "Authentication Failed!" });
      return;
    }

    const token = jwt.sign(
      { email: exists.email, number: exists.number },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to Create User",
      error: error.message,
    });
  }
});

// User Routes
// Get User: Protected Route: TODO
app.get("/me", async (req, res) => {
  // const email = req.email;
  const email = req.headers.email;

  try {
    const exists = await db.collection("users").findOne({
      $or: [{ email: email }, { number: email }],
    });

    if (!exists) {
      res.status(400).json({ success: false, message: "User Not Found!" });
      return;
    }

    res.status(200).json({ success: true, ...exists });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to Create User",
      error: error.message,
    });
  }
});

// Send Money: Protected Route: TODO
app.post("/me/send-money", async (req, res) => {
  // const email = req.email;
  const email = req.headers.email;
  const { recipent, amount } = req.body;
  if (!recipent || !amount) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  try {
    let fee = 0;
    const exists = await db.collection("users").findOne({
      $or: [{ email: email }, { number: email }],
    });

    if (!exists) {
      res.status(400).json({ success: false, message: "User Not Found!" });
      return;
    }

    if (!(await db.collection("users").findOne({ number: recipent }))) {
      res.status(400).json({ success: false, message: "Recipent Not Found!" });
      return;
    }

    if (parseFloat(amount) > parseFloat(exists.balance)) {
      res
        .status(400)
        .json({ success: false, message: "You don't have enough Balance!" });
      return;
    }

    if (parseFloat(amount) < 50) {
      res
        .status(400)
        .json({ success: false, message: "Minimum Send Money is 50!" });
      return;
    } else if (parseFloat(amount) > 100) {
      fee = 5;
    }

    const total = parseFloat(amount) + fee;
    const body = {
      recipent: recipent,
      sender: email,
      amount: parseFloat(amount),
      fee: fee,
      time: new Date().toJSON(),
    };

    const response = await db.collection("transaction-history").insertOne(body);
    await db.collection("users").updateOne(
      {
        $or: [{ email: email }, { number: email }],
      },
      {
        $inc: { balance: -total },
      }
    );
    await db.collection("users").updateOne(
      { number: recipent },
      {
        $inc: { balance: parseFloat(amount) },
      }
    );

    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to Send Money",
      error: error.message,
    });
  }
});

// Route: User

// Connecting to MongoDB first, then Starting the Server
client
  .connect()
  .then(async () => {
    db = client.db("payeer");
    app.listen(port, () => {
      console.log(`Running in port ${port}`);
    });
  })
  .catch(console.dir);
