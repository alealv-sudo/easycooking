import BlogModel from "../models/BlogModel.js";

const blogCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
blogCTRL.getAllBlogs = async (req, res) => {
    try {
       const blogs =  await BlogModel.findAll()
       res.json(blogs)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

blogCTRL.getBlog = async (req, res) => {
    try {
       const blog =  await BlogModel.findAll({
        where: { id: req.params.id }
       })
       res.json(blog[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

blogCTRL.createBlog = async (req, res) => {
    try {
        await BlogModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

blogCTRL.updateBlog = async (req, res) => {
    console.log("ENTRO", req.params.id)
    try {
         await BlogModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

blogCTRL.deleteBlog = async (req , res) => {
    try {
        BlogModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default blogCTRL