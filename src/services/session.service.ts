import dayjs from "dayjs";
import { sessionRepository } from "../repositories/session.repository";
import { canManageDivision } from "../utils/checkDivisionHead";
import { ServiceError } from "../errors/ServiceError";

export const sessionService = {
  async createSession(
    actorClubRole: string,
    body: {
      sessionTitle?: string;
      division?: string;
      groups?: string[];
      startDate?: string;
      endDate?: string;
      sessionStatus?: string;
      sessions?: unknown;
    }
  ) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} can not create a session`);
    }
    const {
      sessionTitle,
      division,
      groups,
      startDate,
      endDate,
      sessionStatus,
      sessions,
    } = body;

    const formattedStartDate = dayjs(startDate).format("YY/MM/DD");
    const formattedEndDate = dayjs(endDate).format("YY/MM/DD");

    if (await canManageDivision(actorClubRole, division as string)) {
      const newSession = await sessionRepository.create({
        sessionTitle,
        division,
        groups,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        sessionStatus,
        sessions,
      } as any);
      return { message: "New session created", session: newSession };
    }
    throw ServiceError.message(
      403,
      `${actorClubRole} cannot create a session in ${division} division`
    );
  },

  async listSessions(pageRaw?: unknown, limitRaw?: unknown) {
    const page = parseInt(pageRaw as string) || 1;
    const limit = parseInt(limitRaw as string) || 10;
    const skip = (page - 1) * limit;

    const [sessions, total] = await sessionRepository.findPaginated(skip, limit);

    return {
      page,
      totalPages: Math.ceil(total / limit),
      totalSessions: total,
      sessions,
    };
  },

  async deleteSession(actorClubRole: string, id: string) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} cannot delete a session`);
    }
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw ServiceError.message(404, "Session not found");
    }
    if (await canManageDivision(actorClubRole, session.division)) {
      const deletedSession = await session.deleteOne();
      return { message: "Session deleted successfully", deletedSession };
    }
    throw ServiceError.message(
      403,
      "You are not authorized to delete this session"
    );
  },

  async updateSession(actorClubRole: string, id: string, updatedData: unknown) {
    const session = await sessionRepository.findById(id);
    if (!session) {
      throw ServiceError.message(404, "Session not found");
    }
    if (await canManageDivision(actorClubRole, session.division)) {
      const updatedSession = await sessionRepository.updateById(
        id,
        updatedData as Record<string, unknown>
      );
      return { message: "Session updated successfully", updatedSession };
    }
    throw ServiceError.message(
      403,
      "You are not authorized to update this session"
    );
  },
};
