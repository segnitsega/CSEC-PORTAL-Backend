import { Request, Response, NextFunction } from 'express';
import DivisionGroup from '../models/divisionGroupModel';
import Session from '../models/sessionsModel';
export const validateSessionInput = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    sessionTitle,
    division,
    groups,
    startDate,
    endDate,
    sessions
  } = req.body;

  if (!sessionTitle || !division || !groups || !startDate || !endDate) {
    res.status(400).json({
      message: "sessionTitle, division, groups, startDate, and endDate are required",
    });
    return
  }

  const availableDivisions = await DivisionGroup.distinct('division');
  if (!availableDivisions.includes(division)) {
    res.status(400).json({ message: `${division} is not a valid division` });
    return
  }

  if (!Array.isArray(sessions) || sessions.length === 0 ||
      sessions.some(s => !s.day || !s.startTime || !s.endTime)) {
    res.status(400).json({ message: "Invalid sessions format" });
    return
  }

  const sessionExists = await Session.findOne({sessionTitle})
  if(sessionExists){
    res.status(400).json({ message: `${sessionTitle} already exist` })
    return
}
  next();
};
