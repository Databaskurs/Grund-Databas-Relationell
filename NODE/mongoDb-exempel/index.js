
/*
skapa en tom mapp och navigera dit i en terminal motsv.
kör sen:

npm init -y

npm install express mongodb
*/


//importera moduler
const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');


//skapa instans av express och lägg till json parser
const app = express();
app.use(express.json());


//ange adress till din mongoDB, här kör vi lokalt men man kan använda atlas ist
const uri  = 'mongodb://localhost:27017';

//skapa instans av mongoDB klienten
const client = new MongoClient(uri);
let db;

//koppla upp mot vår lokala mongoDB
client.connect().then(()=>{
    db = client.db('testdb');   //om databasen inte finns så skapas den
    console.log('connected to mongoDB');
})

//starta upp express servern
app.listen(3000, () => console.log('server running at port 3000'));


//------- enpoints med CRUD operationer ---------------

//CREATE
app.post('/users', async (req, res) => {
    const result = await db.collection('users').insertOne(req.body);
    res.json(result);
});

//READ
app.get('/users', async (req,res) =>{
    const users = await db.collection('users').find().toArray();
    res.json(users);
})

app.get('/users/:id', async (req,res) =>{
    const user = await db.collection('users').findOne({_id: new ObjectId(req.params.id)});
    user ? res.json(user) : res.status(404).json({message: 'user not found'});
});

//UPDATE
app.put('/users/:id', async (req,res) => { 
    const result = await db.collection('users').updateOne(
        {_id: new ObjectId(req.params.id)}, 
        {$set: req.body}      
    );
    res.json(result)
});

//DELETE
app.delete('/users/:id', async (req,res) => {
    const result = await db.collection('users').deleteOne({_id: new ObjectId(req.params.id)});
    result.deletedCount > 0 
    ? res.json({message: 'user deleted'}) 
    : res.status(404).json({message: 'user not found. nothing deleted'})
})

