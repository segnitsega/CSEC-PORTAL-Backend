import cron from "node-cron";
import Event, { eventsInterface } from "../models/eventsModel";
import { AnyBulkWriteOperation } from "mongoose";
import moment from "moment-timezone";

let isRunning = false;

export const startEventStatusUpdater = () => {
  cron.schedule("* * * * *", async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = moment.tz("Africa/Addis_Ababa");
    const dateToday = now.format("YYYY-MM-DD");

    const events = await Event.find({
      $or: [
        { eventDate: { $gte: dateToday } },
        { status: { $ne: "ended" } },
      ],
    }).lean();

    const bulkOps: AnyBulkWriteOperation<eventsInterface>[] = [];

    for (const event of events) {
      let updatedStatus = event.status;

      const fullStart = moment.tz(`${event.eventDate} ${event.startTime}`, "YYYY-MM-DD h:mm A", "Africa/Addis_Ababa");
      const fullEnd   = moment.tz(`${event.eventDate} ${event.endTime}`, "YYYY-MM-DD h:mm A", "Africa/Addis_Ababa");

      if (!fullStart.isValid() || !fullEnd.isValid()) continue;

      if (now.isBefore(fullStart)) {
        updatedStatus = "planned";
      } else if (now.isBetween(fullStart, fullStart.clone().add(15, "minutes"))) {
        updatedStatus = "started";
      } else if (now.isBetween(fullStart.clone().add(15, "minutes"), fullEnd)) {
        updatedStatus = "on-going";
      } else if (now.isAfter(fullEnd)) {
        updatedStatus = "ended";
      }

      if (event.status !== updatedStatus) {
        bulkOps.push({
          updateOne: {
            filter: { _id: event._id },
            update: { $set: { status: updatedStatus } },
          },
        });
      }
    }

    if (bulkOps.length) {
      await Event.bulkWrite(bulkOps);
    }

    console.log(`Event statuses updated at: ${now.format("hh:mm A")} (${bulkOps.length} changed)`);
  } catch (error) {
    console.error("Event status updater failed:", error);
  } finally {
    isRunning = false;
  }
  });
};
