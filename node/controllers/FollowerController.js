import FollowerModels from "../models/FollowerModel.js"
import UserModel from "../models/UserModel.js"

const FollowerCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
FollowerCTRL.getAllFollowers = async (req, res) => {
    try {
       const follower =  await FollowerModels.findAll()
       res.json(follower)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

///followers Paginados
FollowerCTRL.getFollowerPaginated = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const userId = req.query.userId; // Get the userId from query parameters

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const follower = await FollowerModels.findAll({
            where: {
                userId: userId
            },
            include: { model: UserModel},
            offset: offset,
            limit: limit
        });
    
        // Find the total number of posts
        const totalfollower = await FollowerModels.count();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalfollower / limit),
            totalPosts: totalfollower,
            posts: follower
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }
}


//Mostrart un registro

FollowerCTRL.getFollower = async (req, res) => {
    try {
       const follower =  await FollowerModels.findAll({
        where: { id: req.params.id }
       })
       res.json(follower[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

FollowerCTRL.createFollower = async (req, res) => {
    try {
        await FollowerModels.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

FollowerCTRL.updateFollower = async (req, res) => {
    try {
         await FollowerModels.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

FollowerCTRL.deleteFollower = async (req , res) => {
    try {
        FollowerModels.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default FollowerCTRL