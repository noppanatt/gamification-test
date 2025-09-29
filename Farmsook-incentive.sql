CREATE TABLE "app" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "coins" int,
  "referenceId" uuid,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date,
  "appMasterId" int
);

CREATE TABLE "rule_books" (
  "id" uuid PRIMARY KEY,
  "fileName" varchar,
  "active" boolean,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date,
  "appMasterId" int
);

CREATE TABLE "games" (
  "id" uuid PRIMARY KEY,
  "gameId" varchar,
  "gameMasterDataId" varchar,
  "customerMasterDataId" int,
  "version" varchar,
  "trafficPercentage" double,
  "page" varchar,
  "durationDays" int,
  "point" int,
  "rewardIds" varchar,
  "dropOffDays" varchar,
  "pushMessage" varchar,
  "timeToPush" Date,
  "startDate" Date,
  "endDate" Date,
  "active" boolean,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date,
  "ruleBookId" uuid,
  "appMasterId" int
);

CREATE TABLE "rewards" (
  "id" uuid PRIMARY KEY,
  "rewardId" varchar,
  "name" varchar,
  "point" int,
  "description" varchar,
  "active" boolean,
  "isDraft" boolean,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date
);

CREATE TABLE "rewardFiles" (
  "id" uuid PRIMARY KEY,
  "fileOriginalName" varchar,
  "createdAt" Date,
  "updatedAt" Date,
  "deletedAt" Date,
  "rewardId" uuid
);

ALTER TABLE "users" ADD FOREIGN KEY ("appMasterId") REFERENCES "app" ("id");

ALTER TABLE "rule_books" ADD FOREIGN KEY ("appMasterId") REFERENCES "app" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("ruleBookId") REFERENCES "rule_books" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("appMasterId") REFERENCES "app" ("id");

ALTER TABLE "rewardFiles" ADD FOREIGN KEY ("rewardId") REFERENCES "rewards" ("id");
