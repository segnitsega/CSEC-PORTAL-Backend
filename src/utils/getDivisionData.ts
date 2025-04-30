
import { getDivisionModel } from "../models/dynamicDivisionModel"

export const getDivisionData = async (member: any) => {   
    const DivisionModel =  await getDivisionModel(member.division) 
    return await DivisionModel.find({member: member._id})

}
