/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
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
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
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
export const createUserOrg = `mutation CreateUserOrg($input: CreateUserOrgInput!) {
  createUserOrg(input: $input) {
    id
    organisation {
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
    user {
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
  }
}
`;
export const updateUserOrg = `mutation UpdateUserOrg($input: UpdateUserOrgInput!) {
  updateUserOrg(input: $input) {
    id
    organisation {
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
    user {
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
  }
}
`;
export const deleteUserOrg = `mutation DeleteUserOrg($input: DeleteUserOrgInput!) {
  deleteUserOrg(input: $input) {
    id
    organisation {
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
    user {
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
export const updateOrganisation = `mutation UpdateOrganisation($input: UpdateOrganisationInput!) {
  updateOrganisation(input: $input) {
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
export const deleteOrganisation = `mutation DeleteOrganisation($input: DeleteOrganisationInput!) {
  deleteOrganisation(input: $input) {
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
export const updateFarm = `mutation UpdateFarm($input: UpdateFarmInput!) {
  updateFarm(input: $input) {
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
export const deleteFarm = `mutation DeleteFarm($input: DeleteFarmInput!) {
  deleteFarm(input: $input) {
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
export const deletePopulation = `mutation DeletePopulation($input: DeletePopulationInput!) {
  deletePopulation(input: $input) {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const createCounter = `mutation CreateCounter($input: CreateCounterInput!) {
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
}
`;
export const updateCounter = `mutation UpdateCounter($input: UpdateCounterInput!) {
  updateCounter(input: $input) {
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
export const deleteCounter = `mutation DeleteCounter($input: DeleteCounterInput!) {
  deleteCounter(input: $input) {
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
export const createLicence = `mutation CreateLicence($input: CreateLicenceInput!) {
  createLicence(input: $input) {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
export const updateLicence = `mutation UpdateLicence($input: UpdateLicenceInput!) {
  updateLicence(input: $input) {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
export const deleteLicence = `mutation DeleteLicence($input: DeleteLicenceInput!) {
  deleteLicence(input: $input) {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
