/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
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
    BiomassDaily
    Counters
    InspectionStation
    Spotlice
    organisation {
      items {
        id
        orgName
        orgID
        email
        address
        phoneNumber
        timezone
        isActive
      }
      nextToken
    }
    organisations {
      items {
        id
      }
      nextToken
    }
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      organisation {
        nextToken
      }
      organisations {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getOrganisation = `query GetOrganisation($id: ID!) {
  getOrganisation(id: $id) {
    id
    orgName
    orgID
    email
    address
    phoneNumber
    timezone
    isActive
    users {
      items {
        id
      }
      nextToken
    }
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
      nextToken
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
        counterType
        processData
        product
        location
      }
      nextToken
    }
  }
}
`;
export const listOrganisations = `query ListOrganisations(
  $filter: ModelOrganisationFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrganisations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      orgName
      orgID
      email
      address
      phoneNumber
      timezone
      isActive
      users {
        nextToken
      }
      farms {
        nextToken
      }
      counters {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getFarm = `query GetFarm($id: ID!) {
  getFarm(id: $id) {
    id
    farmName
    farmID
    email
    phoneNumber
    timezone
    lat
    long
    isActive
    population {
      items {
        id
        popName
        popID
        species_id
        isActive
        population_GUID
      }
      nextToken
    }
  }
}
`;
export const listFarms = `query ListFarms(
  $filter: ModelFarmFilterInput
  $limit: Int
  $nextToken: String
) {
  listFarms(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
      population {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getPopulation = `query GetPopulation($id: ID!) {
  getPopulation(id: $id) {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const listPopulations = `query ListPopulations(
  $filter: ModelPopulationFilterInput
  $limit: Int
  $nextToken: String
) {
  listPopulations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      popName
      popID
      species_id
      isActive
      population_GUID
    }
    nextToken
  }
}
`;
export const getCounter = `query GetCounter($id: ID!) {
  getCounter(id: $id) {
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
}
`;
export const listCounters = `query ListCounters(
  $filter: ModelCounterFilterInput
  $limit: Int
  $nextToken: String
) {
  listCounters(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getLicence = `query GetLicence($id: ID!) {
  getLicence(id: $id) {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
export const listLicences = `query ListLicences(
  $filter: ModelLicenceFilterInput
  $limit: Int
  $nextToken: String
) {
  listLicences(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      licence
      counterID
      createdBy
      createdDate
    }
    nextToken
  }
}
`;
