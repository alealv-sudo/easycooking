import  db  from "../database/db.js";

import { DataTypes } from "sequelize";

const ProfileModel = db.define('profiles',{
    
    name: {type: DataTypes.STRING},
    lastName: {type: DataTypes.STRING},
    biografia: {type: DataTypes.STRING},
    ubicacion: {type: DataTypes.STRING},
    contacto: {type: DataTypes.STRING},
    sitioWeb: {type: DataTypes.STRING},
    fechaDeNacimiento: {type: DataTypes.STRING},

    idPictureProfile: {type: DataTypes.STRING, defaultValue: '1'},
    idPictureBackground: {type: DataTypes.STRING, defaultValue: '1'},
})

export default ProfileModel
