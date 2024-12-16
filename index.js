const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.ASSET_USER}:${process.env.ASSET_PASS}@cluster0.szzkw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01`;

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
    // await client.connect();

    const userCollection = client.db('AssetManagement').collection('UserInfo')
    const assetCollection =  client.db('AssetManagement').collection('AddAssets');

    // using post operation for post food items on mongodb
    app.post('/users', async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result);
    })


    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email };
      const result = await userCollection.findOne(query)
      // console.log(result)
      res.send(result)
    })

    app.get('/all-users', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })

    // delete operation
    app.delete('/all-users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })



    // For asset part add asset
    app.post('/assets', async (req, res) => {
      const asset = req.body;
      const result = await assetCollection.insertOne(asset);
      console.log("asset", asset);
      res.send(result);

    })
    // delete operation
    app.delete('/assets/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assetCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/assets', async (req, res) => {
      const result = await assetCollection.find().toArray()
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
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Asset Management system server is running')
})

app.listen(port, () => {
  console.log(`Asset Management system server is running on port: ${port}`)
})