/* eslint-disable no-console */
const app = require('./app');
const orm = require('./models/index.js');

(async () => {
  orm.sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });

  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
})();
