const express = require('express');
const {body, validationResult} = require('express-validator');
const {authenticate} = require('../middleware/authenticate');
const prisma = require('../config/prisma');

const router = express.Router();
router.use(authenticate);

//checking user is server owner
const requireOwner = async(userId, serverId) => {
    const server = await prisma.server.findUnique({where: {id: serverId}})
    return server?.ownerId === userId;
}
//check user is member of server
const requireMember = async (userId, serverId) => {
  const member = await prisma.serverMember.findUnique({
    where: { userId_serverId: { userId, serverId } },
  });
  return !!member;
};


router.post('/',
    [
        body('name').isLength({min:3, max:32}).trim(),
        body('type').optional().isIn(['TEXT', 'VOICE', 'ANNOUNCEMENT']),
        body('topic').optional().isLength({min:3, max:1000}).trim(),
        body('serverId').notEmpty()
    ],
    async(req, res, next) => {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()})
            }
            const  {name, serverId, type = 'TEXT', topic} = req.body;
            if(!(await requireOwner(req.user.id, serverId))){
                return res.status(403).json({error: 'Only the server owner can create the server'})
            }

            const channel = await prisma.channel.create({
                data: {
                    name, serverId, type, topic
                }
            })
            res.status(201).json(channel);

        }catch(err){
            next(err);
        }  
    }
)

// GET /api/channels/:id - get channel details
router.get('/:id',
    async(req, res, next) => {
        try{
            const channel = await prisma.channel.findUnique({
                where: {id: req.params.id},
                include: {server:true}
            });
            if (!channel) return res.status(404).json({ error: 'Channel not found' });
            if (!(await requireMember(req.user.id, channel.serverId))) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            res.json(channel);
        }catch(err){
            next(err);
        }
    }
);

// DELETE /api/channels/:id - delete channel (owner only)
router.delete('/:id', async (req, res, next) => {
  try{
    const channel = await prisma.channel.findUnique({where: {id: req.params.id }});
    if (!channel) return res.status(404).json({error: 'Channel not found' });

    if (!(await requireOwner(req.user.id, channel.serverId))){
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.channel.delete({where: {id: req.params.id }});
    res.json({message: 'Channel deleted' });
  }catch (err){
    next(err);
  }
});

module.exports = router;