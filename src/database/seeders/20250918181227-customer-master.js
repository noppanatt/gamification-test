"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "customer_master",
      [
        {
          id: 1,
          segment: "HIGH_TIER_CUSTOMER",
          score: "1,4 & 2,4 & 3,4 & 4,1 & 4,2 & 4,3 & 4,4",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          segment: "MID_HIGH_TIER_CUSTOMER",
          score: "1,3 & 2,3 & 3,1 & 3,2 & 3,3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          segment: "MID_LOW_TIER_CUSTOMER",
          score: "1,2 & 2,1 & 2,2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          segment: "LOW_TIER_CUSTOMER",
          score: "1,1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          segment: "NEW_CUSTOMER",
          score: "4,1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("customer_master", null, {});
  },
};
