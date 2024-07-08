import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

//Importa Conexion a la base de datos
import db from "./database/db.js";

db.sync()
//Importa Rutas
import blogRoutes from './routes/routes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import followerRoutes from "./routes/followerRoutes.js";
import googleRoutes  from './routes/googleRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//Rutas Back -> Front
app.use('/blogs', blogRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/followers', followerRoutes)
app.use('/profile', profileRoutes)

//GOOGLE
app.use("/google", googleRoutes)


try {
    db.authenticate().then(() => {
        console.log("Conexion exitosa a la base de datos")
    }).catch((error) => {
        console.log(error);
    })

} catch (error) {
    console.log(`El error de conexion es:${error}`)
}

app.listen(8000, () => {
    console.log('server UP running in http://localhost:8000/')
})
