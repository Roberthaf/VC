import React, { useState, useEffect } from "react";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import { listUsers, ListSimpleOrg } from "../customGQL/customQueries";
import {
  createUserMain,
  addUserOrg,
  updateUser,
  deleteUserOrg
} from "../customGQL/customMutations";
import Tables from "./Table";
import "./Users.css";
import { useInput } from "./useInput";
import { FieldGroup } from "../Components/Forms";
import useFetch from "./useFetch";
import Select from "react-select";
import aws_exports from "../aws-exports";
import { CED } from "../Components/CED";

Amplify.configure(aws_exports, {});

export default function Users() {
  /*Calling for a uList, there are 3 options GrapqlCall, query, state */
  const uList = useFetch(listUsers, null, { listUsers: { items: [] } });
  const allOrgOptions = useFetch(ListSimpleOrg, null, {
    listOrganisations: { items: [] }
  });
  const [editState, setEditState] = useState(true);

  const [orgList, setOrgList] = useState([]);
  const [userOrg, setUserOrg] = useState([]);
  const [addUserOrgList, setAddUserOrg] = useState([]);
  const [removeUserOrgList, setRemoveUserOrg] = useState([]);
  /* Declare value for the inputs we need to edit users */

  useEffect(() => {
    /* If we change the state remove the org */
    if (editState === false) {
      /* Clear the UserOrg List */
      setOrgList([]);
      /* If we change to create user we clear the edit inputs */
      //clearUserInputs();
    }
  }, [editState]);

  const sorted_list = allOrgOptions.data.listOrganisations.items.sort(function(a,b) {
    return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
  });

  const editName = useInput(""),
    editId = useInput(""),
    editFirstName = useInput(""),
    editLastName = useInput(""),
    editEmail = useInput(""),
    editRole = useInput(""),
    editAdmin = useInput(""),
    editPhoneNumber = useInput("");

  /* Declare value for the inputs we need to create a new users */
  const createName = useInput(""),
    createId = useInput(""),
    createFirstName = useInput(""),
    createLastName = useInput(""),
    createEmail = useInput(""),
    createPhoneNumber = useInput(""),
    createAdmin = useInput(""),
    createRole = useInput("");

  function handleRowSelect(obj) {
    /*
        1. On Click trigger edit state.
        2. Load input feilds and populate.
        3. On button click send edit 
    */
    /* Decalre our variable for the input fields. OnChange needs *.target.value */
    setEditState(true);
    let editUserName = { target: { value: obj.name } },
      editUserId = { target: { value: obj.id } },
      editUserFirstName = { target: { value: obj.firstName } },
      editUserLastName = { target: { value: obj.lastName } },
      editUserEmail = { target: { value: obj.email } },
      editUserPhoneNumber = { target: { value: obj.phoneNumber } },
      editUserAdmin = { target: { value: obj.admin } },
      editUserRole = { target: { value: obj.role } };

    /* Call the onChange handler for each input value*/
    editName.onChange(editUserName);
    editId.onChange(editUserId);
    editFirstName.onChange(editUserFirstName);
    editLastName.onChange(editUserLastName);
    editEmail.onChange(editUserEmail);
    editPhoneNumber.onChange(editUserPhoneNumber);
    editAdmin.onChange(editUserAdmin);
    editRole.onChange(editUserRole);

    /* slice our data to get the orgId and orgName and create new object*/
    let simpleUserOrg = [],
      UserOrg = [];

    try {
      simpleUserOrg = obj.organisations.items.map(obj => {
        return {
          value: `${obj.organisation.orgID}`,
          label: obj.organisation.orgName
        };
      });
      UserOrg = obj.organisations.items.map(UserO => {
        return {
          ...UserO
        };
      });
    } catch (error) {
      console.log("NoUserOrg");
    }
    setUserOrg(UserOrg);
    setOrgList(simpleUserOrg);
    /*If we change the obj line we need to clear the state */
    setRemoveUserOrg([]);
    setAddUserOrg([]);
  }

  function handleChangeRole(props) {
    editRole.onChange({ target: { value: props.label } });
    editAdmin.onChange({ target: { value: props.value } });
  }

  function handleChangeCreateRole(props) {
    createRole.onChange({ target: { value: props.label } });
    createAdmin.onChange({ target: { value: props.value } });
  }

  const handleSubmitEdit = e => {
    e.preventDefault();
    const EditUsers = {
      name: editName.value,
      id: editId.value,
      firstName: editFirstName.value,
      lastName: editLastName.value,
      email: editEmail.value,
      phoneNumber: editPhoneNumber.value,
      role: editRole.value,
      admin: editAdmin.value
    };
    API.graphql(graphqlOperation(updateUser, { input: EditUsers }));
    /* Map over the userOrg List if there arer items we add them to the user. */
    addUserOrgList.map(obj =>
      createUserOrgConnection(obj, editName.value, editId.value)
    );
    /* Need to map over the removeUserOrgList also for items to remove */
    removeUserOrgList.map(obj => deleteUserOrgConnection(obj));

    /* Clear the userOrg list and the input feilds */
    setAddUserOrg([]);
    setRemoveUserOrg([]);

    editName.reset();
    editId.reset();
    editFirstName.reset();
    editLastName.reset();
    editEmail.reset();
    editPhoneNumber.reset();
    editRole.reset();
    editAdmin.reset();

    setOrgList([]);
    // We could set a spinner here or not
    //uList.setLoading(true);
    clearUserInputs();
    uList.fetchData(listUsers);
  };

  const handleSubmitCreate = async e => {
    e.preventDefault();
    const createUser = {
      name: createName.value,
      id: createId.value,
      firstName: createFirstName.value,
      lastName: createLastName.value,
      email: createEmail.value,
      phoneNumber: createPhoneNumber.value,
      role: createRole.value,
      admin: createAdmin.value,
      consent: true
    };

    await API.graphql(graphqlOperation(createUserMain, { input: createUser }));

    /* Map over the userOrg List if there arer items we add them to the user. */
    addUserOrgList.map(obj =>
      createUserOrgConnection(obj, createName.value, createId.value)
    );
    /* Need to map over the removeUserOrgList also for items to remove */
    removeUserOrgList.map(obj => deleteUserOrgConnection(obj));

    /* Clear the userOrg list and the input feilds */
    setAddUserOrg([]);
    setRemoveUserOrg([]);

    clearUserInputs();

    setOrgList([]);
    // We could set a spinner here or not
    uList.setLoading(true);
    uList.fetchData(listUsers);
  };

  function addConnection(event) {
    /* 
      Test if user is Adding or Removing a UserOrg.  "diff" or differnce tests
      if there is a difference in the organisation list "orgList", which is unique fer each user.
      we then add these information to arrays,  
    */
    let diff = [];
    if(event !== null){
      diff = orgList.filter(x => !event.includes(x)); 
    }else {
      diff = orgList;   
    }
    if (diff.length === 0) {
      //If diff length is 0 we are adding a organisation to user
      let diffadded = event.filter(x => !orgList.includes(x));
      setAddUserOrg([...addUserOrgList, diffadded]);
    } else if (diff.length === 1) {
      //If diff length is 1 we are removing an event
      let UserOrgArray = [];
      UserOrgArray = userOrg.find(
        o => o.organisation.orgName === diff[0].label
      );
      //We need  be able to clear the list with out submitting
      if (UserOrgArray === undefined) {
        //If userOrgArray is undifined we are removing a userOrg we
        //did not intend to submit with this user. We use pop to remove the item from
        //our list.
        addUserOrgList.pop();
      } else {
        const data = { id: UserOrgArray.id };
        setRemoveUserOrg([...removeUserOrgList, data]);
      }
    } else {

    }

    //We then set the orgList
    if(event !== null){
      setOrgList(event);
    } else {
      setOrgList([]);
    }
    
  }

  async function createUserOrgConnection(data, name, id) {
    /* A function that creates the UserOrg connection */
    let userOrg = {
      id: data[0].label + name,
      userOrgOrganisationId: data[0].value,
      userOrgUserId: id
    };
    await API.graphql(graphqlOperation(addUserOrg, userOrg));
  }

  async function deleteUserOrgConnection(data) {
    await API.graphql(graphqlOperation(deleteUserOrg, { input: data }));
  }

  const refreshUlist = () => {
    uList.setLoading(true);
    uList.fetchData(listUsers);
    allOrgOptions.fetchData(ListSimpleOrg);
  };

  /** Búa til fall sem hreinsar bæði editState og create state */
  const clearUserInputs = () => {
    editName.reset();
    editId.reset();
    editFirstName.reset();
    editLastName.reset();
    editEmail.reset();
    editPhoneNumber.reset();
    editRole.reset();
    editAdmin.reset();

    createName.reset();
    createId.reset();
    createFirstName.reset();
    createLastName.reset();
    createEmail.reset();
    createPhoneNumber.reset();
    createAdmin.reset();
    createRole.reset();
  };
  console.log("orgList all", orgList);
  return (
    <div className="flex-container">
      <div className="admin-container__table">
        <div className="flex-container">
          <CED
            text="Create User"
            font="fa-user-plus"
            onClick={() => setEditState(false)}
          />
          <CED
            text="Edit User"
            font="fa-edit"
            onClick={() => setEditState(true)}
          />
          <CED text="Refresh List" font="fa-refresh" onClick={refreshUlist} />
        </div>
        {Tables(uList.data.listUsers.items, 1, handleRowSelect, uList.loading)}
      </div>
      <div className="admin-container__edit">
        {editState ? (
          <h3>
            <i className="fa fa-edit" /> Edit User
          </h3>
        ) : (
          <h3>
            <i className="fa fa-user-plus" /> Create User
          </h3>
        )}
        <h5 className="gray-text"> Required information</h5>
        <form onSubmit={editState ? handleSubmitEdit : handleSubmitCreate}>
          <div className="flex-container">
            <FieldGroup
              id={"User Name"}
              type={"text"}
              label={"User Name"}
              value={editState ? editName.value : createName.value}
              placeholder="Enter User Name"
              onChange={editState ? editName.onChange : createName.onChange}
            />
            <FieldGroup
              id={"User Id"}
              type={"text"}
              label={"User ID"}
              value={editState ? editId.value : createId.value}
              placeholder="Enter User Id"
              onChange={editState ? editId.onChange : createId.onChange}
              isDisabled={editState ? true : false}
            />
          </div>

          <h5 className="gray-text">Personal information, Use " " to Skip.</h5>

          <div className="flex-container">
            <FieldGroup
              id={"First Name"}
              type={"text"}
              label={"First Name"}
              value={editState ? editFirstName.value : createFirstName.value}
              placeholder="Enter First Name"
              onChange={
                editState ? editFirstName.onChange : createFirstName.onChange
              }
            />
            <FieldGroup
              id={"Last Name"}
              type={"text"}
              label={"Last Name"}
              value={editState ? editLastName.value : createLastName.value}
              placeholder="Enter Last Name"
              onChange={
                editState ? editLastName.onChange : createLastName.onChange
              }
            />
          </div>
          <h5 className="gray-text">Personal information, Use " " to Skip.</h5>

          <div className="flex-container">
            <FieldGroup
              id={"User Email"}
              type={"text"}
              label={"User Email"}
              value={editState ? editEmail.value : createEmail.value}
              placeholder="Enter User Email"
              onChange={editState ? editEmail.onChange : createEmail.onChange}
            />
            <FieldGroup
              id={"User PhoneNumber"}
              type={"text"}
              label={"User PhoneNumber"}
              value={
                editState ? editPhoneNumber.value : createPhoneNumber.value
              }
              placeholder="Enter PhoneNumber"
              onChange={
                editState
                  ? editPhoneNumber.onChange
                  : createPhoneNumber.onChange
              }
            />
          </div>
          {editState ? (
            <div className="flex-container">
              <FieldGroup
                id={"user-role"}
                type={"text"}
                label={"Current Role"}
                help={null}
                //value={editState ? editRole.value : createRole.value}
                value={editRole.value}
                validateion={null}
                placeholder="User Role"
                //onChange={}
                isDisabled={true}
              />

              <Select
                placeholder={"Change Role"}
                onChange={handleChangeRole}
                className={"select-react-component role-component"}
                ignoreAccents={false}
                options={[
                  { value: false, label: "Customer" },
                  { value: true, label: "Admin" },
                  { value: true, label: "Vaki Employee" }
                ]}
              />
            </div>
          ) : (
            <div>
              <label>Current Role</label>
              <Select
                placeholder={"Set Role"}
                onChange={handleChangeCreateRole}
                ignoreAccents={false}
                className={"select-react-component role-component"}
                options={[
                  { value: false, label: "Customer" },
                  { value: true, label: "Admin" },
                  { value: true, label: "Vaki Employee" }
                ]}
              />
            </div>
          )}

          <FieldGroup
            id={"userAdmin"}
            type={"text"}
            label={"Admin Status"}
            help={null}
            value={editState ? `${editAdmin.value}` : `${createAdmin.value}`}
            validateion={null}
            placeholder="Admin Status"
            //onChange={}
            isDisabled={true}
          />

          <div>
            <h5>
              <i className="fa fa-plus" /> Add/Remove Organisations To/From User
            </h5>
            <Select
              className={"select-react-component"}
              placeholder="Select Organsations"
              value={orgList}
              options={sorted_list}
              isMulti
              isSearchable
              onChange={addConnection}
              isClearable={false}
            />
            <label>
              ATH: If the user is admin don't add any Organisations.
            </label>
            <br></br>
            <label>Admins have full access to Organisations</label>
          </div>

          <input
            type="submit"
            value={editState ? "Comfirm Edit User" : "Comfirm Create User"}
            className="buttonEdit"
          />
        </form>
      </div>
    </div>
  );
}
