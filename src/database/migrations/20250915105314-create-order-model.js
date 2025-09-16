// migrations/20250915-create-orders.js
"use strict";
const { orderColumns } = require("../sequelize/order");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", orderColumns);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Orders");
  },
};
