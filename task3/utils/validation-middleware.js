const { validator } = require("../utils/helper/validate");

const signupCreateMiddleware = async (req, res, next) => {
    const validationRule = {
        username: "required|string",
        email: "require|string|email",
        password: "required|string|min:6",
        cPassword: "required|string|min:6",

    };

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(404).send({
                success: false,
                message: "Validation failed",
                data: err,
            });
        } else {
            next();
        }
    }).catch((err) => console.log(err));
};

module.exports = {
    signupCreateMiddleware,
};
