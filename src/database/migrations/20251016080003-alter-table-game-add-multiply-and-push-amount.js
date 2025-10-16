"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("games", "multiply", {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("games", "pushAmount", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("games", "pushAmount");
    await queryInterface.removeColumn("games", "multiply");
  },
};
