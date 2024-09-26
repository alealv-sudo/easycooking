import express from "express";
import cors from "cors";

const serverIA = express();
const port = 5000;

var allowlist = ['https://localhost:3000/','https://easycooking-xi.vercel.app','https://easycooking-serveria.vercel.app','https://easycooking-server-comments.vercel.app']
const corsOptions = {
    origin: function (origin, callback) {
      if ((allowlist.indexOf(origin) !== -1 || !origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};
  
serverIA.use(cors(corsOptions))
serverIA.use(express.json())

import serverIARoutes  from "./serverIAControler/serverIARoutes.js";

serverIA.use('/executeIA', serverIARoutes)

serverIA.listen(port, () => {
    console.log('server UP running in http://localhost:5000/')
})
