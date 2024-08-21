import FollowedModels from "../models/FollowedModel.js"

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