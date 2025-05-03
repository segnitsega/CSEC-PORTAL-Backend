import { ClubRule } from "../models/clubRulesModel"; 
import { Request, Response } from "express";

export const getRules = async (req: Request, res: Response): Promise<void> => {
  try {
    const rules = await ClubRule.findOne();
    if (!rules){
        res.status(404).json({ message: "No rules found" });
        return
    }
    res.json({ClubRules: rules});
  } catch (err) {
    res.status(500).json({ message: "Error fetching rules" });
  }
};

export const addRules = async (req: Request | any, res: Response): Promise<void> => {
    const {clubRole} = req.user
    const allowedRoles = ["President", "Vice President"]
    if(!allowedRoles.includes(clubRole)){
        res.status(403).json({message: `${clubRole} is not authorized to add rules`})
        return
    }
    try {
      const update = { ...req.body, updatedAt: new Date() };
      const rules = await ClubRule.findOneAndUpdate({}, update, {
        new: true,
        upsert: true
      });
      res.json(rules);
    } catch (err) {
      res.status(500).json({ message: "Error updating rules" });
    }
  }