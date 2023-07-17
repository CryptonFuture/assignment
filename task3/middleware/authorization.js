const User = require("../models/user")
const jwt = require('jsonwebtoken')

const secret_key = process.env.SECRET_KEY

const Authorization = (req, res, next) => {
    try {
        if (!req.headers.authtoken ||
            !req.headers.authtoken.startsWith("Bearer") ||
            !req.headers.authtoken.split(" ")[1]
        ) {
            return res.status(404).json({
                status: false,
                message: "please login first"
            })
        } else {
            const authtoken = req.headers.authtoken.split(" ")[1]
            jwt.verify(authtoken, secret_key, function (error, payload) {
                if (error) {
                    return res.status(404).json({
                        status: false,
                        message: "please login first",
                    });
                } else {
                    let { _id } = payload
                    User.findById({ _id })
                        .then(userData => {
                            req.user = userData
                            next()
                        })

                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "internal server error 500",
        });
    }
}


module.exports = {
    Authorization,
}