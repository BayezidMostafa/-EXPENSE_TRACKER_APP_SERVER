require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Default middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const run = async () => {
  try {
    const userDataCollection = client.db("expense-db").collection("userData");
    const expenseCollection = client
      .db("expense-db")
      .collection("expense-data");

    app.put("/userData", async (req, res) => {
      const userInfo = req.body;
      const filter = {
        name: userInfo?.name,
        email: userInfo?.email,
        balance: userInfo?.balance,
      };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: userInfo?.name,
          email: userInfo?.email,
          balance: userInfo?.balance,
        },
      };
      const result = await userDataCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.status(200).send(result);
    });
    app.put("/expenseInfo", async (req, res) => {
      const spendinfo = req.body;
      const filter = {
        spend: spendinfo?.spend,
        category: spendinfo?.categoryInfo,
        email: spendinfo?.email,
      };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          spend: spendinfo?.spend,
          category: spendinfo?.categoryInfo,
          email: spendinfo?.email,
        },
      };
      const result = await expenseCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
    app.get("/userInformation/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await userDataCollection.findOne(filter);
      res.send(result);
    });
    app.put("/upblnc/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const data = req.body;
      console.log(data);
      const filter = { email };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          balance: data.updatedbalance,
        },
      };
      const result = await userDataCollection.updateOne(
        filter,
        updateDoc,
        option
      );
      res.send(result);
    });
  } catch {
  } finally {
  }
};
run().catch((err) => console.error(err.message));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
