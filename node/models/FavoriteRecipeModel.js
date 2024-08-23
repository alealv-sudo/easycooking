//importa la conexion a la db 
import db from "../database/db.js";
import { DataTypes } from "sequelize";

const FavoriteRecipeModel = db.define('favorites', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  tableName: 'favorites',
  timestamps: false,
});

export default FavoriteRecipeModel;
