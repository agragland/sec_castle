const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    createJWT,
} = require('../utils/auth')

const emailRegexp =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

user_signup = (req, res, next) => {
    let { name, email, password, pass_confirm, role } = req.body;
    let errors = [];

    //user validation
    if (!name) {
        errors.push({ name: "required" });
    }
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!pass_confirm) {
        errors.push({
            password_confirmation: "required",
        });
    }
    if (password !== pass_confirm) {
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({email: email})
        .then(user => {
            if(user) {
                return res.status(422).json({ errors: [{ user: "email already exists" }] });
            }
            else {
                const user = new User({
                    name: name,
                    email: email,
                    password: password,
                    role: role
                });
                bcrypt.genSalt(10, function(err, salt) {bcrypt.hash(password, salt, function (err, hash) {
                    if(err) throw  err;
                    user.password = hash;
                    user.save()
                        .then(response => {
                            let access_token = createJWT(
                                email,
                                response._id,
                                role,
                                3600
                            )
                            res
                                .cookie("token", access_token, {
                                httpOnly: true,
                            })
                                .status(200)
                                .send()
                        })
                        .catch(err => {
                            res.status(500).json({
                                errors: [{error: err}]
                            });
                        });
                });
                });
            }
        }).catch(err => {
                res.status(500).json({
                    errors: [{error: 'Something went wrong'}]
                });
    })

}

user_signin = (req, res) => {
    let {email, password} = req.body;

    let errors = [];
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {
        errors.push({ email: "invalid email" });
    }
    if (!password) {
        errors.push({ passowrd: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }

    User.findOne({email: email})
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    errors: [{ user: "not found"}],
                })
            }
            else
            {
                bcrypt.compare(password, user.password).then(isMatch => {
                    if(!isMatch) {
                        return res.status(400).json({ errors: [{
                            password: "incorrect"
                            }]
                        })
                    }

                    let access_token = createJWT(
                        user.email,
                        user._id,
                        user.role,
                        3600
                    );
                    jwt.verify(access_token, process.env.SECRET_KEY, (err, decoded) =>{
                        if(err) {
                            res.status(500).json({errors: err})
                        }

                        if(decoded) {
                             res
                                .cookie("token", access_token, {
                                httpOnly: true,
                                })
                                .json({
                                    email: user.email,
                                    role: user.role
                                }).send()
                        }

                    })
                }).catch(err => {
                    res.status(500).json({ errors: err})
                })
            }

        }).catch(err => {
            res.status(500).json({ errors: err})
    })
}

user_signout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    })
        .send();
}

user_logged = (req, res) => {
    try {
        const token = req.cookies.token
        if(!token) return res.json({
            state: false
        })

        const decode = jwt.verify(token, process.env.SECRET_KEY)
        res.json({
            state: true,
            email: decode.email,
            role: decode.role
        })
            .send()
    }
    catch (err) {
        console.error(err)
        res.json({
            state: false
        })
    }
}

module.exports = {
    user_signup,
    user_signin,
    user_signout,
    user_logged
}