"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("rewards", "description", {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn("rewards", "termsAndCondition", {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {},
};
