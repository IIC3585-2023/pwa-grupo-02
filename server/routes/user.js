const { Router } = require('express');
const { Op } = require('sequelize');
const { User, Like, Message } = require('../models');
const admin = require('../firebase');

function sendNotification(user, message) {
  const registrationToken = user.token;

  if (!registrationToken) {
    return;
  }

  const payload = {
    notification: {
      title: message.title,
      body: message.body,
    },
    token: registrationToken,
  };

  admin.messaging().send(payload)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

function checkMatch(user1, user2) {
  console.log('Checking match');
  console.log(user1.likes);
  console.log(user2.likes);
  const user1LikedUser2 = user1.likes.find((like) => like.likedUserId === user2.id);
  const user2LikedUser1 = user2.likes.find((like) => like.likedUserId === user1.id);

  if (!user1LikedUser2 || !user2LikedUser1) {
    return;
  }
  const message = {
    title: 'New match!',
    body: 'You have a new match 😍',
  };

  sendNotification(user1, message);
  sendNotification(user2, message);
}

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
  const likedUserIds = await Like.findAll({
    where: {
      userId: req.params.id,
    },
    attributes: ['likedUserId'],
  });

  const users = await User.findAll({
    where: { id: { [Op.not]: req.params.id } },
  });

  const filteredUsers = users.filter(
    (user) => !likedUserIds.find((like) => like.likedUserId === user.id),
  );

  res.json(filteredUsers);
});

router.post('/:id/token', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.token = req.body.token;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.json({ error: 'Something went wrong' });
  }
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
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          association: 'likes',
        }],
    });
    const likedUser = await User.findByPk(req.body.likedUserId, {
      include: [
        {
          association: 'likes',
        }],
    });
    const like = await Like.create({
      userId: user.id,
      likedUserId: likedUser.id,
      isRejection: req.body.isRejection,
    });
    checkMatch(user, likedUser);

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

    const user = await User.findByPk(req.params.userId);
    const messagePayload = {
      title: 'New message! 💌',
      body: `${user.firstName}: ${message.message}`,
      icon: 'https://firebasestorage.googleapis.com/v0/b/tarea-4-pwa.appspot.com/o/tinder.svg?alt=media&token=1061def6-9a2d-41f7-af3d-f9c6af54f7b1',
    };
    sendNotification(user, messagePayload);

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
        isRejection: false,
      },
    });

    const liked = await Like.findAll({
      where: {
        userId: req.params.id,
        isRejection: false,
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
