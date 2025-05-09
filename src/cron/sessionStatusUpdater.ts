import cron from "node-cron";
import Session, { sessionsInterface } from "../models/sessionsModel";
import moment from "moment-timezone";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];

cron.schedule("* * * * *", async () => {
  const now = moment.tz("Africa/Addis_Ababa");
  const todayName = WEEKDAYS[now.day()];

  const sessions = await Session.find();
  for (const session of sessions) {
    let updatedStatus: sessionsInterface["status"] = session.status;
    let slotFound = false;

    for (const slot of session.sessions) {
      if (slot.day !== todayName){
        continue
      }
      const [h1, m1] = slot.startTime.split(":").map(Number);
      const [h2, m2] = slot.endTime.split(":").map(Number);

      const startToday = now.clone().hour(h1).minute(m1).second(0);
      const endToday   = now.clone().hour(h2).minute(m2).second(0);

      slotFound = true;
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
      const startOverall = moment(session.startDate, "YY/MM/DD");
      const endOverall   = moment(session.endDate, "YY/MM/DD");
      if (now.isBefore(startOverall)) {
        updatedStatus = "planned";
      } 
      else if (now.isAfter(endOverall)) {
        updatedStatus = "ended";
      } 
      else {
        updatedStatus = session.status; 
      }
    }

    if (session.status !== updatedStatus) {
      session.status = updatedStatus;
      await session.save();
    }
  }

  console.log("Session statuses updated at:", now.format());
});
