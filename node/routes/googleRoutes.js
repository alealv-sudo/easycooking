import express from "express"
const router = express.Router()

import google_Ctrl  from '../middlewares/google.js'

//CRUD
//CREATE - READ - UPDATE - DELETE
router.get('/', google_Ctrl.getFiles);
router.get('/files/:id', google_Ctrl.getFileByID);
router.get('/download/:id', google_Ctrl.getDownload);
router.post('/upload', google_Ctrl.uploadFile);
router.get('/folder', google_Ctrl.addFolder);
router.delete('/delete', google_Ctrl.deleteFile);

export default router