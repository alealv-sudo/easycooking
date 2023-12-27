import UserModel from "../models/UserModel.js";

const UserCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
UserCTRL.getAllUsers = async (req, res) => {
    try {
       const blogs =  await UserModel.findAll()
       res.json(blogs)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

UserCTRL.getUser = async (req, res) => {
    try {
       const blog =  await UserModel.findAll({
        where: { id: req.params.id }
       })
       res.json(blog[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar registro por correo
UserCTRL.getUserByEmailC = async (req, res) => {
    try {
       const user =  await UserModel.findAll({
        where: { email: req.body.email}
       })
       res.json(user[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

UserCTRL.createUser = async (req, res) => {
    console.log(req.body);
    try {
        await UserModel.create(req.body)
        res.json({"message": "Usuario Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

UserCTRL.updateUser = async (req, res) => {
    try {
         await UserModel.update(req.body, {
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
        UserModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default UserCTRL