import  express  from "express";
import  cors  from "cors";

//Importa Conexion a la base de datos
 import db from "./database/db.js";

 //Importa Rutas
 import blogRoutes from './routes/routes.js'

 
const app = express()

app.use(cors())
app.use(express.json())

//Rutas Back -> Front
app.use('/blogs', blogRoutes)

try {
    db.authenticate()
    console.log("Conexion exitosa a la base de datos")
} catch (error) {
    console.log(`El error de conexion es:${error}`)
}

/* app.get('/', (req, res) =>{
    res.send("Hola Mundo")
}) */

app.listen(8000, () => {
    console.log('server UP running in http://localhost:8000/')
})