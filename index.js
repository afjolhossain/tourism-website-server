const express = require('express');
const { MongoClient } = require('mongodb');
const cors= require('cors');
require('dotenv').config();
const app = express();
const port =process.env.PORT|| 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://sylhetVisit:${process.env.DB_PASS}@cluster0.hvuwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected succeffylly')
        const database = client.db("insertServices");
        const ServicesCollection = database.collection("Services");
        const PlaceCollection = database.collection("places");

        // GET services API :
        app.get('/services',async(req,res)=>{
            const cursor = ServicesCollection.find({});
            const services =await cursor.toArray();
            res.send(services);
        });
        // GET Places API :
        app.get('/places', async(req,res)=>{
          const cursor = PlaceCollection.find({});
          const places =await cursor.toArray();
          res.send(places);
        });


        // POST plases API
        app.post('/places', async(req,res)=>{
          const places = req.body;
          console.log('hit the places',places)

          const result =await PlaceCollection .insertOne(places);
          console.log(result);
          res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('this is my runing server')
})

app.listen(port, () => {
  console.log('listening',port)
})