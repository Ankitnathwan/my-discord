const express = require('express')
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const prisma = require('../config/prisma');

router.use(authenticate);

router.get('/:channelId',
    async (req, res, next) => {
        try {
            const messages = await prisma.message.findMany({
                where: { channelId: req.params.channelId },
                orderBy: { createdAt: 'asc' },
                include: {
                    user: {
                        select: { id: true, username: true, displayName: true }
                    },
                    replyTo: {
                        include: {
                            user: {
                                select: {
                                    displayName: true,
                                    username: true,
                                }
                            }
                        }
                    },
                }
            })
            res.json(messages);
        } catch (err) {
            next(err);
        }
    }
);
module.exports = router;