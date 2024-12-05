const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

// AssetManagement
// QbEobHFEk1OsvcXo
// console.log("Mongodb User name ",process.env.ASSET_USER)
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
    await client.connect();

    const userCollection = client.db('AssetManagement').collection('UserInfo');

     // using post operation for post food items on mongodb
     app.post('/users', async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result);
    })
    app.get('/users/:email', async(req,res)=>{
      const email = req.params.email
      const query = { email: email };
      const result = await userCollection.findOne(query)
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