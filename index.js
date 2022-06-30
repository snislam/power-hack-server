const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxfyl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const blillings = client.db("power-hack").collection("billings");

        // get all billings
        app.get('/billing-list', async (req, res) => {
            const result = await blillings.find({}).toArray();
            res.send(result)
        })

        // post a billing
        app.post('/add-billing', async (req, res) => {
            const data = req.body;
            const result = await blillings.insertOne(data)
            res.send(result);
        })

        // update bill
        app.put('/add-billing/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: data
            }
            const result = await blillings.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // delete bill
        app.delete('/delete-billing/:id', async (req, res) => {
            const id = req.params.id;
            const result = await blillings.deleteOne({ _id: ObjectId(id) })
            res.send(result);
        })

    } finally {
        // empty block for now
    }
}

run().catch(console.dir)


// main route api
app.get('/', async (req, res) => {
    console.log("connected");
    res.send('I am ready to start the project.')
})

// pass qZoTKmRU8Xpv4Z9m
// user power-hack
// port litening
app.listen(port, () => {
    console.log('Port', port)
})