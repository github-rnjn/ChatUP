const express = require("express")
const router = express.Router()
const {registerUser,authUser,allUsers} = require("../controllers/user.controller")
const { protect } = require("../middleware/auth.middleware")

router.route('/').post(registerUser)
router.route('/').get(protect,allUsers)
router.post('/login',authUser)

module.exports = router