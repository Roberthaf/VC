export const createUserMain = `mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
`;

export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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
  `;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      id
    }
  }
  `;
export const createOrganisation = `mutation CreateOrganisation($input: CreateOrganisationInput!) {
    createOrganisation(input: $input) {
      id
      orgName
      orgID
      email
      address
      phoneNumber
      timezone
      isActive
    }
  }
`;
export const deleteOrganisation = `mutation DeleteOrganisation($input: DeleteOrganisationInput!){
  deleteOrganisation(input: $input){
    id
  }
}
`;

export const createOrganisationWithLink = `mutation CreateOrganisation($input: CreateOrganisationInput!) {
    createOrganisation(input: $input) {
      id
      orgName
      orgID
      email
      address
      phoneNumber
      timezone
      isActive
      userOrganisationId
    }
  }
`;
export const updateOrganisationCustom = `mutation UpdateOrganisation($input: UpdateOrganisationInput!) {
    updateOrganisation(input: $input) {
      id
      orgName
      orgID
      email
      address
      phoneNumber
      timezone
      isActive
    }
  }
`;
export const createFarm = `mutation CreateFarm($input: CreateFarmInput!) {
    createFarm(input: $input) {
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
`;
export const deleteFarm = `mutation DeleteFarm($input: DeleteFarmInput!) {
  deleteFarm(input: $input){
    id
  }
}
`;

export const updateFarm = `mutation UpdateFarm(
      $id: ID!
      $farmName: String
      $farmID: Int
      $email: String
      $phoneNumber: ID
      $timezone: String
      $lat: Int
      $long: Int
      $isActive: Boolean
      $organisationFarmsId: ID
    ) {
    updateFarm(input: {
      id: $id
      farmName: $farmName
      farmID: $farmID
      email: $email
      phoneNumber: $phoneNumber
      timezone: $timezone
      lat: $lat
      long: $long
      isActive: $isActive
      organisationFarmsId: $organisationFarmsId
    }){
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
  `;
  export const updateCounterCustom = `
  mutation UpdateCounter(
    $id: ID!
    $counterID: Int
    $counterName: String
    $organisationId: Int
    $organisationName: String
    $farmId: Int
    $description: String
    $counterType: Int
    $processData: Int
    $organisationCountersId: ID
    $product: String

  ) {
    updateCounter(input: {
      id: $id
      counterID: $counterID
      counterName: $counterName
      organisationId: $organisationId
      organisationName: $organisationName
      farmId: $farmId
      description: $description
      counterType: $counterType
      processData: $processData
      organisationCountersId: $organisationCountersId
      product: $product
    }) {
      id
      counterID
      counterName
      organisationId
      organisationName
      farmId
      description
      counterType
      processData
      product
    }
  }
  `;
  export const createCounterCustom = `
  mutation CreateCounter(
    $id: ID!
    $counterID: Int
    $counterName: String
    $organisationId: Int
    $organisationName: String
    $farmId: Int
    $description: String
    $counterType: Int
    $processData: Int
    $product: String

  ) {
    createCounter(input: {
      id: $id
      counterID: $counterID
      counterName: $counterName
      organisationId: $organisationId
      organisationName: $organisationName
      farmId: $farmId
      description: $description
      counterType: $counterType
      processData: $processData
      product: $product
    }) {
      id
      counterID
      counterName
      organisationId
      organisationName
      farmId
      description
      counterType
      processData
      product
    }
  }
`;
export const createCounter2 = `mutation CreateCounter($input: CreateCounterInput!) {
  createCounter(input: $input) {
    id
    counterID
    counterName
    organisationId
    organisationName
    farmId
    description
    counterType
    processData
    product
    location
  }
}`;
export const createPopulation = `mutation CreatePopulation($input: CreatePopulationInput!) {
    createPopulation(input: $input) {
      id
      popName
      popID
      species_id
      isActive
      population_GUID
    }
  }
`;
export const updatePopulation = `mutation UpdatePopulation($input: UpdatePopulationInput!) {
  updatePopulation(input: $input) {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const deletePopulation =  `mutation DeletePopulation($input: DeletePopulationInput!) {
  deletePopulation(input: $input){
    id
  }
}
`;

export const updatePopulation2 = `
mutation UpdatePopulation(
    $id: ID!
    $popName: String
    $popID: Int
    $species_id: Int
    $isActive: Boolean
    $population_GUID: String
    $farmPopulationId: ID
) {
	updatePopulation(input:{
		    id: $id
        popName: $popName
        popID: $popID
        species_id: $species_id
        isActive: $isActive
        population_GUID: $population_GUID
        farmPopulationId: $farmPopulationId
    }){
		id
        popID
        popName
        population_GUID
        isActive
        species_id
    }
  }
`;

export const createUserOrg = `mutation CreateUserOrg($id: ID! $userOrgUserId: ID! $userOrgOrganisationId: ID! ) {
  createUserOrg(input:{
    id: $id
    userOrgUserId: $userOrgUserId
    userOrgOrganisationId: $userOrgOrganisationId
  }){
    id
  }
}
`;
export const deleteUserOrg = `
mutation DeleteUserOrg($input: DeleteUserOrgInput!) {
  deleteUserOrg(input: $input){
    id
  }
}
`;

export const addUserOrg = `
  mutation CreateUserOrg($id: ID! $userOrgUserId: ID! $userOrgOrganisationId: ID! ) {
    createUserOrg(input:{
      id: $id
      userOrgUserId: $userOrgUserId
      userOrgOrganisationId: $userOrgOrganisationId
    }){
      id
    }
  }
`;
export const postImageAttribute = `
  mutation PostImageAttribute(
    $Photo_ID: Int!
    $Attribute_Index: Int
    $PosX: Float
    $PosY: Float
    $AttributeType_ID: Int
    $Attribute_Details: String
    $Comment: String
    $LiceAge_ID: Int
    $LiceGender_ID: Int
    $LiceType_ID: Int
    $Description: String
    $LiceMobility_ID: Int
    $LiceEggs_ID: Int
    $populationId: Int
  ){
    postImageAttribute(
      Photo_ID: $Photo_ID
      Attribute_Index: $Attribute_Index
      PosX: $PosX
      PosY: $PosY
      AttributeType_ID: $AttributeType_ID
      Attribute_Details: $Attribute_Details
      Comment: $Comment
      LiceAge_ID: $LiceAge_ID
      LiceGender_ID: $LiceGender_ID
      LiceType_ID: $LiceType_ID
      Description: $Description
      LiceMobility_ID: $LiceMobility_ID
      LiceEggs_ID: $LiceEggs_ID
      populationId: $populationId
    ){
      Response
    }
  }
`;
export const deleteImageAttribute = `
  mutation DeleteImageAttribute($Attribute_ID: ID!){
    deleteImageAttribute(Attribute_ID: $Attribute_ID){
      Response
    }
  }
`;
export const updateImageClassification = `
  mutation UpdateImageClassification($Classification_ID: Int! $Photo_ID: Int!){
    updateImageClassification(Classification_ID: $Classification_ID Photo_ID: $Photo_ID){
      Response
    }
  }
`;