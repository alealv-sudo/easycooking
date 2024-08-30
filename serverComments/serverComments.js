const db_username = "easycookingm1"
const db_password = "SiG5GcQoyhwdkwc8"

const uri = "mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD";

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const { replykeRoutes } = require('replyke-express');

const appComments = express();
// Connect to MongoDB
mongoose.connect("mongodb+srv://easycookingm1:SiG5GcQoyhwdkwc8@commentsbd.k71pq.mongodb.net/?retryWrites=true&w=majority&appName=CommentsBD");

appComments.use(cors())
appComments.use(express.json());
appComments.use(replykeRoutes);

const PORT = process.env.PORT || 443;
appComments.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

