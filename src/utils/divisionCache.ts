import DivisionGroup from "../models/divisionGroupModel";

let cachedDivisions: string[] | null = null;
let cachedAt = 0;
let inFlight: Promise<string[]> | null = null;

const TTL_MS = 60 * 1000; 

export const getDivisions = async (): Promise<string[]> => {
  const now = Date.now();

  if (cachedDivisions && now - cachedAt < TTL_MS) {
    return [...cachedDivisions];
  }

  if (!inFlight) {
    inFlight = DivisionGroup.distinct("division")
      .then((divisions) => {
        cachedDivisions = divisions as string[];
        cachedAt = Date.now();
        inFlight = null;
        return cachedDivisions;
      })
      .catch((err) => {
        inFlight = null;
        throw err;
      });
  }

  const result = await inFlight;
  return [...result];
};

export const invalidateDivisions = (): void => {
  cachedDivisions = null;
  cachedAt = 0;
};
