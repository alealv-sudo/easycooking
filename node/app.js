import express from "express";
import cors from "cors";

//Importa Conexion a la base de datos
import db from "./database/db.js";

db.sync()
//Importa Rutas
import blogRoutes from './routes/routes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import followerRoutes from "./routes/followerRoutes.js";
import googleRoutes  from './routes/googleRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

//Rutas Back -> Front
app.use('/blogs', blogRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/followers', followerRoutes)


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

/* app.get('/', (req, res) =>{
    res.send("Hola Mundo")
}) */

app.listen(8000, () => {
    console.log('server UP running in http://localhost:8000/')
})
