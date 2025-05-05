import DivisionGroup from "../models/divisionGroupModel";

export const canManageDivision = async(clubRole: string, divisionName: string)=> {
    const topRoles = ["President", "Vice President"]  
    const availableDivisions = await DivisionGroup.distinct('division'); 
    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })
   return topRoles.includes(clubRole) || divisionPresidents[clubRole] === divisionName
}
