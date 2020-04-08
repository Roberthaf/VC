import React, { useState } from "react";
import useFetch from "./useFetch";
import { CED } from "../Components/CED";
import Tables from "./Table";
import { FieldGroup } from "../Components/Forms";
import { useInput } from "./useInput";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import {
  createFarm,
  updateFarm,
  updatePopulation2
} from "../customGQL/customMutations";
import {
  listFarms,
  listPopulations,
  ListSimplePop
} from "../customGQL/customQueries";
import Select from "react-select";
import _ from "lodash";
import "./Farms.css";
import aws_exports from "../aws-exports";

Amplify.configure(aws_exports, {});

export default function Farms() {
  const fList = useFetch(listFarms, null, { listFarms: { items: [] } });
  const popList = useFetch(listPopulations, null, {
    listPopulations: { items: [] }
  });
  const simplePopList = useFetch(ListSimplePop, null, {
    listPopulations: { items: [] }
  });

  const [editState, setEditState] = useState(true);
  const editName = useInput(""),
    editId = useInput(""),
    editEmail = useInput(""),
    editPhoneNumber = useInput("");

  /* Declare value for the inputs we need to create a new users */
  const createName = useInput(""),
    createId = useInput(""),
    createEmail = useInput(""),
    createPhoneNumber = useInput("");

  /* Create  */
  const [PopsAddToList, setPopsAddToList] = useState([]);
  const [originalPopFarms, setOriginalPopFarms] = useState([]);

  function handleRowSelect(obj) {
    /* This functions runs when a user clicks on a row
        in the farms table. Save the info to an object
        ,we need to store it as targe.value.""
    */
    setEditState(true);

    let editFarmName = { target: { value: obj.farmName } },
      editFarmId = { target: { value: obj.id } },
      editFarmEmail = { target: { value: obj.email } },
      editFarmPhoneNumber = { target: { value: obj.phoneNumber } };

    editName.onChange(editFarmName);
    editId.onChange(editFarmId);
    editEmail.onChange(editFarmEmail);
    editPhoneNumber.onChange(editFarmPhoneNumber);

    /* Get the pop that are connected to the farms */

    const simplePopSelected = obj.population.items.map(pop => {
      return {
        value: `${pop.popID}`,
        label: pop.popName
      };
    });

    setPopsAddToList(simplePopSelected);
    setOriginalPopFarms(simplePopSelected);
  }

  const handleSubmitCreate = async e => {
    e.preventDefault();
    const FullPopList = popList.data.listPopulations.items;

    const FarmInfo = {
      id: createId.value,
      farmName: createName.value,
      farmID: createId.value,
      email: createEmail.value,
      phoneNumber: createPhoneNumber.value,
      isActive: true,
      timezone: " ",
      lat: 0,
      long: 0
    };

    await API.graphql(graphqlOperation(createFarm, { input: FarmInfo }));
    // Now we add
    //var dif = _.differenceWith(PopsAddToList, originalPopFarms, _.isEqual);
    let FarmsAdd = PopsAddToList.map(el =>
      FullPopList.find(o => o.id === el.value)
    );
    // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
    FarmsAdd.forEach(el => {
      let singlePop = {
        ...el
      };
      // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
      singlePop.farmPopulationId = createId.value;
      API.graphql(graphqlOperation(updatePopulation2, singlePop));
    });
    await fList.fetchData(listFarms);
  };

  const handleSubmitEdit = async e => {
    e.preventDefault();

    const editFarms = {
      id: editId.value,
      farmName: editName.value,
      farmID: editId.value,
      email: editEmail.value,
      phoneNumber: editPhoneNumber.value,
      isActive: true,
      timezone: " ",
      lat: 0,
      long: 0
    };

    //await API.graphql(graphqlOperation(updateFarm, { input: editFarms }));
    await API.graphql(graphqlOperation(updateFarm, editFarms));
    const FullPopList = popList.data.listPopulations.items;

    if (originalPopFarms.length === PopsAddToList.length) {
      // If the lengths are equal we do nothing
      var same = _.differenceWith(originalPopFarms, PopsAddToList, _.isEqual);
      let Farms = same.map(el => FullPopList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      Farms.forEach(el => {
        let singlePop = {
          ...el
        };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singlePop.farmPopulationId = 0;
        API.graphql(graphqlOperation(updatePopulation2, singlePop));
      });

      // Now we add
      let FarmsAdd = same.map(el => FullPopList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      FarmsAdd.forEach(el => {
        let singlePop = {
          ...el
        };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singlePop.farmPopulationId = editId.value;
        API.graphql(graphqlOperation(updatePopulation2, singlePop));
      });
      await fList.fetchData(listFarms);
    } else if (originalPopFarms.length > PopsAddToList.length) {
      // Þetta fall hér að neðan. Skoðar muninn á milli Farms sem voru upphaflega skráð á
      // Organisationið. og bætir við eða fjarlægir farms eftir því sem á við

      // dif er munurinn á milli þessa tveggja lista
      var dif = _.differenceWith(originalPopFarms, PopsAddToList, _.isEqual);
      // Hérna erum við að Fjarlægja Farms.
      // Dif inniheldur SimpleFarm information sem er svoana -> {value: "4444", label: "TestFarm"}

      let Farms = dif.map(el => FullPopList.find(o => o.id === el.value));
      // loopum í gegnum öll farms sem á að fjarlægja af org-inu.
      Farms.forEach(el => {
        let singlePop = {
          ...el
        };
        // Við þurfum að bæta við organisationFarmsId = 0 til þess að "Fjarlægja" farmið af Organisation
        singlePop.farmPopulationId = 0;
        API.graphql(graphqlOperation(updatePopulation2, singlePop));
      });
      await fList.fetchData(listFarms);
    } else if (originalPopFarms.length < PopsAddToList.length) {
      // if the original length is shorter we are adding a farm
      var dif2 = _.differenceWith(PopsAddToList, originalPopFarms, _.isEqual);

      let Farms = dif2.map(el => FullPopList.find(o => o.id === el.value));

      Farms.forEach(el => {
        let singlePop = {
          ...el
        };
        // Til að bæta við farmi á org þá notaum við editId sem er í raun OrgId.
        singlePop.farmPopulationId = editId.value;
        API.graphql(graphqlOperation(updatePopulation2, singlePop));
      });
    }
    await fList.fetchData(listFarms);
  };

  const refreshFList = () => {
    fList.setLoading(true);
    fList.fetchData(listFarms);
  };

  const addConnection = event => {
    setPopsAddToList(event);
  };

  return (
    <div className="flex-container">
      <div className="admin-container__table">
        <div className="flex-container">
          <CED
            text="Create Farm"
            font="fa-user-plus"
            onClick={() => setEditState(false)}
          />
          <CED
            text="Edit Farm"
            font="fa-edit"
            onClick={() => setEditState(true)}
          />
          <CED text="Refresh List" font="fa-refresh" onClick={refreshFList} />
        </div>
        {Tables(fList.data.listFarms.items, 3, handleRowSelect, fList.loading)}
      </div>

      <div className="admin-container__edit">
        {editState ? (
          <h3>
            {" "}
            <i className="fa fa-edit" /> Edit Farm{" "}
          </h3>
        ) : (
          <h3>
            {" "}
            <i className="fa fa-user-plus" /> Create Farm{" "}
          </h3>
        )}

        <h5 className="gray-text"> Required information</h5>
        <form onSubmit={editState ? handleSubmitEdit : handleSubmitCreate}>
          <div className="flex-container">
            <FieldGroup
              id={"farmName"}
              type={"text"}
              label={"Farm Name"}
              help={"A unique Farm Name."}
              value={editState ? editName.value : createName.value}
              //validateion={this.nameValidation()}
              placeholder="Enter Farm Name"
              onChange={editState ? editName.onChange : createName.onChange}
            />

            <FieldGroup
              id={"farmID"}
              type={"text"}
              label={"Farm ID"}
              help={"A unique Farm ID. F.x. '6' for Vaki"}
              value={editState ? editId.value : createId.value}
              //validateion={null}
              placeholder="Enter Farm ID"
              onChange={editState ? editId.onChange : createId.onChange}
              isDisabled={editState ? true : false}
            />
          </div>

          <h5 className="gray-text"> Optional information. Use " " to skip</h5>
          <div className="flex-container">
            <FieldGroup
              id={"farmEmail"}
              type={"text"}
              label={"Farm Email"}
              //help={null}
              value={editState ? editEmail.value : createEmail.value}
              //validateion={null}
              placeholder="Enter Farm Email"
              onChange={editState ? editEmail.onChange : createEmail.onChange}
            />

            <FieldGroup
              id={"farmPhoneNumber"}
              type={"text"}
              label={"Farm Phone Number"}
              //help={null}
              value={
                editState ? editPhoneNumber.value : createPhoneNumber.value
              }
              //validateion={null}
              placeholder="Enter Farm Phone Number"
              onChange={
                editState
                  ? editPhoneNumber.onChange
                  : createPhoneNumber.onChange
              }
            />
          </div>
          <div>
            <h5>
              <i className="fa fa-plus" /> Add/Remove Populations To/From Farms
            </h5>
            <Select
              className={"select-react-component"}
              placeholder="Select Populations"
              value={PopsAddToList}
              options={simplePopList.data.listPopulations.items}
              isMulti
              isSearchable
              ignoreAccents={false}
              onChange={addConnection}
              isClearable={false}
            />
          </div>

          <input
            type="submit"
            value={editState ? "Edit Farm" : "Create Farm"}
          />
        </form>
      </div>
    </div>
  );
}
