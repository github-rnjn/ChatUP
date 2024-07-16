const express = require("express")
const { protect } = require("../middleware/auth.middleware")
const { sendMessage, allMessages } = require("../controllers/message.controller")
const router = express.Router()

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)

module.exports = router