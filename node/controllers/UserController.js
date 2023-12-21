import UserModel from "../models/UserModel.js";

const UserCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
UserCTRL.getAllUsers = async (req, res) => {
    try {
       const blogs =  await BlogModel.findAll()
       res.json(blogs)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

UserCTRL.getUser = async (req, res) => {
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

blogCTRL.createUser = async (req, res) => {
    try {
        await BlogModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

UserCTRL.updateUser = async (req, res) => {
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

UserCTRL.deleteUser = async (req , res) => {
    try {
        BlogModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default UserCTRL