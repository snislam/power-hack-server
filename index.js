const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
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
            console.log(req.query)
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.size);
            const cursor = blillings.find({})
            let result;
            if (page || limit) {
                result = await cursor.skip(page * limit).limit(limit).toArray();
            } else {
                result = await cursor.toArray();
            }
            res.send(result)
        })

        // get total billings number
        app.get('/billingscount', async (req, res) => {
            const cursor = blillings.find({})
            const count = await cursor.count();
            res.send({ count: count })
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

        // search data by email
        app.get('/search-billing-email/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await blillings.find(filter).toArray();
            res.send(result)
        })

        // search data by name
        app.get('/search-billing-name/:name', async (req, res) => {
            const name = req.params.name;
            const filter = { name }
            const result = await blillings.find(filter).toArray();
            res.send(result)
        })

        // search data by number
        app.get('/search-billing-number/:number', async (req, res) => {
            const number = req.params.number;
            const filter = { phone: number }
            const result = await blillings.find(filter).toArray();
            res.send(result)
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

// port litening
app.listen(port, () => {
    console.log('Port', port)
})