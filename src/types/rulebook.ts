// types/rulebook.ts
export type GameRuleDTO = {
  gameId: number;
  gameMasterDataId: string;
  customerMasterDataId: number | null;
  version: string | null; // e.g. "A" | "B" | "C" | null
  trafficPercentage: number | null; // e.g. 45
  page: string; // e.g. "Daily log"
  durationDays: number | null; // e.g. 1
  point: number | null; // e.g. 10
  rewardId: string; // CSV string: "1,2,3,4,5,6,7"
  dropOffDays: number | null; // can be fractional (e.g. 0.5)
  pushMessage: string | null;
  timeToPush: string | null; // if you'll send ISO strings later
  pushAmount: number | null;
  startDate: string | null; // keep as string | null (e.g. "9/5/2025")
  endDate: string | null;
  active: boolean | null; // some rows have null
};

export type CreateGameRuleBody = {
  data: GameRuleDTO[];
};
