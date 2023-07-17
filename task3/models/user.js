const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const secret_key = process.env.SECRET_KEY

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please enter your name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters']
    },

    email: {
        type: String,
        required: [true, 'please enter your email'],
        unique: true,
        validate: [validator.isEmail, "please enter a valid email"]
    },

    password: {
        type: String,
        required: true,
        minLength: [6, 'Password should have more than 6 characters']
    },

    cPassword: {
        type: String,
        required: true,
        minLength: [6, 'Password should have more than 6 characters']
    },

    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },

    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

}, {
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 12)
    this.cPassword = await bcrypt.hash(this.cPassword, 12)
})

UserSchema.methods.generateAuthToken = async function () {
    try {
        let tokened = jwt.sign({ _id: this._id }, secret_key, {
            expiresIn: "24h"
        })

        this.tokens = this.tokens.concat({ token: tokened })
        await this.save()
        return tokened
    } catch (error) {
        console.log(error);

    }
}

module.exports = mongoose.model('User', UserSchema)