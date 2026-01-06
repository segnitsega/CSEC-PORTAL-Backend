import Member from "../models/membersModel";
import { NextFunction, Request, Response } from "express";

const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000;

const lastWriteByUser = new Map<string, number>();

export const updateLastSeen = (req: Request | any, res: Response, next: NextFunction) => {
    const email: string | undefined = req.user?.email;
    if (!email) {
        return next();
    }

    const now = Date.now();
    const lastWrite = lastWriteByUser.get(email);

    if (lastWrite && now - lastWrite < LAST_SEEN_THROTTLE_MS) {
        return next();
    }

    lastWriteByUser.set(email, now);

    Member.updateOne(
        { email },
        { $set: { lastSeen: new Date().toISOString() } }
    ).catch((error) => {
        console.log("Failed to update lastSeen", error);
        lastWriteByUser.delete(email);
    });

    next();
};
