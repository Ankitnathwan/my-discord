const express = require('express')
const bcrypt = require('bcryptjs')
const {body, validationResult} = require('express-validator')
const prisma = require('../config/prisma')
const {generateAccessToken, generateRefreshToken} = require('../config/jwt')
const {authenticate} = require('../middleware/authenticate')

const router = express.Router();

// POST /api/auth/register
router.post('/register', 
    [
        body('email').isEmail().normalizeEmail(),
        body('username').isLength({min:3, max:32}),
        body('displayName').isLength({min:1, max:50}).trim(),
        body('password').isLength({min: 8}),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, username, displayName, password } = req.body
        const passwordHash = await bcrypt.hash(password,12)

        const user = await prisma.user.create({
            data: {email, username, displayName, passwordHash },
            select: {id: true, email: true, username: true, displayName: true}
        })

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        res.status(201).json({ user, accessToken, refreshToken })
    }
)

router.post('/login',
    [
        body('login').notEmpty(),
        body('password').notEmpty(),
    ],
    async (req,res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {login,password} = req.body
 
        const user = await prisma.user.findFirst({
            where: {
                OR: [{email: login}, {username: login}]
            }
        })

        if(!user){
            return res.status(401).json({error: 'Invalid Credentials'})
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if(!valid){
            return res.status(401).json({error: 'Invalid Credentials'})
        }

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        const {passwordHash, ...safeUser} = user
        res.json({user: safeUser, accessToken, refreshToken})
    }
)

router.get('/me', authenticate, (req,res) => {
    res.json({user: req.user})
})

module.exports = router