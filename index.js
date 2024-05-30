const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

// Mongodb Connection (-_-)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g4yea9q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const craftCollection = client.db("cradtDB").collection("craft");

    app.get("/addcraft", async(req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/addcraft/:id", async(req, res) => {
      const id = req.params.id;
      const qurey = {_id: new ObjectId(id)}
      const paint = await craftCollection.findOne(qurey);
      res.send(paint);
    })

    app.post("/addcraft", async(req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The painting server is running");
});

app.listen(port, () => {
  console.log(`The Painting Server Is Running On:${port}_PORT`);
});
