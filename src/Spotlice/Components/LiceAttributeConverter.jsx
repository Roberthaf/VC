/*
# AttributeType_ID, Name, Discription
1, Lice, Any type of Lice
2, Wound, Any type of Wound
3, Defects, Any Type of Defects
4, FinState, Any Problem with Fins
5, General, General Observations
*/

// set in Dim_AttributeType_ID in spotlice_dev table
export const AttributeType = (AttributeType) => {
    let response = '';
    switch (AttributeType) {
        case 1:
            response = "Salom Louse";
            break;
        case 2:
            response = "Wound";
            break;
        case 3:
            response = "Defects";
            break;
        case 4:
            response = "FinState";
            break;
        case 5:
            response = "General";
            break;    
        case 6:
            response = "Cod Louse";
            break;
        case 7:
            response = "No lice";
            break;
        case 8:
            response = "Scale Loss";
            break;
        case 9:
            response = "Cataract";
            break;
        case 10:
            response = "Red Belly";
            break;
        case 11:
            response = "Maturation";
            break;
        default:
            response = "Salmon Louse";
      }     
    return response;
};

// # Classification_ID, Name, Description
// 1, New, New Photo
// 2, Viewed, Photo has been Viewed
// 3, Saved, Photo Saved for later
// 4, Finished, Photo has been marked
// 5, Rejected, Photo is unusable

export const Photo_classification = (Photo_classification) => {
    let response = '';   
    switch (Photo_classification) {
        case 1:
        response = "New"
            break;
        case 2:
        response = "Viewed"
            break;   
        case 3:
        response = "Saved";
            break;
        case 4:
        response = "Finished"
            break;
        case 5:
        response = "Rejected"
            break;
        default:
            response = null;
      }
    return response;
}

/*
# LiceAge_ID, Name, Description
1, Adult, Adult lice sexually mature
2, PreAdult, PreAdult
*/
export const LiceAge = (Lice_Age) => {
    let response = '';
    switch (Lice_Age) {
        case 1:
            response = "Adult";
            break;
        case 2:
            response = "PreAdult";
            break;
        case 3:
            response = null;
            break;
        default:
            response = "Adult";
      }
    return response
}

/*
# LiceEggs_ID, Name, Description
1, With Eggs, With Eggs
2, Without Eggs, Without Eggs
3, Male No Eggs, Male No Eggs
*/
export const LiceEggs = (LiceEggs) => {
    let response = '';
    switch (LiceEggs) {
        case 1:
            response = "With Eggs";
            break;
        case 2:
            response = "Without Eggs";
            break;
        case 3:
            response = null;
            break;
        case 4:
            response = null;
            break;
        default:
            response = "None";
      }    
    return response;
}

/*
# LiceGender_ID, Name, Description
1, Male, Male 
2, Female, Female
3, Other, Transgender
*/
export const LiceGender = (LiceGender) => {
    let response = '';
    switch (LiceGender) {
        case 1:
            response = "Male";
            break;
        case 2:
            response = "Female";
            break;
        case 3:
            response = null;
            break;
        default:
            response = "Male";
      }     
    return response;
}

/*
# LiceMobility_ID, Name, Description
1, Sessile, A Louse that is fixed
2, Motile, A Louse that is not fixed
3, Other, 
*/
export const LiceMobility = (LiceMobility) => {
    let response = '';
    switch (LiceMobility) {
        case 1:
            response = "Sessile";
            break;
        case 2:
            response = "Motile";
            break;
        case 3:
            response = null;
            break;
        default:
            response = "Sessile";
      }     
    return response;
}

/*
# LiceType_ID, Name, Description
1, Salmon Louse, 
2, Cod Louse, 
3, NaN, N
*/
export const LiceType = (LiceType) => {
    let response = '';
    switch (LiceType) {
        case 1:
            response = "Salmon";
            break;
        case 2:
            response = "Cod";
            break;
        case 3:
            response = null;
            break;
        default:
            response = "Salmon";
      }     
    return response;
}

