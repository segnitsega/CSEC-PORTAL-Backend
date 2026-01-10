import dayjs from "dayjs";
import { eventRepository } from "../repositories/event.repository";
import { canManageDivision } from "../utils/checkDivisionHead";
import { ServiceError } from "../errors/ServiceError";

export const eventService = {
  async addEvent(
    actorClubRole: string,
    body: {
      eventTitle?: string;
      division?: string;
      groups?: string[];
      eventDate?: string;
      startTime?: string;
      endTime?: string;
      visibility?: string;
      attendance?: string;
    }
  ) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} can not add event`);
    }
    const {
      eventTitle,
      division,
      groups,
      eventDate,
      startTime,
      endTime,
      visibility,
      attendance,
    } = body;
    const formattedDate = dayjs(eventDate).format("YY/MM/DD");

    if (division && groups) {
      if (await canManageDivision(actorClubRole, division)) {
        const newEvent = await eventRepository.create({
          eventTitle,
          division,
          groups,
          eventDate: formattedDate,
          startTime,
          endTime,
          visibility,
          attendance,
        });
        return { message: "New event added", Event: newEvent };
      }
    }

    const newEvent = await eventRepository.create({
      eventTitle,
      eventDate: formattedDate,
      startTime,
      endTime,
      visibility,
    });
    return { message: "New event added", Event: newEvent };
  },

  async listEvents(pageRaw?: unknown, limitRaw?: unknown) {
    const page = parseInt(pageRaw as string) || 1;
    const limit = parseInt(limitRaw as string) || 10;
    const skip = (page - 1) * limit;

    const [events, total] = await eventRepository.findPaginated(skip, limit);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total,
      events,
    };
  },

  async deleteEvent(actorClubRole: string, id: string) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} cannot delete an event`);
    }
    const event = await eventRepository.findById(id);
    if (await canManageDivision(actorClubRole, event?.division!)) {
      const deletedEvent = await eventRepository.deleteById(id);
      if (!deletedEvent) {
        throw ServiceError.message(404, "Event not found");
      }
      return { message: "Event deleted successfully" };
    }
    throw ServiceError.message(403, "Unauthorized to delete this event");
  },

  async updateEvent(actorClubRole: string, id: string, updatedData: unknown) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} cannot update an event`);
    }
    const event = await eventRepository.findById(id);
    if (await canManageDivision(actorClubRole, event?.division!)) {
      const updatedEvent = await eventRepository.updateById(
        id,
        updatedData as Record<string, unknown>
      );
      if (!updatedEvent) {
        throw ServiceError.message(404, "Event not found");
      }
      return { message: "Event updated successfully", updatedEvent };
    }
    throw ServiceError.message(403, "Unauthorized to update this event");
  },
};
