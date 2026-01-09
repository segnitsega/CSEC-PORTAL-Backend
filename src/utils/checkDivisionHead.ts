import { getDivisions } from "./divisionCache";

export const canManageDivision = async(clubRole: string, divisionName: string)=> {
    const topRoles = ["President", "Vice President"]
    const availableDivisions = await getDivisions();
    const divisionPresidents:{[key: string]: string} = {}
    availableDivisions.forEach((division) => {
        divisionPresidents[`${division} President`] = division
    })
   return topRoles.includes(clubRole) || divisionPresidents[clubRole] === divisionName;
}
