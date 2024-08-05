import MarketListsModel from "../models/MarketListModel.js"
import ListItemModel from "../models/ListitemModel.js"

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
        where: { id: req.params.id },
        include: {
            model: ListItemModel,
            attributes: {exclude: ['mListId']}
        },
        order:[[{model: ListItemModel },'id', 'ASC']],
       })
       res.json(list[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar los registros de un usuario

MarketListCTRL.getListsUser= async (req, res) => {
    try {
       const list =  await MarketListsModel.findAll({
        where: { userId: req.params.id }
       })
       res.json(list)
    } catch (error) {
       res.json({message: error.message}) 
    }
}


//Crear un registro

MarketListCTRL.createList = async (req, res) => {
    try {
        const list = new MarketListsModel(req.body);
        await list.save();
        res.json(list)
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

MarketListCTRL.updateList = async (req, res) => {
    try {
         await MarketListsModel.update(req.body, {
            where: { id: req.body.id }
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