const express=require('express')
const router=express.Router()
const {addAddress,fetchAllAddress,deleteAddress,editAddress}=require('../controllers/Address')
router.post('/add',addAddress)
router.get('/get/:userId',fetchAllAddress)
router.put('/update/:userId/:addressId',editAddress)
router.delete('/delete/:userId/:addressId',deleteAddress)
module.exports=router 