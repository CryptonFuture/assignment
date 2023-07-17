const express = require('express')
const { addUser, getUser, deleteUser, singleUser, updateUser, loginUser, countUser } = require('../controllers/user')
const { Authorization } = require('../middleware/authorization')

const router = express.Router()

router.route('/users').get(getUser)
router.route('/users').post(Authorization, addUser)
router.route('/users/:id').get(singleUser)
router.route('/users/:id').put(Authorization, updateUser)
router.route('/users/:id').delete(Authorization, deleteUser)
router.route('/login').post(loginUser)
router.route('/countUser').get(countUser)

module.exports = router