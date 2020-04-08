import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Loading } from "../Components/Loading";
import "./Table.css";

const Table2 = (props, number, handleChange, loading) => {
  let columns = [];
  let count = 0;
  let type = "";
  const { SearchBar } = Search;
  switch (number) {
    case 1:
      // User List
      columns = [
        { dataField: "name", text: "Name", sort: true },
        { dataField: "id", text: "ID", sort: true },
        { dataField: "email", text: "Email", sort: true },
        { dataField: "admin", text: "Admin", sort: true },
        { dataField: "role", text: "Role", sort: true }
      ];
      type = "User";
      break;
    case 2:
      // Organisation List
      columns = [
        { dataField: "name", text: "Name", sort: true },
        {
          dataField: "counterNumber",
          text: "#Counters",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        },
        { dataField: "id", text: "ID", sort: true },
        {
          dataField: "isActive",
          text: "IsActive",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        }
      ];
      type = "Organisation";
      break;
    case 3:
      // Farm List
      columns = [
        { dataField: "name", text: "Name", sort: true },
        { dataField: "id", text: "ID", sort: true },
        { dataField: "email", text: "Email", sort: true },
        {
          dataField: "isActive",
          text: "IsActive",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        }
      ];
      type = "Farms";
      break;
    case 4:
      // PopList
      columns = [
        { dataField: "name", text: "Name", sort: true },
        { dataField: "id", text: "ID", sort: true },
        {
          dataField: "isActive",
          text: "IsActive",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        }
      ];
      break;
    case 5:
      // Counters
      columns = [
        {
          dataField: "id",
          text: "Id",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        },
        { dataField: "product", text: "Product", sort: true },
        { dataField: "name", text: "Pro. Serial", sort: true },
        {
          dataField: "orgId",
          text: "Org. Id",
          sort: true,
          headerStyle: () => {
            return { width: "10%" };
          }
        },
        { dataField: "orgName", text: "Org. Name", sort: true },
        { dataField: "description", text: "Description", sort: true }
      ];
      type = "Counters";
      break;
    case 6:
      // LicenceList
      columns = [
        { dataField: "licence", text: "Licence", sort: true },
        { dataField: "counterID", text: "CounterID", sort: true },
        { dataField: "createdBy", text: "createdBy", sort: true },
        { dataField: "createdDate", text: "createdDate", sort: true }
      ];
      type = "Licences";
      break;
    default:
      columns = [];
      break;
  }
  const defaultSorted = [
    {
      dataField: "name", // if dataField is not match to any column you defined, it will be ignored.
      order: "asc" // desc or asc
    }
  ];

  const selectRow = {
    mode: "radio",
    hideSelectColumn: true,
    clickToSelect: true,
    bgColor: "lightgrey"
  };

  const products = props.map((obj, index) => {
    if (obj.counters) {
      count = obj.counters.items.length;
    }
    let object = {
      number: `${index}`,
      name:
        obj.name ||
        obj.orgName ||
        obj.popName ||
        obj.farmName ||
        obj.counterName,
      //id: `${obj.orgID||obj.id}`,
      id: obj.orgID || obj.id || obj.counterID,
      email: obj.email,
      phoneNumber: obj.phoneNumber,
      address: obj.address,
      admin: obj.admin,
      firstName: obj.firstName,
      lastName: obj.lastName,
      isActive: obj.isActive,
      counterNumber: count,
      product: obj.product,
      orgId: `${obj.organisationId}`,
      orgName: obj.organisationName,
      role: obj.role,
      organisations: obj.organisations,
      description: obj.description,
      counters: obj.counters,
      licence: obj.licence,
      counterID: obj.counterID,
      createdBy: obj.createdBy,
      createdDate: obj.createdDate
    };
    return object;
  });
  //onClick={ () => handleDelete(obj.id) }
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      handleChange(row);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="tabel-loading">
          <Loading />
        </div>
      ) : (
        <ToolkitProvider keyField="id" data={products} columns={columns} search>
          {props => (
            <div>
              {/* <h5>Search table:</h5> */}
              <hr />
              <SearchBar
                {...props.searchProps}
                className="search-box fontAwesome fa"
                placeholder={`Search ${type}`}
                tableId={`${number}`}
              />

              <div className="admin-veiw-table">
                <BootstrapTable
                  defaultSorted={defaultSorted}
                  {...props.baseProps}
                  rowEvents={rowEvents}
                  selectRow={selectRow}
                />
              </div>
            </div>
          )}
        </ToolkitProvider>
      )}
    </div>
  );
};
export default Table2;
