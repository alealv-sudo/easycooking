import PostModel from "./PostModel.js"
import FavoriteRecipeModel from "./FavoriteRecipeModel.js"
import IngredientsModel from "./IngredientsModel.js";
import RatingsModel from "./RatingsModel.js";
import ProfileModel  from "./ProfileModel.js";
import GeneralPostModel from "./GeneralPostModel.js"
import UserModel from "./UserModel.js";
import MarketListsModel from "./MarketListModel.js";
import ListItemModel from './ListitemModel.js'

/* asociación uno a muchos (post(recetas)-Ingredientes) */

PostModel.hasMany(IngredientsModel, {
    foreignKey: 'recipeId',
    sourceKey: 'id',
})

IngredientsModel.belongsTo(PostModel, {
    foreignKey: 'recipeId',
    targetKey: 'id',
})

/* asociación uno a muchos (post(recetas)-ratings) */

PostModel.hasMany(RatingsModel, {
    foreignKey: 'recipeId',
    sourceKey: 'id'
})

RatingsModel.belongsTo(PostModel, {
    foreignKey: 'recipeId',
    targetKey: 'id'
})

/* asociación uno a uno  (usuario-perfil)  */
UserModel.hasOne(ProfileModel, {
    foreignKey: 'UserModelId',
    sourceKey: 'id'
})

ProfileModel.belongsTo(UserModel ,{
    foreignKey: 'UserModelId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-generalpost) */

UserModel.hasMany(GeneralPostModel, {
    foreignKey: 'creatorId',
    sourceKey: 'id'
})

GeneralPostModel.belongsTo(UserModel, {
    foreignKey: 'creatorId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-postModel(Recetas)) */

UserModel.hasMany(PostModel, {
    foreignKey: 'creatorId',
    sourceKey: 'id'
})

PostModel.belongsTo(UserModel, {
    foreignKey: 'creatorId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-ratings) */

UserModel.hasMany(RatingsModel, {
    foreignKey: 'userId',
    sourceKey: 'id'
})

RatingsModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id'
})

/* asociación uno a muchos (usuario-favoritos) */

UserModel.hasMany(FavoriteRecipeModel, {
    foreignKey: 'userId',
    sourceKey: 'id'
})

FavoriteRecipeModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id'
})

/* asociación uno a uno  (favorito-receta)  */

PostModel.hasOne(FavoriteRecipeModel, {
    foreignKey: 'recipeId',
    sourceKey: 'id'
})

FavoriteRecipeModel.belongsTo(PostModel,{
foreignKey: 'recipeId',
sourceKey: 'id'
})

/* asociación uno a muchos (usuario-marketlist) */

UserModel.hasMany(MarketListsModel, {
    foreignKey: 'userId',
    sourceKey: 'id'
})

MarketListsModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    targetKey: 'id'
})

/* asociación uno a muchos (marketlist-listItem) */

MarketListsModel.hasMany(ListItemModel, {
    foreignKey: 'mListId',
    sourceKey: 'id'
})

ListItemModel.belongsTo(MarketListsModel, {
    foreignKey: 'mListId',
    targetKey: 'id'
})




