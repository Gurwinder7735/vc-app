'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'isOnline', {
      type: Sequelize.BOOLEAN,
      allowNull: true // Making isOnline field optional (nullable)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'isOnline', {
      type: Sequelize.BOOLEAN,
      allowNull: false // Reverting to not nullable (if needed)
    });
  }
};
