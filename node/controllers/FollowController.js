import FollowsModels from "../models/FollowTemp.js"

const followsCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
followsCTRL.getAllBlogs = async (req, res) => {
    try {
       const blogs =  await FollowsModels.findAll()
       res.json(blogs)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

followsCTRL.getBlog = async (req, res) => {
    try {
       const blog =  await FollowsModels.findAll({
        where: { id: req.params.id }
       })
       res.json(blog[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

followsCTRL.createBlog = async (req, res) => {
    try {
        await FollowsModels.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

followsCTRL.updateBlog = async (req, res) => {
    console.log("ENTRO", req.params.id)
    try {
         await FollowsModels.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

followsCTRL.deleteBlog = async (req , res) => {
    try {
        FollowsModels.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default followsCTRL