import ListCalendarModel from "../models/ListCalendarModel.js";
import PostModel from "../models/PostModel.js"

const ListCalendarCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
ListCalendarCTRL.getAllItems = async (req, res) => {
    try {
       const item =  await ListCalendarModel.findAll()
       res.json(item)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

ListCalendarCTRL.getItem= async (req, res) => {
    try {
       const item =  await ListCalendarModel.findAll({
        where: { id: req.params.id }
       })
       res.json(item[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar registros de un usuario por dia

ListCalendarCTRL.getUserItems= async (req, res) => {
    try {
       const item =  await ListCalendarModel.findAll({
        where: {userId: req.params.id , day: req.params.day},
        include: {model: PostModel}
       })
       res.json(item)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

ListCalendarCTRL.createItems = async (req, res) => {
    try {
        await ListCalendarModel.create(req.body);
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message})
    }
}

//Actualizar un registro

ListCalendarCTRL.updateItem = async (req, res) => {
    try {
         await ListCalendarModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

ListCalendarCTRL.deleteItem = async (req , res) => {
    try {
        ListCalendarModel.destroy({
            where:{mListId: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default ListCalendarCTRL