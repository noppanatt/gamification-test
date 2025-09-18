"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */

const ruleBookId = "d83eeb78-7864-4405-b162-6f25849dbe8d";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        "rule_books",
        [
          {
            id: ruleBookId,
            fileName: "Game file V.1",
            active: false,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await queryInterface.bulkInsert(
        "games",
        [
          {
            id: uuidv4(),
            gameId: 1,
            gameMasterDataId: "GM01",
            customerMasterDataId: 5,
            version: null,
            trafficPercentage: null,
            page: "Log in",
            durationDays: 1,
            point: 10,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 2,
            gameMasterDataId: "GM02",
            customerMasterDataId: 5,
            version: null,
            trafficPercentage: null,
            page: "Home",
            durationDays: 1,
            point: 50,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 3,
            gameMasterDataId: "GM03",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Daily log",
            durationDays: 1,
            point: 10,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 4,
            gameMasterDataId: "GM04",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Daily log",
            durationDays: 1,
            point: 15,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 5,
            gameMasterDataId: "GM05",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Daily log",
            durationDays: 7,
            point: 10,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 6,
            gameMasterDataId: "GM06",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Daily log",
            durationDays: 14,
            point: 20,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 7,
            gameMasterDataId: "GM07",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Daily log",
            durationDays: 21,
            point: 30,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
          {
            id: uuidv4(),
            gameId: 8,
            gameMasterDataId: "GM08",
            customerMasterDataId: null,
            version: null,
            trafficPercentage: null,
            page: "Manage house",
            durationDays: null,
            point: 50,
            rewardIds: "1,2,3,4,5,6,7",
            dropOffDays: null,
            pushMessage: null,
            timeToPush: null,
            startDate: new Date("08/25/2025"),
            endDate: new Date("09/15/2025"),
            active: true,
            appMasterId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            ruleBookId,
          },
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("games", { ruleBookId }, { transaction });
      await queryInterface.bulkDelete(
        "rule_books",
        { id: ruleBookId },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
