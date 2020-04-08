import React, { useState } from "react";
import useFetch from "./useFetch";
import { CED } from "../Components/CED";
import Tables from "./Table";
import { FieldGroup } from "../Components/Forms";
import { useInput } from "./useInput";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import { listCounters } from "../graphql/queries";
import { createCounter } from "../graphql/mutations"; //updateCounter
import { updateCounterCustom } from "../customGQL/customMutations";
import { ListSimpleOrg } from "../customGQL/customQueries";
import Select from "react-select";
import "./Counter.css";
import aws_exports from "../aws-exports";

Amplify.configure(aws_exports, {});

export default function Counter() {
  const counterList = useFetch(listCounters, null, {
    listCounters: { items: [] }
  });
  const simpleOrg = useFetch(ListSimpleOrg, null, {
    listOrganisations: { items: [] }
  });
  const [editState, setEditState] = useState(true);
  const editName = useInput(""),
    editOrgId = useInput(""),
    editOrgName = useInput(""),
    editDescription = useInput(""),
    editProduct = useInput(""),
    editId = useInput("");

  /* Declare value for the inputs we need to create a new users */
  const createName = useInput(""),
    createOrgId = useInput(""),
    createOrgName = useInput(""),
    createDescription = useInput(""),
    createProduct = useInput(""),
    createId = useInput("");

  const [addCounterToOrg, setAddCounterToOrg] = useState([]);
  const [addProductToCurrent, setAddProductToCurrent] = useState([]);
  /* Create  */
  //const [PopsAddToList, setPopsAddToList] = useState([]);
  //const [originalPopFarms, setOriginalPopFarms] = useState([]);

  let sorted_simpleOrg = simpleOrg.data.listOrganisations.items.sort(function(
    a,
    b
  ) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  });

  function handleRowSelect(obj) {
    let editCounterName = { target: { value: obj.name } },
      editCounterId = { target: { value: obj.id } },
      editOrgranisationId = { target: { value: obj.orgId } },
      editOrgranisationName = { target: { value: obj.orgName } },
      editCounterDescription = { target: { value: obj.description } },
      editCounterProduct = { target: { value: obj.product } };

    editName.onChange(editCounterName);
    editOrgId.onChange(editOrgranisationId);
    editOrgName.onChange(editOrgranisationName);
    editDescription.onChange(editCounterDescription);
    editId.onChange(editCounterId);
    editProduct.onChange(editCounterProduct);
    setAddCounterToOrg([]); // Clear list
  }

  const connectCountersRDS = (info, action) => {
    let apiName = "vakicloudRdsAPI";
    let path = "/adminview/" + action;
    let myInit = {
      // OPTIONAL
      headers: {}, // OPTIONAL
      response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
      queryStringParameters: {
        Counter_ID: info.id, //
        Organisation_ID: info.organisationId,
        Product_Serial: info.counterName,
        Description: info.description,
        Farm_ID: 0,
        Type_ID: 1,
        Process_Data: 1
      },
      body: {
        Counter_ID: info.id,
        Organisation_ID: info.organisationId,
        Product_Serial: info.counterName,
        Description: info.description,
        Farm_ID: 0,
        Type_ID: 1,
        Process_Data: 1
      }
    };

    API.post(apiName, path, myInit).then(response => {
      console.log("RDS Connect Response", response);
    });
  };

  const handleSubmitCreate = async e => {
    e.preventDefault();

    const counterInfo = {
      id: createId.value,
      counterID: parseInt(createId.value, 10),
      counterName: createName.value,
      organisationId: parseInt(createOrgId.value, 10),
      organisationName: createOrgName.value,
      farmId: 0,
      description: createDescription.value,
      counterType: 1,
      processData: 1,
      //organisationCountersId: `${createOrgId.value}`,
      product: createProduct.value
    };
    // We need to also call edit Counter to include organisationCountersId
    const editCounter = {
      id: createId.value,
      counterID: parseInt(createId.value, 10),
      counterName: createName.value,
      organisationId: parseInt(createOrgId.value, 10),
      organisationName: createOrgName.value,
      farmId: 0,
      description: createDescription.value,
      counterType: 1,
      processData: 1,
      organisationCountersId: `${createOrgId.value}`,
      product: createProduct.value
    };
    await API.graphql(graphqlOperation(createCounter, { input: counterInfo }));
    //await API.graphql(graphqlOperation(createCounterCustom, counterInfo ));
    updateCounter(editCounter);
    connectCountersRDS(counterInfo, "createCounter");
    // Clear our state after we create
    clearUserInputs();
    refreshFList();
  };

  const handleSubmitEdit = async e => {
    e.preventDefault();
    clearUserInputs();
    const editCounter = {
      id: editId.value,
      counterID: parseInt(editId.value, 10),
      counterName: editName.value,
      organisationId: parseInt(editOrgId.value, 10),
      organisationName: editOrgName.value,
      farmId: 0,
      description: editDescription.value,
      counterType: 1,
      processData: 1,
      organisationCountersId: `${editOrgId.value}`,
      product: editProduct.value
    };

    updateCounter(editCounter);
    connectCountersRDS(editCounter, "updateCounter");
    refreshFList();
    setAddProductToCurrent([]);
  };

  async function updateCounter(editCounter) {
    await API.graphql(graphqlOperation(updateCounterCustom, editCounter));
  }

  function addConnection(event) {
    let editOrgranisationId = { target: { value: event.value } };
    let editOrgranisationName = { target: { value: event.label } };
    editOrgId.onChange(editOrgranisationId);
    editOrgName.onChange(editOrgranisationName);
    setAddCounterToOrg(event);
  }

  function addCreate(event) {
    let createOrgranisationId = { target: { value: event.value } };
    let createOrgranisationName = { target: { value: event.label } };
    createOrgId.onChange(createOrgranisationId);
    createOrgName.onChange(createOrgranisationName);
    setAddCounterToOrg(event);
  }

  const refreshFList = () => {
    counterList.setLoading(true);
    counterList.fetchData(listCounters);
    simpleOrg.fetchData(ListSimpleOrg);
  };

  const clearUserInputs = () => {
    createId.reset();
    createName.reset();
    createOrgId.reset();
    createOrgName.reset();
    createDescription.reset();
    createProduct.reset();
    editOrgName.reset();
    editOrgId.reset();
    editProduct.reset();
  };

  const productListLocal = [
    {
      label: "Micro Counter 1 Ch",
      value: "mi1ch"
    },
    {
      label: "Micro Counter 3 Ch",
      value: "mi3ch"
    },
    {
      label: "Macro Counter 1 Ch",
      value: "ma1ch"
    },
    {
      label: "Macro Counter 3 Ch",
      value: "ma3ch"
    },
    {
      label: "Macro Counter 4 Ch",
      value: "mach5"
    },
    {
      label: "Macro EXEL Counter 1 Ch",
      value: "mae1c"
    },
    {
      label: "Macro EXEL Counter 3 Ch",
      value: "mae3ch"
    },
    {
      label: "Macro EXEL Counter 4 Ch",
      value: "mae4ch"
    },
    {
      label: "Nano Counter",
      value: "nano"
    },
    {
      label: "Grader 96cm",
      value: "96cm"
    },
    {
      label: "Grader 140cm",
      value: "140cm"
    },
    {
      label: "Pipeline Counter 1 Ch. PC",
      value: "1 Channel PC"
    },
    {
      label: "Pipeline Counter 4 Ch. PC",
      value: "4 Channel PC"
    },
    {
      label: "Bioscanner T5",
      value: "T5 Scanner"
    },
    {
      label: "Wellboat Smolt C. S-1400 1 Ch",
      value: "S-14001ch"
    },
    {
      label: "Wellboat Smolt C. S-1400 2 Ch",
      value: "S-14002ch"
    },
    {
      label: "Wellboat Smolt C. S-2100 1 Ch",
      value: " S-21001ch"
    },
    {
      label: "Wellboat Smolt C. S-2100 2 Ch",
      value: " S-21002ch"
    },
    {
      label: "Wellboat Channel C. B-1400 1 Ch",
      value: "B-14001ch"
    },
    {
      label: "Wellboat Channel C. B-1400 2 Ch",
      value: "B-14002ch"
    },
    {
      label: "Wellboat Channel C. B-2000 1 Ch",
      value: "B-20001ch"
    },
    {
      label: "Wellboat Channel C. B-2000 2 Ch",
      value: "B-20002ch"
    },
    {
      label: "Wellboat Channel C. B-3000",
      value: "B-3000"
    },
    {
      label: "Wellboat Channel C. Y-1300",
      value: "Y-1300"
    },
    {
      label: "Wellboat Channel C. Y-1900",
      value: "Y-1900"
    },
    {
      label: "Pico Counter 1 Inch",
      value: "1 Inch"
    },
    {
      label: "Pico Counter 2 Inch",
      value: "2 Inch"
    }
  ];

  function addProductEdit(event) {
    let editProductValue = { target: { value: event.label } };
    editProduct.onChange(editProductValue);
    setAddProductToCurrent(event);
  }

  function addProductCreate(event) {
    let createProductValue = { target: { value: event.label } };
    createProduct.onChange(createProductValue);
    setAddProductToCurrent(event);
  }
  return (
    <div className="flex-container">
      <div className="admin-container__table">
        <div className="flex-container">
          <CED
            text="Create Counter"
            font="fa-user-plus"
            onClick={() => setEditState(false)}
          />
          <CED
            text="Edit Counter"
            font="fa-edit"
            onClick={() => setEditState(true)}
          />

          <CED text="Refresh List" font="fa-refresh" onClick={refreshFList} />
        </div>
        {Tables(
          counterList.data.listCounters.items,
          5,
          handleRowSelect,
          counterList.loading
        )}
      </div>

      <div className="admin-container__edit">
        {editState ? (
          <h3>
            {" "}
            <i className="fa fa-edit" /> Edit Counter{" "}
          </h3>
        ) : (
          <h3>
            {" "}
            <i className="fa fa-user-plus" /> Create Counter{" "}
          </h3>
        )}

        <h5 className="gray-text"> Required information</h5>
        <form onSubmit={editState ? handleSubmitEdit : handleSubmitCreate}>
          <div className="flex-container">
            <FieldGroup
              id={"counterID"}
              type={"text"}
              label={"Counter ID"}
              help={"A unique Counter ID. F.x. '1234' for Vaki"}
              value={editState ? editId.value : createId.value}
              //validateion={null}
              placeholder="Enter Counter ID"
              onChange={editState ? editId.onChange : createId.onChange}
              isDisabled={editState ? true : false}
            />
            {/* Setja select organisation hérna */}
          </div>
          <div>
            <label>Set organisation Name and Id</label>
            <Select
              className={"select-react-component select-counter-org"}
              placeholder="Select Organisation"
              value={addCounterToOrg}
              options={sorted_simpleOrg}
              //isMulti
              isSearchable
              ignoreAccents={false}
              onChange={editState ? addConnection : addCreate}
              isClearable={false}
            />
          </div>
          <div className="flex-container">
            <FieldGroup
              id={"organisationsName"}
              type={"text"}
              label={"Organisation Name"}
              help={""}
              value={editState ? editOrgName.value : createOrgName.value}
              //validateion={null}
              placeholder="Enter Organisation Name"
              onChange={
                editState ? editOrgName.onChange : createOrgName.onChange
              }
            />
            <FieldGroup
              id={"organisationId"}
              type={"text"}
              label={"Organisation ID"}
              help={""}
              value={editState ? editOrgId.value : createOrgId.value}
              //validateion={null}
              placeholder="Enter Organisation ID"
              onChange={editState ? editOrgId.onChange : createOrgId.onChange}
            />
          </div>

          <h5 className="gray-text"> Optional information. Use " " to skip</h5>

          <div className="flex-container">
            <FieldGroup
              id={"CounterName"}
              type={"text"}
              label={"Production Serial"}
              help={"Counter Production Serial"}
              value={editState ? editName.value : createName.value}
              //validateion={this.nameValidation()}
              placeholder="Enter Counter Name"
              onChange={editState ? editName.onChange : createName.onChange}
            />

            <FieldGroup
              id={"description"}
              type={"text"}
              label={"Description"}
              help={""}
              value={
                editState ? editDescription.value : createDescription.value
              }
              //validateion={null}
              placeholder="Enter a Description"
              onChange={
                editState
                  ? editDescription.onChange
                  : createDescription.onChange
              }
            />
          </div>
          <div>
            <Select
              className={"select-react-component select-counter-org"}
              placeholder="Select Product"
              value={addProductToCurrent}
              options={productListLocal}
              ignoreAccents={false}
              //isMulti
              isSearchable
              onChange={editState ? addProductEdit : addProductCreate}
              isClearable={false}
            />
            <FieldGroup
              id={"product"}
              type={"text"}
              label={"Product"}
              help={""}
              value={editState ? editProduct.value : createProduct.value}
              //validateion={null}
              placeholder="Product"
              onChange={
                editState ? editProduct.onChange : createProduct.onChange
              }
            />
          </div>

          <input
            type="submit"
            value={editState ? "Edit Counter" : "Create Counter"}
          />
        </form>
      </div>
    </div>
  );
}

/*
til að importa sqldata
import sqldata from "../sqlData/DIM-counter.json"
          <button onClick={importSQLdata}>Import Counter Data</button> 

  const importSQLdata = async () => {
    await sqldata.map(
        counter => {
          let counterInfo = {
            id: counter.id,
            counterID: counter.counterID,
            counterName: counter.counterName,
            organisationCountersId: `${counter.organisationCountersId}`,
            organisationId: counter.organisationId,
            organisationName: counter.organisationName,
            farmId: 0,
            description: " ",
            counterType: 1,
            processData: 1,
            product: counter.product,
            location: " "
          };
          
          API.graphql(graphqlOperation(createCounter, {input: counterInfo }));
        }
    );
}

*/
/* SETJA isActive */
/*
<div className="flex-container">
  <FieldGroup
    id={"counterType"}
    type={"text"}
    label={"CounterType"}
    help={"This will be added later"}
    //value={editState ? editCounterType.value : createCounterType.value}
    //validateion={null}
    placeholder="Enter CounterType"
    //onChange={editState ? editCounterType.onChange : createCounterType.onChange}
  />
</div> 
*/
