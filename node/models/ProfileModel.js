import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const ProfileModel = db.define('profile',{
    
    name: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    biografia: {type: DataTypes.STRING},
    ubicacion: {type: DataTypes.STRING},
    contacto: {type: DataTypes.STRING},
    sitioWeb: {type: DataTypes.STRING},
    fechaDeNacimiento: {type: DataTypes.DATE},

    idPictureProfile: {type: DataTypes.STRING},
    idPictureBackground: {type: DataTypes.STRING},
})

export default ProfileModel
