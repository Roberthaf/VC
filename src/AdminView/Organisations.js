import React, { useState, useEffect } from "react";
import useFetch from "./useFetch";
import { CED } from "../Components/CED";
import Tables from "./Table";
import { FieldGroup } from "../Components/Forms";
import { Table } from "react-bootstrap";
import { useInput } from "./useInput";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import {
  createOrganisation,
  updateOrganisationCustom,
  updateFarm
} from "../customGQL/customMutations";
import {
  listOrganisations,
  ListSimpleFarms,
  listFarms
} from "../customGQL/customQueries";
import Select from "react-select";
import moment from "moment";
import _ from "lodash";
import "./Organisations.css";
//import awsList from "../sqlData/currentAwsList.json";
//import currentList from "../sqlData/counterID.json";

import aws_exports from "../aws-exports";

Amplify.configure(aws_exports, {});

/* Fyrsta skref Sækja Organisation List og byrta listan. */

export default function Organisations(props) {
  const oList = useFetch(listOrganisations, null, {
    listOrganisations: { items: [] }
  });
  const farmList = useFetch(listFarms, null, { listFarms: { items: [] } });
  const simplefarmList = useFetch(ListSimpleFarms, null, {
    listFarms: { items: [] }
  });
  const [counterList, setAddCountersToList] = useState({ items: [] });
  const [editState, setEditState] = useState(true);
  const [addFarmsToOrg, setAddFarmsToOrg] = useState([]);
  const [originalFarmOrg] = useState([]);

  const editName = useInput(""),
    editId = useInput(""),
    editEmail = useInput(""),
    editAddress = useInput(""),
    editPhoneNumber = useInput(""),
    editIsActive = useInput(false);

  /* Declare value for the inputs we need to create a new users */
  const createName = useInput(""),
    createId = useInput(""),
    createEmail = useInput(""),
    createPhoneNumber = useInput(""),
    createAddress = useInput("");

  /* Create  */
  useEffect(() => {
    //If we change the state remove the org
    if (editState === false) {
      setAddFarmsToOrg([]);
      //clearUserInputs();
    }
  }, [editState]);

  function handleRowSelect(obj) {
    let editOrgName = { target: { value: obj.name } },
      editOrgId = { target: { value: obj.id } },
      editOrgEmail = { target: { value: obj.email } },
      editOrgPhoneNumber = { target: { value: obj.phoneNumber } },
      editOrgAddress = { target: { value: obj.address } },
      editOrgIsActive = { target: { value: obj.isActive } };
    setAddCountersToList(obj.counters);

    editName.onChange(editOrgName);
    editId.onChange(editOrgId);
    editEmail.onChange(editOrgEmail);
    editPhoneNumber.onChange(editOrgPhoneNumber);
    editAddress.onChange(editOrgAddress);
    editIsActive.onChange(editOrgIsActive);
    //Get the farms that are connected to the organisation
    /*         const simpleFarmsSelected = obj.farms.items.map( farm => {
            return {
                value: `${farm.farmID}`,
                label:  farm.farmName
            } 
        }); */
    // Add the farms to AddFarmsToOrg list which Select uses to show which farms are
    // added or remove
    //setAddFarmsToOrg(simpleFarmsSelected);
    // We use the originalFarmOrg to compare with the new list.
    //setOriginalFarmOrg(simpleFarmsSelected);
  }

  function addConnection(event) {
    setAddFarmsToOrg(event);
  }

  const handleSubmitCreate = async e => {
    e.preventDefault();
    const createOrg = {
      id: createId.value,
      orgName: createName.value,
      orgID: createId.value,
      email: createEmail.value,
      phoneNumber: createPhoneNumber.value,
      address: createAddress.value,
      isActive: editIsActive.value,
      timezone: " "
    };

    await API.graphql(
      graphqlOperation(createOrganisation, { input: createOrg })
    );
    connectOrganisationRDS(createOrg, "createOrganisation");

    const FullFarmList = farmList.data.listFarms.items;
    // Bæta við FarmsToOrgs
    let Farms = addFarmsToOrg.map(el =>
      FullFarmList.find(o => o.id === el.value)
    );
    Farms.forEach(el => {
      let singleFarm = { ...el };
      // Til að bæta við farmi á org þá notaum við editId sem er í raun OrgId.
      singleFarm.organisationFarmsId = createId.value;
      API.graphql(graphqlOperation(updateFarm, singleFarm));
    });
    clearUserInputs();
    await oList.fetchData(listOrganisations);
  };

  const handleSubmitEdit = async e => {
    e.preventDefault();

    const FullFarmList = farmList.data.listFarms.items;
    if (originalFarmOrg.length === addFarmsToOrg.length) {
      // If the lengths are equal we do nothing
      // Test if they contain the same items.
      var same = _.differenceWith(originalFarmOrg, addFarmsToOrg, _.isEqual);
      let Farms = same.map(el => FullFarmList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      Farms.forEach(el => {
        let singleFarm = { ...el };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singleFarm.organisationFarmsId = 0;
        API.graphql(graphqlOperation(updateFarm, singleFarm));
      });

      // Now we add
      let FarmsAdd = same.map(el => FullFarmList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      FarmsAdd.forEach(el => {
        let singleFarm = { ...el };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singleFarm.organisationFarmsId = editId.value;
        API.graphql(graphqlOperation(updateFarm, singleFarm));
      });
    } else if (originalFarmOrg.length > addFarmsToOrg.length) {
      // if the original length is longer we are removing a farm

      // Þetta fall hér að neðan. Skoðar muninn á milli Farms sem voru upphaflega skráð á
      // Organisationið. og bætir við eða fjarlægir farms eftir því sem á við

      // dif er munurinn á milli þessa tveggja lista
      var dif = _.differenceWith(originalFarmOrg, addFarmsToOrg, _.isEqual);
      // Hérna erum við að Fjarlægja Farms.

      // Dif inniheldur SimpleFarm information sem er svoana -> {value: "4444", label: "TestFarm"}
      // við þurfum að bera saman við lista sem inniheldur öll farms með öllum farm upplýsingunum.
      let Farms = dif.map(el => FullFarmList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      Farms.forEach(el => {
        let singleFarm = { ...el };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singleFarm.organisationFarmsId = 0;
        API.graphql(graphqlOperation(updateFarm, singleFarm));
      });
    } else if (originalFarmOrg.length < addFarmsToOrg.length) {
      // if the original length is shorter we are adding a farm
      var dif2 = _.differenceWith(addFarmsToOrg, originalFarmOrg, _.isEqual);
      let Farms = dif2.map(el => FullFarmList.find(o => o.id === el.value));
      Farms.forEach(el => {
        let singleFarm = {
          ...el
        };
        // Til að bæta við farmi á org þá notaum við editId sem er í raun OrgId.
        singleFarm.organisationFarmsId = editId.value;
        API.graphql(graphqlOperation(updateFarm, singleFarm));
      });
    }
    const editOrg = {
      id: editId.value,
      orgName: editName.value,
      orgID: editId.value,
      email: editEmail.value,
      phoneNumber: editPhoneNumber.value,
      address: editAddress.value,
      isActive: editIsActive.value,
      timezone: " "
    };
    await API.graphql(
      graphqlOperation(updateOrganisationCustom, { input: editOrg })
    );
    connectOrganisationRDS(editOrg, "updateOrganisation");
    clearUserInputs();
    await oList.fetchData(listOrganisations);
  };

  const refreshOlist = () => {
    oList.setLoading(true);
    oList.fetchData(listOrganisations);
  };

  const clearUserInputs = () => {
    editName.reset();
    editId.reset();
    editEmail.reset();
    editPhoneNumber.reset();
    editAddress.reset();

    createId.reset();
    createName.reset();
    createId.reset();
    createEmail.reset();
    createPhoneNumber.reset();
    createAddress.reset();
    editIsActive.reset();
  };

  const handleInput = () => {
    editIsActive.onChange({ target: { value: !editIsActive.value } });
  };

  const connectOrganisationRDS = (info, action) => {
    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    let apiName = "vakicloudRdsAPI";
    let path = "/adminview/" + action;

    let myInit = {
      headers: {},
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        Organisation_ID: info.id,
        Name: info.orgName,
        Email: info.email,
        Address: info.address,
        Phone_Number: info.phoneNumber,
        Created_Date: date,
        Time_Zone_ID: 1,
        Is_Active: info.isActive ? 1 : 0
      },
      body: {
        Organisation_ID: info.id,
        Name: info.orgName,
        Email: info.email,
        Address: info.address,
        Phone_Number: info.phoneNumber,
        Created_Date: date,
        Time_Zone_ID: 1,
        Is_Active: info.isActive ? 1 : 0
      }
    };

    API.post(apiName, path, myInit).then(response => {
      console.log("RDS connection", response);
    });
  };

  /*     const checkFornNewFolders = () => {
        //"aws s3 ls s3://vakicloud-dev-counters"
        // regex for aws ls PRE\s(\d+)/
        //  	{
        //"Counter_ID" : $1	},
        
        const diff = _.differenceWith(awsList, currentList,_.isEqual )
        //console.log(diff);
        //var test =
    } 
    checkFornNewFolders(); */

  return (
    <div className="flex-container ">
      <div className="admin-container__table">
        <div className="flex-container">
          <CED
            text="Create Org"
            font="fa-user-plus"
            onClick={() => setEditState(false)}
          />
          <CED
            text="Edit Org"
            font="fa-edit"
            onClick={() => setEditState(true)}
          />
          <CED text="Refresh List" font="fa-refresh" onClick={refreshOlist} />
        </div>
        {Tables(
          oList.data.listOrganisations.items,
          2,
          handleRowSelect,
          oList.loading
        )}
      </div>
      <div className="admin-container__edit">
        {editState ? (
          <h3>
            <i className="fa fa-edit" /> Edit Organisation
          </h3>
        ) : (
          <h3>
            <i className="fa fa-user-plus" /> Create Organisation
          </h3>
        )}

        <h5 className="gray-text"> Required information</h5>
        <form onSubmit={editState ? handleSubmitEdit : handleSubmitCreate}>
          <div className="flex-container">
            <FieldGroup
              id={"organisationName"}
              type={"text"}
              label={"Organisation Name"}
              help={"A unique Organization Name."}
              value={editState ? editName.value : createName.value}
              //validateion={this.nameValidation()}
              placeholder="Enter Organisation Name"
              onChange={editState ? editName.onChange : createName.onChange}
            />
            <FieldGroup
              id={"organisationID"}
              type={"text"}
              label={"Organisation ID"}
              help={"A unique Organization ID. F.x. '6' for Vaki"}
              value={editState ? `${editId.value}` : `${createId.value}`}
              //validateion={null}
              placeholder="Enter Organisation ID"
              onChange={editState ? editId.onChange : createId.onChange}
              isDisabled={editState ? true : false}
            />
          </div>

          <h5 className="gray-text"> Optional information. Use " " to skip</h5>
          <div className="flex-container">
            <FieldGroup
              id={"organisationEmail"}
              type={"text"}
              label={"Organisation Email"}
              //help={null}
              value={editState ? editEmail.value : createEmail.value}
              //validateion={null}
              placeholder="Enter Organisation Email"
              onChange={editState ? editEmail.onChange : createEmail.onChange}
            />

            <FieldGroup
              id={"organisationPhoneNumber"}
              type={"text"}
              label={"PhoneNumber"}
              //help={null}
              value={
                editState ? editPhoneNumber.value : createPhoneNumber.value
              }
              //validateion={null}
              placeholder="Enter Organisation Phone Number"
              onChange={
                editState
                  ? editPhoneNumber.onChange
                  : createPhoneNumber.onChange
              }
            />
          </div>
          <FieldGroup
            id={"organisationAddress"}
            type={"text"}
            label={"Organisation Address"}
            //help={null}
            value={editState ? editAddress.value : createAddress.value}
            //validateion={null}
            placeholder="Enter Organisation Address"
            onChange={editState ? editAddress.onChange : createAddress.onChange}
          />

          <h5 className="gray-text"> Active or Deactivate Organisation</h5>
          <div className="flex-container">
            <label>Is Active?&nbsp;</label>
            <input
              className="activeInput"
              name="activated"
              type="checkbox"
              checked={editIsActive.value}
              onChange={handleInput}
            ></input>
          </div>

          <div>
            <h5>
              {" "}
              <i className="fa fa-plus" /> Add/Remove Farms To/From
              Organisations{" "}
            </h5>
            <Select
              className={"select-react-component"}
              placeholder="Select Farms"
              value={addFarmsToOrg}
              options={simplefarmList.data.listFarms.items}
              isMulti
              isSearchable
              onChange={addConnection}
              isClearable={false}
            />
          </div>
          <div>
            <label>Connected Counters</label>
            <Table>
              <thead>
                <tr>
                  <th>Counter Id</th>
                  <th>Counter Name</th>
                  <th>Org. Id</th>
                  <th>Org. Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {counterList.items.map((counter, index) => (
                  <tr key={index}>
                    <td>{counter.counterID}</td>
                    <td>{counter.counterName}</td>
                    <td>{counter.organisationId}</td>
                    <td>{counter.organisationName}</td>
                    <td>{counter.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <input
            type="submit"
            value={editState ? "Edit Organisation" : "Create Organisation"}
          />
        </form>
      </div>
    </div>
  );
}
// Nota þetta til að importa sql data ef þarf
/*
import sqldata from "../sqlData/DIM.org.json";

const importSQLdata = async () => {
    await sqldata.map(
        org => {        
            API.graphql(graphqlOperation(createOrganisation, { input: org }))
        }
    );
}
<button onClick={importSQLdata}> Import SQL data </button> 
*/
/*
                    <div>
                <h5> <i className="fa fa-plus" /> Add/Remove Counters To/From Organisations </h5>
                <Select
                    className={"select-react-component"}
                    placeholder="Select Counters"
                    //value={addFarmsToOrg}
                    options={simpleCounterList.data.listCounters.items}
                    isMulti
                    isSearchable
                    onChange={addCounterConnection}
                    isClearable={false}
                />
            </div>
    
    */
