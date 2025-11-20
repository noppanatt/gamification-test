"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE "games"
      SET "dropOffDays" = NULL
      WHERE trim("dropOffDays") = '' OR "dropOffDays" !~ '^[0-9]+$';
    `);

    // Cast column
    await queryInterface.sequelize.query(`
      ALTER TABLE "games"
      ALTER COLUMN "dropOffDays" TYPE INTEGER
      USING "dropOffDays"::integer;
    `);

    // Allow null
    await queryInterface.changeColumn("games", "dropOffDays", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("games", "dropOffDays", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
