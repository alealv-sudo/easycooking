import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

//Importa Conexion a la base de datos
import db from "./database/db.js";

//Importa Asociasiones
import {} from './models/associations.js'

db.sync()
//Importa Rutas
import blogRoutes from './routes/routes.js'
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import generalPostRoutes from './routes/generalPostRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import followerRoutes from "./routes/followerRoutes.js";
import followedRoutes from "./routes/followedRoutes.js";
import googleRoutes  from './routes/googleRoutes.js'
import recipeReviewRoutes from './routes/recipeReviewRoutes.js'
import IngredientsRutes from './routes/ingredientRoutes.js'
import RatingsRoutes from './routes/ratingRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import likesRoutes from './routes/likeRoutes.js'
import marketListRoutes from './routes/marketListRoutes.js'
import listItemRoutes from './routes/listItemRoutes.js'
import listCalendarRoutes from './routes/listCalendarRoutes.js'
import recipeCommentsRoutes from "./routes/recipeCommentsRoutes.js";

var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
  
const app = express()

app.use(cors(corsOptions))
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
app.use('/followeds', followedRoutes)
app.use('/profile', profileRoutes)
app.use('/generalPost', generalPostRoutes)
app.use('/reviewPost', recipeReviewRoutes)
app.use('/ingredients', IngredientsRutes)
app.use('/ratings', RatingsRoutes)
app.use('/favorites', favoriteRoutes)
app.use('/likes', likesRoutes)
app.use('/marketList', marketListRoutes)
app.use('/listItems', listItemRoutes)
app.use('/calendar', listCalendarRoutes)
app.use('/recipeComments', recipeCommentsRoutes)

//GOOGLE
app.use("/google", cors(corsOptions), googleRoutes)

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
