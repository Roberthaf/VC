import React, { useState } from "react";
import useFetch from "./useFetch";
import { CED } from "../Components/CED";
import "./Populations.css";
import { FieldGroup } from "../Components/Forms";
import { useInput } from "./useInput";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import {
  createPopulation,
  updatePopulation
} from "../customGQL/customMutations";
import { listPopulations } from "../customGQL/customQueries";
import Table2 from "./Table";
import aws_exports from "../aws-exports";
Amplify.configure(aws_exports, {});

export default function Populations() {
  const pList = useFetch(listPopulations, null, {
    listPopulations: { items: [] }
  });
  const [editState, setEditState] = useState(true);
  const editName = useInput(""),
    editId = useInput("");

  /* Declare value for the inputs we need to create a new users */
  const createName = useInput(""),
    createId = useInput("");

  function handleRowSelect(obj) {
    /* This functions runs when a user clicks on a row
            in the pops table. Save the info to an object
            ,we need to store it as targe.value.""
        */
    setEditState(true);

    let editPopName = { target: { value: obj.name } },
      editPopId = { target: { value: obj.id } };

    editName.onChange(editPopName);
    editId.onChange(editPopId);
  }

  const handleSubmitCreate = async e => {
    e.preventDefault();
    const createPop = {
      id: createId.value,
      popName: createName.value,
      popID: createId.value,
      isActive: true,
      species_id: 0,
      population_GUID: " "
    };
    await API.graphql(graphqlOperation(createPopulation, { input: createPop }));
    await pList.fetchData(listPopulations);

    /* After submit we clear the createPop const.*/
  };

  const handleSubmitEdit = async e => {
    e.preventDefault();

    const editPops = {
      id: editId.value,
      popName: editName.value,
      popID: editId.value,
      isActive: true,
      species_id: 0,
      population_GUID: " "
    };

    await API.graphql(graphqlOperation(updatePopulation, editPops));
    await pList.fetchData(listPopulations);
  };

  const refreshPList = () => {
    pList.setLoading(true);
    pList.fetchData(listPopulations);
  };

  return (
    <div className="flex-container population-container">
      <div className="population-container__table">
        <div className="flex-container">
          <CED
            text="Create Pop."
            font="fa-user-plus"
            onClick={() => setEditState(false)}
          />
          <CED
            text="Edit Pop."
            font="fa-edit"
            onClick={() => setEditState(true)}
          />
          <CED text="Refresh List" font="fa-refresh" onClick={refreshPList} />
        </div>

        {Table2(
          pList.data.listPopulations.items,
          4,
          handleRowSelect,
          pList.loading
        )}
      </div>
      <div className="population-container__edit">
        {editState ? (
          <h3>
            <i className="fa fa-edit" /> Edit Population
          </h3>
        ) : (
          <h3>
            <i className="fa fa-user-plus" /> Create Population
          </h3>
        )}

        <h5 className="gray-text"> Required information</h5>
        <form onSubmit={editState ? handleSubmitEdit : handleSubmitCreate}>
          <div className="flex-container">
            <FieldGroup
              id={"popName"}
              type={"text"}
              label={"Pop Name"}
              help={"A unique Pop Name."}
              value={editState ? editName.value : createName.value}
              //validateion={this.nameValidation()}
              placeholder="Enter Pop Name"
              onChange={editState ? editName.onChange : createName.onChange}
            />

            <FieldGroup
              id={"popID"}
              type={"text"}
              label={"Pop ID"}
              help={"A unique Pop ID. F.x. '6' for Vaki"}
              value={editState ? editId.value : createId.value}
              //validateion={null}
              placeholder="Enter Pop ID"
              onChange={editState ? editId.onChange : createId.onChange}
              isDisabled={editState ? true : false}
            />
          </div>
          <input type="submit" value={editState ? "Edit Pop" : "Create Pop"} />
        </form>
      </div>
    </div>
  );
}
