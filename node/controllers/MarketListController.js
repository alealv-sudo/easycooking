import MarketListsModel from "../models/MarketListModel.js"

const MarketListCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
MarketListCTRL.getAllList = async (req, res) => {
    try {
       const list =  await MarketListsModel.findAll()
       res.json(list)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

MarketListCTRL.getList= async (req, res) => {
    try {
       const list =  await MarketListsModel.findAll({
        where: { id: req.params.id }
       })
       res.json(favorite[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

MarketListCTRL.createList = async (req, res) => {
    try {
        await MarketListsModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

MarketListCTRL.updateList = async (req, res) => {
    try {
         await MarketListsModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

MarketListCTRL.deleteList = async (req , res) => {
    try {
        MarketListsModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default MarketListCTRL