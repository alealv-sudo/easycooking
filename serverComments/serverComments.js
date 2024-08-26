const db_username = "easycookingm1"
const db_password = "SiG5GcQoyhwdkwc8"

const uri = "mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD";

const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const { replykeRoutes } = require('replyke-express');

const appComents = express();
// Connect to MongoDB
mongoose.connect("mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD");

appComents.use(cors())
appComents.use(express.json());
appComents.use(replykeRoutes);

const PORT = 4000;
appComents.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

