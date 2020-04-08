import React from 'react';
import { Table } from 'react-bootstrap';
import { Loading } from '../Components/Loading';

/*
    Render the Table that hold the User, organisation, farm and populations.
*/

const Tables = (props, number, handleChange, handleDelete, loading) => {
    let header = [];
    switch (number) {
        case 1:
            // UserList
            header = ["#","Name","ID","Email","Role","Delete"];
            break;
        case 2:
            // orgList
            header = ["#","Name","ID","Email","Delete"];
            break;
        case 3:
            // FarmList
            header = ["#","Name","ID","Email","Delete"];
            break;
        case 4:
            // PopList
            header = ["#","Name","ID","Delete"];
            break;
        default:
            header = [];
            break;
    }

    return(
    <div>
    { loading ? 
            <div className="tabel-loading">
                <Loading />
            </div>
        :
        <Table responsive hover className="AdminTables tableWidth">
        <thead>
          <tr>
            {header.map(
                (obj, i) => <th key={`header${i}`}>{obj}</th>
            )}
          </tr>
        </thead>
        <tbody>
        {    props.map((obj, index) => (
                <tr key={index} className="pointer">               
                    <td >{index}</td>
                    <td onClick={() => handleChange(obj)} >{obj.name||obj.orgName||obj.farmName||obj.popName}</td>
                    <td onClick={() => handleChange(obj)} >{obj.id}</td>
                    {obj.email && <td onClick={() => handleChange(obj)} >{obj.email}</td>}
                    {obj.role && <td onClick={() => handleChange(obj)} >{obj.role} </td>}
                    <td className="td-delete-icon" width="30"> 
                        <i 
                            className="fa fa-trash delete-icon" 
                            id={obj.id}  
                            onClick={ () => handleDelete(obj.id, obj)}
                        ></i>
                    </td>
                </tr>
              )) 
        }
        </tbody>
      </Table>
    }
  </div>
  );
}

export default Tables;