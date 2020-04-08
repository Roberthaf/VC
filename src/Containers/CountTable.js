import React from "react";
import "./CountTable.css";
import {
  SortingState,
  IntegratedSorting,
  PagingState,
  FilteringState,
  IntegratedFiltering,
  SelectionState,
  IntegratedPaging
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableFilterRow,
  TableSelection
} from "@devexpress/dx-react-grid-bootstrap4";
import propTypes from "prop-types";

/*
  The CountTable renders the main table(devexpress table).  
  
  >App Tree<
  App
  |
  -> Counters
           |
           -> Equipment
           -> CountTable
              - Maintable
*/

class CountTable extends React.PureComponent {
  constructor(props) {
    super(props);
    // Set out initial state for our CountTable state Date – Tank – Origin – Destination – Operator – No.Fish
    this.state = {
      columns: [
        { name: "Timestamp", title: "Date [YY-MM-DD]" },
        { name: "Tank", title: "Tank" },
        { name: "Source", title: "Origin" },
        { name: "Destination", title: "Destination" },
        //{ name: "Counter_ID", title: "Counter ID" },
        //{ name: "Counter_Name", title: "Product Serial" },
        //{ name: "PersonInCharge", title: "User" },
        { name: "Operator", title: "Operator" },
        { name: "FishCount", title: "No.Fish [PC]", dataType: "number" }
      ],
      CountTableRows: [],
      rowContent: 0,
      selection: [],
      sorting: [{ columName: "Date", direction: "desc" }],
      loading: false,
      currentPage: 0,
      pageSize: 5,
      pageSizes: [5, 10, 15, 20]
    };
    // Change our sorting state
    this.changeSelection = this.changeSelection.bind(this);
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeSorting = sorting => this.setState({ sorting });
  }

  // Handle selecting and changing the lines the counter
  changeSelection(select) {
    let { selection } = this.state;
    const lastSelected = select.find(
      selected => selection.indexOf(selected) === -1
    );
    if (lastSelected !== undefined) {
      this.setState({ selection: [lastSelected] });
    } else if (lastSelected === undefined) {
      this.setState({ selection: [] });
      // NOTE: Uncomment the next line in order to allow clear selection by double-click
      // this.setState({ selection: [] });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { CountTableRows, selection } = this.state;
    let { CountRows, getMSEFile, getSelectedRow } = this.props;
    // If our state changes reload to our local state
    if (prevProps.CountRows !== CountRows) {
      this.setState({
        CountTableRows: CountRows,
        selection: []
      });
    }
    if (prevState.selection !== selection) {
      this.setState({
        rowContent: CountTableRows[selection]
      });

      if (selection.length > 0) {
        let urls = {
          blcFile: CountTableRows[selection].blcFile,
          cntFile: CountTableRows[selection].cntFile,
          mseFile: CountTableRows[selection].mseFile,
          pdfFile: CountTableRows[selection].pdfFile,
          pdfFilePath: CountTableRows[selection].pdfFilePath,
          blcFilePath: CountTableRows[selection].blcFilePath,
          cntFilePath: CountTableRows[selection].cntFilePath
        };

        getMSEFile(CountTableRows[selection].S3Path, urls);
        getSelectedRow(selection);
      }
    }
  }

  render() {
    const {
      CountTableRows,
      columns,
      selection,
      sorting,
      pageSize,
      pageSizes,
      currentPage
    } = this.state;

    return (
      <div className="CountRecords">
        <div>
          <Grid rows={CountTableRows} columns={columns}>
            <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />
            <FilteringState defaultFilters={[]} />
            <IntegratedFiltering />
            <SortingState
              sorting={sorting}
              onSortingChange={this.changeSorting}
            />
            <IntegratedSorting />
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <IntegratedPaging />
            <Table />
            <TableFilterRow />
            <TableSelection
              selectByRowClick
              highlightRow
              highlightSelected
              showSelectionColumn={true}
            />
            <PagingPanel pageSizes={pageSizes} messages={"Page Size"} />
            <TableHeaderRow allowSorting showSortingControls />
          </Grid>
        </div>
      </div>
    );
  }
}
export default CountTable;

propTypes.CountTable = {
  CountRows: propTypes.list,
  getMSEFile: propTypes.function,
  getMultipleMSEFile: propTypes.function,
  setMSEFileURL: propTypes.function,
  setPDFFileURL: propTypes.function,
  setBLCFileURL: propTypes.function
};

/*     let fileURLS = CountTableRows[lastSelected].FileList.map((x, index) => ({
      // Grab the last 3 char from the path to save
      urlName: `${x.S3Path.substr(x.S3Path.length - 3)}`,
      // Build the path we will be using to fetch data
      path: `${baseURL}${this.state.rowContent}&S3Bucket=${x.S3Bucket}&S3Path=${
        x.S3Path
      }`,
      // Save the s3Path to use with file downloading
      s3Path: `${x.S3Path}`
    }));
    // Itterate over our Arry and grab the urls according to file ending
    let mseFileURL = [],
      pdfFileURL,
      blcFileURL = [],
      mseS3Path = [],
      pdfS3Path,
      blcS3Path = [];
    // Grab and Store the different file formats for downloading
    for (let i = 0; i < fileURLS.length; i++) {
      if (fileURLS[i].urlName === "MSE") {
        mseFileURL.push(fileURLS[i].path);
        mseS3Path.push(fileURLS[i].s3Path);
      } else if (fileURLS[i].urlName === "PDF") {
        pdfFileURL = fileURLS[i].path;
        pdfS3Path = fileURLS[i].s3Path;
      } else if (fileURLS[i].urlName === "BLC") {
        blcFileURL.push(fileURLS[i].path);
        blcS3Path.push(fileURLS[i].s3Path);
      }
    }

    if (mseFileURL.length === 1) {
      // Handle regular files
      this.props.getMSEFile(mseFileURL);
      this.props.setMSEFileURL(mseFileURL, mseS3Path);
    } else {
      // Handle multiple mse files
      this.props.getMultipleMSEFile(mseFileURL);
      this.props.setMSEFileURL(mseFileURL, mseS3Path);
    }
    this.props.setPDFFileURL(pdfFileURL, pdfS3Path);
    this.props.setBLCFileURL(blcFileURL, blcS3Path); */
