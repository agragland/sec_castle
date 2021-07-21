const jwt = require('jsonwebtoken')

function auth (req, res, next) {
    try {
        const token = req.cookies.token
        if(!token) return res.status(401).json({errorMessage: "Unauthorized"})

        const verified = jwt.verify(token, process.env.SECRET_KEY)

        req.user = verified.user

        next()
    }
    catch (err) {
        console.error(err)
        res.status(401).json({errorMessage: "Unauthorized"})
    }

}

createJWT = (email, userId, role, duration) => {
    const payload = {
        email,
        userId,
        role,
        duration
    };


    return jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: duration,
    });
};

module.exports = {
    auth,
    createJWT
}