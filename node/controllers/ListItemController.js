import ListItemModel from "../models/ListitemModel.js";

const listItemCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
listItemCTRL.getAllItems = async (req, res) => {
    try {
       const item =  await ListItemModel.findAll()
       res.json(item)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

listItemCTRL.getItems= async (req, res) => {
    try {
       
       const item =  await ListItemModel.findAll({
        where: { id: req.params.id }
       })
       res.json(item[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

listItemCTRL.createItems = async (req, res) => {
    console.log("lo logro", req);
    try {
        await ListItemModel.bulkCreate(req.body);
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        console.log("error", error);
        res.json({message: error.message})
    }
}

//Actualizar un registro

listItemCTRL.updateItem = async (req, res) => {
    try {
         await ListItemModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

listItemCTRL.deleteItem = async (req , res) => {
    try {
        ListItemModel.destroy({
            where:{mListId: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default listItemCTRL