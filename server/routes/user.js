const { Router } = require('express');
const { Op } = require('sequelize');
const { User, Like, Message } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: 'Something went wrong' });
  }
});

router.get('/:id/people', async (req, res) => {
  const users = await User.findAll({
    where: { id: { [Op.not]: req.params.id } },
  });

  res.json(users);
});

router.get('/:id/likes', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        association: 'likes',
        include: [
          {
            model: User,
          },
        ],
      },
    ],
  });
  if (user) {
    res.json(user.likes);
    return;
  }
  res.status(404).json({ error: 'User not found' });
});

router.get('/:id/liked', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        association: 'liked',
        include: [
          {
            model: User,
          },
        ],
      },
    ],
  });
  if (user) {
    res.json(user.liked);
    return;
  }
  res.status(404).json({ error: 'User not found' });
});

router.post('/:id/likes', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const likedUser = await User.findByPk(req.body.likedUserId);
    const like = await Like.create({
      userId: user.id,
      likedUserId: likedUser.id,
    });

    res.json(like);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: 'Something went wrong' });
  }
});

router.get('/:id/messages/:userId', async (req, res) => {
  const messagesSent = await Message.findAll({
    where: {
      userId: req.params.id,
      receiverUserId: req.params.userId,
    },
  });

  const messagesReceived = await Message.findAll({
    where: {
      userId: req.params.userId,
      receiverUserId: req.params.id,
    },
  });

  const messages = messagesSent.concat(messagesReceived);
  messages.sort((a, b) => a.createdAt - b.createdAt);

  res.json(messages);
});

router.post('/:id/messages/:userId', async (req, res) => {
  try {
    const message = await Message.create({
      userId: req.params.id,
      receiverUserId: req.params.userId,
      message: req.body.message,
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: 'Something went wrong' });
  }
});

router.get('/:id/matches', async (req, res) => {
  try {
    const likes = await Like.findAll({
      where: {
        likedUserId: req.params.id,
      },
    });

    const liked = await Like.findAll({
      where: {
        userId: req.params.id,
      },
    });

    const matches = likes.filter((like) => {
      const likedUser = liked.find((l) => l.likedUserId === like.userId);
      return likedUser;
    });

    const users = await Promise.all(
      matches.map(async (match) => {
        const user = await User.findByPk(match.userId);
        return user;
      }),
    );

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: 'Something went wrong' });
  }
});

module.exports = router;
