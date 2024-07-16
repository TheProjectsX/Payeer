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

// User-Agent Common Routes
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
  const { recipient, amount } = req.body;
  if (!recipient || !amount) {
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

    if (!(await db.collection("users").findOne({ number: recipient }))) {
      res.status(400).json({ success: false, message: "Recipient Not Found!" });
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
      action: "send-money",
      recipient: recipient,
      sender: email,
      amount: parseFloat(amount),
      fee: fee,
      time: new Date().toJSON(),
      status: "resolved",
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
      { number: recipient },
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

// Cash Out: Private-Protected Route: TODO
app.post("/me/cash-out", async (req, res) => {
  // const email = req.email;
  const email = req.headers.email;
  const { recipient, amount } = req.body;
  if (!recipient || !amount) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  try {
    const exists = await db.collection("users").findOne({
      $or: [{ email: email }, { number: email }],
    });

    if (!exists) {
      res.status(400).json({ success: false, message: "User Not Found!" });
      return;
    }

    const agent = await db.collection("users").findOne({ number: recipient });
    if (!agent) {
      res.status(400).json({ success: false, message: "Recipient Not Found!" });
      return;
    } else {
      if (agent.role !== "agent") {
        res
          .status(400)
          .json({ success: false, message: "Recipient is not an Agent!" });
        return;
      }
    }

    if (parseFloat(amount) > parseFloat(exists.balance)) {
      res
        .status(400)
        .json({ success: false, message: "You don't have enough Balance!" });
      return;
    }

    const fee = parseFloat(amount) * 0.015;

    const total = parseFloat(amount) + fee;
    const body = {
      action: "cash-out",
      recipient: recipient,
      sender: email,
      amount: parseFloat(amount),
      fee: fee,
      time: new Date().toJSON(),
      status: "pending",
    };

    const response = await db.collection("transaction-history").insertOne(body);
    res
      .status(200)
      .json({ success: true, message: "Cash Out Request Sent!", ...response });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to Cash Out",
      error: error.message,
    });
  }
});

// Cash In: Protected Route: TODO
app.post("/me/cash-in-request", async (req, res) => {
  // const email = req.email;
  const email = req.headers.email;
  const { recipient, amount } = req.body;

  if (!recipient || !amount) {
    res.status(400).json({ success: false, message: "Invalid Body Request" });
    return;
  }

  try {
    const exists = await db.collection("users").findOne({
      $or: [{ email: email }, { number: email }],
    });

    if (!exists) {
      res.status(400).json({ success: false, message: "User Not Found!" });
      return;
    }

    const agent = await db.collection("users").findOne({ number: recipient });
    if (!agent) {
      res.status(400).json({ success: false, message: "Recipient Not Found!" });
      return;
    } else {
      if (agent.role !== "agent") {
        res
          .status(400)
          .json({ success: false, message: "Recipient is not an Agent!" });
        return;
      }
    }

    const fee = 0;

    const body = {
      action: "cash-in-request",
      recipient: recipient,
      sender: email,
      amount: parseFloat(amount),
      fee: fee,
      time: new Date().toJSON(),
      status: "pending",
    };

    const response = await db.collection("transaction-history").insertOne(body);

    res
      .status(200)
      .json({ success: true, message: "Cash-In Request Sent!", ...response });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to Request Cash In",
      error: error.message,
    });
  }
});

// Get Transactions: Protected Route: TODO
app.get("/me/transactions", async (req, res) => {
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

    const history = await db
      .collection("transaction-history")
      .find({
        $or: [{ sender: exists.number }, { recipient: exists.number }],
      })
      .sort({ _id: -1 })
      .limit(exists.role === "user" ? 10 : 20)
      .toArray();

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Failed to get Transaction History",
      error: error.message,
    });
  }
});

// Agent Routes
// Cash In Approval: Protected Route: TODO
app.put("/agent/approve-cash-in/:id", async (req, res) => {
  // const number = req.user.????
  const number = req.headers.email;
  const transactionId = req.params.id;

  try {
    const transactionDetails = await db
      .collection("transaction-history")
      .findOne({ _id: new ObjectId(transactionId) });
    if (!transactionDetails) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Transaction ID Provided" });
      return;
    }

    if (transactionDetails.status === "resolved") {
      res
        .status(400)
        .json({ success: false, message: "Transaction already Approved!" });
      return;
    }

    if (transactionDetails.recipient !== number) {
      res
        .status(400)
        .json({ success: false, message: "Unauthorized Request!" });
      return;
    }

    await db.collection("users").updateOne(
      {
        number: transactionDetails.sender,
      },
      {
        $inc: { balance: transactionDetails.amount },
      }
    );
    await db.collection("users").updateOne(
      { number: transactionDetails.recipient },
      {
        $inc: { balance: -transactionDetails.amount },
      }
    );

    const response = await db
      .collection("transaction-history")
      .updateOne(
        { _id: new ObjectId(transactionId) },
        { $set: { status: "resolved" } }
      );
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve Cash In Request",
      error: error.message,
    });
  }
});

// Cash In Approval: Protected Route: TODO
app.put("/agent/approve-cash-out/:id", async (req, res) => {
  // const number = req.user.????
  const number = req.headers.email;
  const transactionId = req.params.id;

  try {
    const transactionDetails = await db
      .collection("transaction-history")
      .findOne({ _id: new ObjectId(transactionId) });
    if (!transactionDetails) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Transaction ID Provided" });
      return;
    }

    if (transactionDetails.status === "resolved") {
      res
        .status(400)
        .json({ success: false, message: "Transaction already Approved!" });
      return;
    }

    if (transactionDetails.recipient !== number) {
      res
        .status(400)
        .json({ success: false, message: "Unauthorized Request!" });
      return;
    }

    await db.collection("users").updateOne(
      {
        number: transactionDetails.sender,
      },
      {
        $inc: { balance: -transactionDetails.amount - transactionDetails.fee },
      }
    );
    await db.collection("users").updateOne(
      { number: transactionDetails.recipient },
      {
        $inc: { balance: transactionDetails.amount + transactionDetails.fee },
      }
    );

    const response = await db
      .collection("transaction-history")
      .updateOne(
        { _id: new ObjectId(transactionId) },
        { $set: { status: "resolved" } }
      );

    res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve Cash Out Request",
      error: error.message,
    });
    console.log(error);
  }
});

// Admin Routes
// Get All Users: Admin Route: TODO
app.get("/admin/users", async (req, res) => {
  const { name } = req.query;

  let query = {};
  if (name) {
    query = { name: new RegExp(name, "i") };
  }

  try {
    const users = await db.collection("users").find(query).toArray();

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get User List",
      error: error.message,
    });
    console.log(error);
  }
});

// Activate Account: Admin Route: TODO
app.put("/admin/activate/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const exists = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userID) });
      console.log(exists, userID)
    if (!exists) {
      res
        .status(400)
        .json({ success: false, message: "User Does not Exist!" });
      return;
    }

    if (exists.status === "active") {
      res
        .status(400)
        .json({ success: false, message: "User account is already Active!" });
      return;
    }

    const response = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userID) }, { $set: { status: "active" } });
      res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change User Status",
      error: error.message,
    });
    console.log(error);
  }
});

// Block Account: Admin Route: TODO
app.put("/admin/block/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const exists = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userID) });
    if (!exists) {
      res
        .status(400)
        .json({ success: false, message: "User Does not Exist!" });
      return;
    }

    if (exists.status === "blocked") {
      res
        .status(400)
        .json({ success: false, message: "User account is already Blocked!" });
      return;
    }

    const response = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userID) }, { $set: { status: "blocked" } });
      res.status(200).json({ success: true, ...response });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change User Status",
      error: error.message,
    });
    console.log(error);
  }
});


// Get all Transactions: Admin Route: TODO
app.get("/admin/transactions", async (req, res) => {

  try {
    const history = await db
      .collection("transaction-history")
      .find()
      .sort({ _id: -1 })
      .toArray();

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Transaction History",
      error: error.message,
    });
  }
});

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
