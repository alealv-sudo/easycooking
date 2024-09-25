import express from "express";
import cors from "cors";

const serverIA = express();
const port = 5000;

serverIA.use(cors())
serverIA.use(express.json())

import serverIARoutes  from "./serverIAControler/serverIARoutes.js";

serverIA.use('/executeIA', serverIARoutes)

serverIA.listen(port, () => {
    console.log('server UP running in http://localhost:5000/')
})
