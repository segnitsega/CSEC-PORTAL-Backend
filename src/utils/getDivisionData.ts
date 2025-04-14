import DEV from "../models/devModel"
import CPD from "../models/cpdModel"
import DS from "../models/dsModel"
import CBD from "../models/cbdModel"
import SEC from "../models/secModel"

export const getDivisionData = async(member: any) => {
    switch(member.division){
        case "DEV":
            return await DEV.findOne({ member: member._id })
            
        case "CBD":
            return await CBD.findOne({ member: member._id })
                   
        case "CPD":
            return await CPD.findOne({ member: member._id })
          
        case "DS":
            return await DS.findOne({ member: member._id })
        
        case "SEC":
            return await SEC.findOne({ member: member._id })
        default:
            throw new Error(`Unkown division, ${member.division}`)
            
    }

}
