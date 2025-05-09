import cron from "node-cron";
import Event from "../models/eventsModel";
import moment from "moment-timezone";

cron.schedule("* * * * *", async () => {
  const now = moment.tz("Africa/Addis_Ababa");
  const dateToday = now.format("YYYY-MM-DD");

  const events = await Event.find();
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
      event.status = updatedStatus;
      await event.save();
    }
  }

  console.log("Event statuses updated at:", now.format("hh:mm A"));
});
