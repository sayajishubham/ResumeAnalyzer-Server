const user = require("../model/user.model");

const userController = {
    SignIn: async (req, res) => {
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({
                message: "please fill all the fields"
            })
        }
        try {
            const existingUser = await user.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    message: "you have account",
                    user: existingUser
                });
            }
            let newUser = await user.create({
                username,
                email
            })
            return res.status(201).json({
                message: "User created successfully",
                user: newUser
            });


        } catch (error) {
            return res.status(500).json({
                message: `${error} while creating the user`
            })
        }

    },
}

module.exports = userController