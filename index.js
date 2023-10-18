const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj0pjif.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("brandDB");
    const carsCollection = database.collection("Cars");
    const cartsCollection = database.collection("Carts")

    app.get('/allCars', async (req, res) => {
      const result = await carsCollection.find().toArray();
      res.send(result)
    })
    app.post('/allCars', async (req, res) => {
      const car = req.body;
      console.log(car);
      const result = await carsCollection.insertOne(car);
      res.send(result)
    })
    app.get('/brands', async (req, res) => {
      const brand = req.query.brand;
      const query = { brand: brand };
      const result = await carsCollection.find(query).toArray();
      res.send(result)
    })
    app.get('/showCar/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsCollection.findOne(query);
      res.send(result)
    })
    app.get('/myCarts' , async(req , res)=>{
        const result = await cartsCollection.find().toArray();
        res.send(result)
    }) 
    app.post('/myCarts' , async(req , res)=>{
        const car = req.body;
        console.log(car);
        const result = await cartsCollection.insertOne(car);
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


















app.get('/', (req, res) => {
  res.send('Automotive product server is running')
})

app.listen(port, () => {
  console.log(`Automotive product server is running on port : ${port}`);
})