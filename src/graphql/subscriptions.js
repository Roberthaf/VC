/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
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
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
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
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
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
export const onCreateUserOrg = `subscription OnCreateUserOrg {
  onCreateUserOrg {
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
export const onUpdateUserOrg = `subscription OnUpdateUserOrg {
  onUpdateUserOrg {
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
export const onDeleteUserOrg = `subscription OnDeleteUserOrg {
  onDeleteUserOrg {
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
export const onCreateOrganisation = `subscription OnCreateOrganisation {
  onCreateOrganisation {
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
export const onUpdateOrganisation = `subscription OnUpdateOrganisation {
  onUpdateOrganisation {
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
export const onDeleteOrganisation = `subscription OnDeleteOrganisation {
  onDeleteOrganisation {
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
export const onCreateFarm = `subscription OnCreateFarm {
  onCreateFarm {
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
export const onUpdateFarm = `subscription OnUpdateFarm {
  onUpdateFarm {
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
export const onDeleteFarm = `subscription OnDeleteFarm {
  onDeleteFarm {
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
export const onCreatePopulation = `subscription OnCreatePopulation {
  onCreatePopulation {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const onUpdatePopulation = `subscription OnUpdatePopulation {
  onUpdatePopulation {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const onDeletePopulation = `subscription OnDeletePopulation {
  onDeletePopulation {
    id
    popName
    popID
    species_id
    isActive
    population_GUID
  }
}
`;
export const onCreateCounter = `subscription OnCreateCounter {
  onCreateCounter {
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
export const onUpdateCounter = `subscription OnUpdateCounter {
  onUpdateCounter {
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
export const onDeleteCounter = `subscription OnDeleteCounter {
  onDeleteCounter {
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
export const onCreateLicence = `subscription OnCreateLicence {
  onCreateLicence {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
export const onUpdateLicence = `subscription OnUpdateLicence {
  onUpdateLicence {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
export const onDeleteLicence = `subscription OnDeleteLicence {
  onDeleteLicence {
    id
    licence
    counterID
    createdBy
    createdDate
  }
}
`;
