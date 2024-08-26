const { MongoClient, ServerApiVersion } = require('mongodb');

const db_username = "easycookingm1"
const db_password = "SiG5GcQoyhwdkwc8"

const uri = "mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD";

// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// run().catch(console.dir);



const express = require('express');
const mongoose = require('mongoose');
const { replykeRoutes } = require('replyke-express');

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD");

app.use(express.json());
app.use(replykeRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

