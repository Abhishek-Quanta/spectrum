const express=require('express')
const router=express.Router()
const appController=require('../controllers/appController')

// router.get("/home",appController.home_get)
router.post("/record",appController.record_post)
router.post("/record/save",appController.save_post)
router.post("/recordings",appController.recordings_post)
router.post("/delete/:id",appController.recording_delete)
router.get("/video/:id",appController.video_get)

module.exports=router