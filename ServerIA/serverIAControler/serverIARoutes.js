import express from "express"
import serverIACTRL from './serverIAcontroler.js'

const routes = express.Router()

routes.get('/:id', serverIACTRL.factorial)
/* followerRoutes.post('/', followsCTRL.createBlog)
followerRoutes.put('/:id', followsCTRL.updateBlog)
followerRoutes.delete('/:id', followsCTRL.deleteBlog) */

export default routes