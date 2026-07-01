const {verifyAccessToken} = require('../config/jwt')
const prisma = require('../config/prisma')

const authenticate = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith('Bearer ')){
            return res.status(401).json({error: 'No Token Provided'})
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
            select: {id: true, email: true, username: true, displayName: true },
        });
        if(!user){
            return res.status(401).json({error: 'User Not Found'});
        }

        req.user = user;
        next();
    }catch(err){
        if (err.name === 'TokenExpiredError'){
            return res.status(401).json({ error: 'Token expired'});
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}
module.exports = {authenticate};