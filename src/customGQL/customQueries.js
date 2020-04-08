export const getUserData = `query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      admin
      consent
      email
      firstName
      lastName
      phoneNumber
      role
      organisations {
        items {
          organisation{
            orgID
            orgName
            farms{
              items{
                farmID
                farmName
                population{ items{ popID popName } }
              }
            }
            counters {
              items {
                id
                counterID
                counterName
                counterType
                description
                farmId
                organisationId
                processData
                product
              }
            }
          }
        }
      }
    }
  }
`;
export const getUserOrgs = `query GetUSerOrgs($id: ID!){ 
  getUser( id: $id){
    organisations {
       items{
        organisation{
          label: orgName
          value: orgID
          isActive
          counters {
            items {
              id
              counterID
              counterName
              counterType
              description
              farmId
              organisationId
              processData
              product
            }
          }
        }
      }
    }
  }
}
`;
export const listUsers = `
    query{listUsers(limit: 400){
      items{
        id
        name
        admin
        consent
        email
        firstName
        lastName
        phoneNumber
        role
        BiomassDaily
        Counters
        InspectionStation
        Spotlice
        organisations{
          items{
            id
            organisation{
              orgID
              orgName
            }
          }
        }  
      }
    }
  }
`;
export const searchUsers = `query SearchUsersName($SearchName: String){
    listUsers(
      limit: 400
        filter:{
          name:{contains: $SearchName}
        }
      )
      {
      items{
        id
        name
        admin
        consent
        email
        firstName
        lastName
        phoneNumber
        role
        BiomassDaily
        Counters
        InspectionStation
        Spotlice
      }
    }
  }
`;
export const listOrganisations = `query{
    listOrganisations(limit: 400) {
      items {
        id
        orgName
        orgID
        email
        address
        phoneNumber
        timezone
        isActive
        farms {
          items {
            id
            farmName
            farmID
            email
            phoneNumber
            timezone
            lat
            long
            isActive
          }
        }
        counters {
          items {
            id
            counterID
            counterName
            organisationId
            organisationName
            farmId
            description
            product
          }
        }
      }
    }
  }
`;
export const listFarms = `query{
    listFarms(limit: 1000) {
      items {
        id
        farmName
        farmID
        email
        phoneNumber
        timezone
        lat
        long
        isActive
        population{items{
          id
          popID
          popName
          population_GUID
          species_id
        }}
      }
    }
  }
`;
export const listPopulations = `query {
    listPopulations(limit: 1400) {
      items {
        id
        popName
        popID
        species_id
        isActive
        population_GUID
      }
    }
  }
`;
export const ListSimpleUser = `
  query{
    listUsers{
      items{
        id
        name
      }
    }
  }
`;
export const listSimpleCounters = `query{ 
  listCounters(limit: 1400){
    items {
      value: counterID
      label: counterID
      id
      counterID
      counterName
      organisationId
      farmId
      description
      counterType
      processData
    }
  }
}
`;
export const ListSimpleOrg = `
  query{
    listOrganisations(limit: 1400){
      items{
        value: id
        label: orgName
        counters {
          items {
            id
            counterID
            counterName
            counterType
            description
            farmId
            organisationId
            processData
            product
          }
          nextToken
        }
      }
    }
  }
`;
export const ListSimpleFarms = `
  query{
    listFarms{
      items{
        value: id
        label: farmName
      }
    }
  }
`;
export const ListSimplePop = `
  query{
    listPopulations{
      items{
        value: id
        label: popName
      }
    }
  }
`; 
export const ThumbnailList = `
query GetThumbnailList( $populationId: ID! $startDate: String! $endDate: String!){
    getThumbnailList( populationId: $populationId startDate: $startDate endDate: $endDate)
    {
      Photo_ID
      Population_ID
      Camera_ID
      Classification_ID
      Classification_Name
      Recorded_Datetime
      imageUrl
      thumbnailUrl
      Weight
	  }
  }
`;
export const ImageCount = `
  query GetImageCount($populationId: ID! $startDate: String!){
      getImageCountList(
        populationId: $populationId
        startDate: $startDate)
      {
        CountDay
        CountWeek
        CountMonth
        NewImage
        MarkedImage
        SavedImage
        FinishedImage
        RejectedImage
        PopID
      }
  }
`;

export const ImageAttribute = 
`query GetImageAttribute($Photo_ID: ID!){
  getImageAttribute(Photo_ID: $Photo_ID){
    Photo_ID
    Attribute_Index
    PosX
    PosY
    AttributeType_ID
    Attribute_Details
    Comment
    LiceAge_ID
    LiceGender_ID
    LiceType_ID
    Description
    Inserted_Datetime
    LiceMobility_ID
    LiceEggs_ID
    Population_ID
    Attribute_ID
  }
  }
`;
export const getReportInformation =
`query GetReportInformation(
  $populationId: Int! $startDate: String! $endDate: String! $Classification_ID: Int!){
    getReportInformation(
      populationId: $populationId startDate: $startDate endDate: $endDate Classification_ID: $Classification_ID){
        Attribute_ID
        Photo_ID
        Attribute_Index
        PosX
        PosY
        AttributeType_ID
        Attribute_Details
        Comment
        LiceAge_ID
        LiceGender_ID
        LiceType_ID
        Description
        Inserted_Datetime
        LiceMobility_ID
        LiceEggs_ID
        Population_ID 
    }
  }

`;
export const getReportCounts = 
`query GetReportCounts($Organisation_ID: Int $Farm_ID: Int $populationId: Int $Classification_ID: Int $startDate: String $endDate: String
){
  getReportCounts(
    Organisation_ID: $Organisation_ID Farm_ID: $Farm_ID populationId: $populationId Classification_ID: $Classification_ID
    startDate: $startDate endDate: $endDate){
      FishCount
      Lice
      Adult_Lice
      Adult_Lice_Male
      Adult_Lice_Female
      Adult_Lice_Female_Eggs
      Adult_Lice_Female_NoEggs
      PreAdult_Lice
      PreAdult_Lice_Male
      PreAdult_Lice_Female
      Wound
      Defect
      Finstate
      GeneralStatus
      ScaleLoss
      Cataract
      RedBelly
      SexualMaturation
      CodLice
      Ave_weight
    }
  }
`