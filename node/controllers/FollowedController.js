import FollowedModels from "../models/FollowedModel.js"
import UserModel from "../models/UserModel.js" 

const FollowedCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
FollowedCTRL.getAllFolloweds = async (req, res) => {
    try {
       const followed =  await FollowedModels.findAll()
       res.json(followed)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//followed paginados

FollowedCTRL.getFollowedPaginated = async (req, res) => {
    console.log("entro");
    
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const userId = req.query.userId; // Get the userId from query parameters

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const followed = await FollowedModels.findAll({
            where: {
                userId: userId
            },
            include: { model: UserModel},
            offset: offset,
            limit: limit
        });

        console.log("hola", followed);
        
        // Find the total number of posts
        const totalfollowed = await FollowedModels.count();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalfollowed / limit),
            totalPosts: totalfollowed,
            posts: followed
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

//Mostrart un registro

FollowedCTRL.getFollowed = async (req, res) => {
    try {
       const followed =  await FollowedModels.findAll({
        where: { id: req.params.id }
       })
       res.json(followed[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

FollowedCTRL.createFollowed = async (req, res) => {
    try {
        await FollowedModels.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

FollowedCTRL.updateFollowed = async (req, res) => {
    try {
         await FollowedModels.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

FollowedCTRL.deleteFollowed = async (req , res) => {
    try {
        FollowedModels.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default FollowedCTRL