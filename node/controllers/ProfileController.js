import ProfileModel from "../models/ProfileModel.js";

import { Op } from "sequelize";

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

// MOSTRAR LISTA DE REGISTROS POR NOMBRE DE USUARIO
profileCTRL.getProfiles = async (req, res) => {
    const fullName = req.params.id.split(' ');
    const conditions = [];

    if (fullName.length === 1) {
        conditions.push(
            { name: { [Op.iLike]: `%${fullName[0]}%` } },
            { lastName: { [Op.iLike]: `%${fullName[0]}%` } }
        );
    } else if (fullName.length === 2) {
        conditions.push(
            { name: { [Op.iLike]: `%${fullName[0]}%` }, lastName: { [Op.iLike]: `%${fullName[1]}%` } },
            { name: { [Op.iLike]: `%${fullName[1]}%` }, lastName: { [Op.iLike]: `%${fullName[0]}%` } }
        );
    } else if (fullName.length >= 3) {
        const firstName = fullName.slice(0, fullName.length - 1).join(' ');
        const lastName = fullName[fullName.length - 1];
        conditions.push(
            { name: { [Op.iLike]: `%${firstName}%` }, lastName: { [Op.iLike]: `%${lastName}%` } },
            { name: { [Op.iLike]: `%${fullName[0]}%` }, lastName: { [Op.iLike]: `%${fullName.slice(1).join(' ')}%` } }
        );
    }

    try {
        const profiles = await ProfileModel.findAll({
            where: {
                [Op.or]: conditions
            },
            limit: 10
        });
        res.json(profiles);
    } catch (error) {
        res.json({ message: error.message });
    }
};


export default profileCTRL