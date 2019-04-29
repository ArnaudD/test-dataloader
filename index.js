const Sequelize = require('sequelize');
const { createContext, EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize');

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
});

class User extends Sequelize.Model {}

User.init({
  username: Sequelize.STRING,
}, { sequelize, modelName: 'user' });

const context = createContext(sequelize);

const main = async () => {
  await sequelize.sync();

  let users = []
  for(let i=1; i<10; i++) {
    users.push({
      username: `janedoe${i}`,
    });
  }
  await User.bulkCreate(users);

  const results = await Promise.all([
    User.findByPk(1, {[EXPECTED_OPTIONS_KEY]: context}),
    User.findByPk(2, {[EXPECTED_OPTIONS_KEY]: context}),
    User.findByPk(3),
    User.findByPk(4),
  ]);

  console.log(results.map(result => result.get()))
}

main();
