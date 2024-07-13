import ProfileModel from "../models/ProfileModel.js";

const profileCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
profileCTRL.getAllProfiles = async (req, res) => {
    try {
       const profile =  await ProfileModel.findAll()
       res.json(profile)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

profileCTRL.getProfile = async (req, res) => {
    try {
       const profile =  await ProfileModel.findAll({
        where: { id: req.params.id }
       })
       res.json(profile[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

profileCTRL.createProfile = async (req, res) => {
    try {
        await ProfileModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

profileCTRL.updateProfile = async (req, res) => {
    try {
         await ProfileModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

profileCTRL.deleteProfile = async (req , res) => {
    try {
        ProfileModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default profileCTRL