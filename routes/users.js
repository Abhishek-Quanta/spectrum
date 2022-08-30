const express=require('express')
const router=express.Router()
const userController=require('../controllers/userController')

router.post('/register',userController.register_post)
router.post('/login',userController.login_post)
router.get('/logout',userController.logout)

module.exports=router