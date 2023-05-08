const { Router } = require('express');
const { Op } = require('sequelize');
const { User, Like } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/login', async (req, res) => {
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

  res.json(user.likes);
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
  res.json(user.liked);
});

router.post('/:id/likes', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  const likedUser = await User.findByPk(req.body.likedUserId);
  const like = await Like.create({
    userId: user.id,
    likedUserId: likedUser.id,
  });

  res.json(like);
});

module.exports = router;
