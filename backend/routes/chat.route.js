const express = require("express")
const router = express.Router()

const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup} = require("../controllers/chat.controller")
const { protect } = require("../middleware/auth.middleware")

router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChats)
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/groupremove").put(protect,removeFromGroup)
router.route("/groupadd").put(protect,addToGroup)

module.exports = router