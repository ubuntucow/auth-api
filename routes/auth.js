const router = require("express").Router()
const User = require("../model/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { registerValidation, loginValidation } = require("../validation")

router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).send("Email is taken")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save()
        res.send({ user: user._id })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email not found")
    const isValidPassword = await bcrypt.compare(req.body.password, user.password)
    if (!isValidPassword) return res.status(403).send("Wrong password")
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "24h" })
    res.header("auth-token", token).send(token)
})

router.post("/logout", async (req, res) => {
    res.header("auth-token", "")
})
module.exports = router;