const express = require('express');
const {body, validationResult} = require('express-validator');
const {authenticate} = require('../middleware/authenticate');
const prisma = require('../config/prisma');

const router = express.Router()
router.use(authenticate)

router.post('/',
    [
        body('name').isLength({min:3, max:32}).trim(),
        body('description').optional().isLength({min:3, max:500}).trim(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const {name,description} = req.body

        const server = await prisma.server.create({
            data: {name, description, ownerId: req.user.id},
        })
        res.status(201).json(server);
    }
)

router.get('/', async (req, res, next) =>{
    try{
        const servers = await prisma.server.findMany({
        where: { ownerId: req.user.id },
        include: { channels: true }
    })
    res.json(servers);
    }catch(err){
        next(err);
    }
    
}
)

router.get('/:id', async(req, res, next) => {
    try{
        const server = await prisma.server.findFirst({
           where:{
            id: req.params.id,
            ownerId: req.user.id
           } 
        })
        if (!server) return res.status(404).json({ error: 'Server not found' })
        res.json(server);
    }catch(err){
        next(err)
    }
})

router.delete('/:id', async(req, res, next) => {
    try{
        const server = await prisma.server.findUnique({where: {id: req.params.id}});
        if (!server) return res.status(404).json({ error: 'Server not found' })
        if (server.ownerId !== req.user.id) return res.status(403).json({error: 'Forbidden: Not the owner'});
        
        await prisma.server.delete({where: {id: req.params.id}});
        res.json({message: 'Server deleted' });
    }catch(err){
        next(err)
    }
})

router.post('/join/:inviteCode', async(req, res, next) => {
    try{
        const server = await prisma.server.findUnique({
            where: {
                inviteCode: req.params.inviteCode
            }
        })
        if(!server) return res.status(404).json({error: 'Server not found'})
        const existing = await prisma.serverMember.findUnique({
            where: {
                userId_serverId: {
                    userId: req.user.id, 
                    serverId: server.id
                }
            }
        })
        if(existing) return res.status(404).json({error: 'Already Joined'})
        await prisma.serverMember.create({
            data: {userId:req.user.id, serverId:server.id },
        });

        res.json({ message: 'Server Joined', serverId: server.id });
    }catch(err){
        next(err)
    }
})

module.exports = router