import FollowedModels from "../models/FollowedModel.js"
import FollowerModels from "../models/FollowerModel.js"
import UserModel from "../models/UserModel.js" 

const FollowedCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
FollowedCTRL.getAllFolloweds = async (req, res) => {
    try {
       const followed =  await FollowedModels.findAll()
       res.json(followed)
    } catch (error) {
       res.json({message: error.message}) 
    }
}
//followed paginados de los otros usuarios

FollowedCTRL.getOterUserFollowedPaginated = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const userId = req.query.userId; // Get the userId from query parameters
        const userCurrent = req.query.userCurrent;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const followed = await FollowedModels.findAll({
            where: {
                userId: userId
            },
            include: { model: UserModel},
            offset: offset,
            limit: limit
        });

        // Find the total number of posts
        const totalfollowed = await FollowedModels.count({
            where: {
                userId: userId
        }});

         // Add isFollow field to each post
         const postsWithFollows = await Promise.all(followed.map(async follow => {
            const isFollow = await FollowedModels.findOne({
                where: {
                    userId: userCurrent,
                    followedId: follow.followedId
                }
            });

            return {
                ...follow.toJSON(), // Convert the post instance to a plain object
                isFollow: !!isFollow // Convert to boolean
            };
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalfollowed / limit),
            totalPosts: totalfollowed,
            posts: postsWithFollows
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

//followed paginados

FollowedCTRL.getFollowedPaginated = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const userId = req.query.userId; // Get the userId from query parameters

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const followed = await FollowedModels.findAll({
            where: {
                userId: userId
            },
            include: { model: UserModel},
            offset: offset,
            limit: limit
        });

        // Find the total number of posts
        const totalfollowed = await FollowedModels.count();

         // Add isFollow field to each post
         const postsWithFollows = await Promise.all(followed.map(async follow => {
            const isFollow = await FollowedModels.findOne({
                where: {
                    userId: userId,
                    followedId: follow.followedId
                }
            });

            return {
                ...follow.toJSON(), // Convert the post instance to a plain object
                isFollow: !!isFollow // Convert to boolean
            };
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalfollowed / limit),
            totalPosts: totalfollowed,
            posts: postsWithFollows
        });
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

//Mostrart un registro 

FollowedCTRL.getFollowed = async (req, res) => {
    try {
       const followed =  await FollowedModels.findAll({
        where: { id: req.params.id }
       })
       res.json(followed[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//mostrar si el repectivo usuario es seguido

FollowedCTRL.isFollowed = async (req, res) => {

    try {
        const followed =  await FollowedModels.findOne({
         where: { userId: req.query.id, followedId: req.query.followedId}
        })

        res.json({
            data: followed,
            isFollowed: !!followed
        })
     } catch (error) {
        res.json({message: error.message}) 
     } 
}

//Crear un registro

FollowedCTRL.createFollowed = async (req, res) => {

    try {
        const followed = new FollowedModels(req.body);
        await followed.save();

        const follower = {
            userId: req.body.followedId,
            followerId: req.body.userId,
        }
        
        await FollowerModels.create(follower);
        res.json(followed)
        
    } catch (error) {
        res.json({message: error.message}) 
    }

}

//Actualizar un registro

FollowedCTRL.updateFollowed = async (req, res) => {
    try {
         await FollowedModels.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

FollowedCTRL.deleteFollowed = async (req , res) => {
    try {

        const follow = await FollowedModels.findOne({
            where: {
                id: req.params.id
            }
        })

        FollowedModels.destroy({
            where:{id: req.params.id}
        })

        FollowerModels.destroy({
            where: {
                userId: follow.followedId, 
                followerId: follow.userId,
            }
        })

        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default FollowedCTRL