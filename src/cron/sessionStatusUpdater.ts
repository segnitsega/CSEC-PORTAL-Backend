import cron from "node-cron";
import Session, { sessionsInterface } from "../models/sessionsModel";
import { AnyBulkWriteOperation } from "mongoose";
import moment from "moment-timezone";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];

let isRunning = false;

export const startSessionStatusUpdater = () => {
  cron.schedule("* * * * *", async () => {
  if (isRunning) return;
  isRunning = true;

  try {
    const now = moment.tz("Africa/Addis_Ababa");
    const todayName = WEEKDAYS[now.day()];
    const datePrefix = now.format("YYYY-MM-DD")

    const sessions = await Session.find().lean();
    const bulkOps: AnyBulkWriteOperation<sessionsInterface>[] = [];

    for (const session of sessions) {
      let updatedStatus: sessionsInterface["status"] = session.status;
      let slotFound = false;

      for (const slot of session.sessions) {
        if (slot.day !== todayName){
          continue
        }
      slotFound = true;
      const startToday = moment.tz(`${datePrefix} ${slot.startTime}`,
          "YYYY-MM-DD h:mm A",
          "Africa/Addis_Ababa"
      )
      const endToday = moment.tz(
          `${datePrefix} ${slot.endTime}`,
          "YYYY-MM-DD h:mm A",
          "Africa/Addis_Ababa"
      );

        if (now.isBefore(startToday)) {
          updatedStatus = "planned";
        }
        else if (now.isBetween(startToday, startToday.clone().add(15, "minutes"))) {
          updatedStatus = "started";
        }
        else if (now.isBetween(startToday.clone().add(15, "minutes"), endToday)) {
          updatedStatus = "on-going";
        }
        else if (now.isAfter(endToday)) {
          updatedStatus = "ended";
        }
        else {
          updatedStatus = session.status;
        }
        break;
      }

      if (!slotFound) {
        const startOverall = moment(session.startDate, "YY/MM/DD", "Africa/Addis_Ababa");
        const endOverall   = moment(session.endDate, "YY/MM/DD", "Africa/Addis_Ababa");
        if (now.isBefore(startOverall)) {
          updatedStatus = "planned";
        }
        else if (now.isAfter(endOverall)) {
          updatedStatus = "ended";
        }
      }

      if (session.status !== updatedStatus) {
        bulkOps.push({
          updateOne: {
            filter: { _id: session._id },
            update: { $set: { status: updatedStatus } },
          },
        });
      }
    }

    if (bulkOps.length) {
      await Session.bulkWrite(bulkOps);
    }

    console.log(`Session statuses updated at: ${now.format("hh:mm A")} (${bulkOps.length} changed)`);
  } catch (error) {
    console.error("Session status updater failed:", error);
  } finally {
    isRunning = false;
  }
  });
};
