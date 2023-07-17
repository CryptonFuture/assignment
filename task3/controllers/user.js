const User = require("../models/user")
const bcrypt = require('bcryptjs')

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(404).json({ status: false, message: 'please fill out al fields' })
        } else {
            const userValid = await User.findOne({ email: email })

            if (userValid) {
                const isMatch = await bcrypt.compare(password, userValid.password)
                if (!isMatch) {
                    res.status(404).json({ status: false, message: "invalid details" })

                } else {
                    const token = await userValid.generateAuthToken()

                    const result = {
                        userValid,
                        token
                    }
                    res.status(201).json({ status: true, result, message: 'login successfully' })
                }
            }
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const addUser = async (req, res) => {
    try {
        const { username, email, password, cPassword } = req.body

        if (!username || !email || !password || !cPassword) {
            res.status(404).json({ status: false, message: 'please fill out al fields' })
        } else {
            const userEmail = await User.findOne({ email: email })
            if (userEmail) {
                res.status(404).json({ status: false, message: 'email already exists' })

            } else if (password !== cPassword) {
                res.status(404).json({ success: false, message: "Password does'nt match" })
            } else {
                const users = new User({
                    username,
                    email,
                    password,
                    cPassword
                })
                await users.save()

                res.status(201).json({ status: true, message: 'register successfully' })
            }
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const getUser = async (req, res) => {
    const username = req.query.username || ""
    const email = req.query.email || ""
    const page = req.query.page || 1

    const Item_per_page = 4

    const query = {
        username: { $regex: username, $options: "i" },
        email: { $regex: email, $options: "i" }
    }

    try {

        const skip = (page - 1) * Item_per_page

        const count = await User.countDocuments(query)

        const userData = await User.find(query)
            .limit(Item_per_page)
            .skip(skip)

        const totalCountUser = await User.count(query)

        const pageCount = Math.ceil(count / Item_per_page)

        if (userData.length) {
            res.status(201).json({
                status: true, Pagination: {
                    count, pageCount
                }, userData, totalCountUser
            })
        } else {
            res.status(404).json({
                status: false, message: 'no result found'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const countUser = async (req, res) => {
    try {
        const totalUser = await User.count()
        res.status(201).json({ totalUser })
    } catch (error) {
        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const singleUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await User.findById({ _id: id })
        if (!userData) {
            res.status(404).json({ status: false, message: `no user found given by id: ${id}` })
        }
        res.status(201).json({ status: true, userData })
    } catch (error) {
        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await User.findByIdAndDelete({ _id: id })
        if (!userData) {
            res.status(404).json({ status: false, message: `no user found given by id: ${id}` })
        }
        res.status(204).json({ status: true, message: 'delete data successfully' })

    } catch (error) {
        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { username, email } = req.body

        if (!username || !email) {
            res.status(404).json({ status: false, message: 'please fill out al fields' })
        } else {

            const userData = await User.findByIdAndUpdate({ _id: id }, { username, email }, { new: true })
            if (!userData) {
                res.status(404).json({ status: false, message: `no user found given by id: ${id}` })
            }
            await userData?.save()

            res.status(201).json({ status: true, message: 'update data successfully' })
        }

    } catch (error) {
        res.status(500).json({ status: false, message: 'internal server error 500' })

    }
}

module.exports = {
    addUser,
    getUser,
    deleteUser,
    singleUser,
    updateUser,
    loginUser,
    countUser
}
