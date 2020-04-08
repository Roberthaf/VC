import React from "react";
import "./Equipment.css";
import { Loading } from "../Components/Loading";
import $ from "jquery"

/*
  The Equpment container is a iframe that connects to Quickbase and creates
  the link and displayes the relavant table. the only prop we need is the organisation ID.

  >App Tree<
  App
  |
  -> Counters
           |
           -> Equipment
           -> CountTable

 */

export default class Equipment extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        queryList:'',
        isLoading:true,

      };
    };
    
    componentDidMount(){
      let { selectedOrg } = this.props;
      this.setState({
        queryList:`{'110'.EX.'${selectedOrg.value}'}`,
       });

    };

    componentDidUpdate(){
      let { selectedOrg } = this.props;
      this.setState({
        queryList:`{'110'.EX.'${selectedOrg.value}'}`,
       });
    }

    setLoading = () => {
      setTimeout( () => {
        this.setState( prevState => ({
          isLoading:false
        }));
      }, 2000);
    };
    
    buildQuery = async query => {
      let element = '';
      for (let i = 0; i < query.length; i++) {
        if(query.length === 1){
          element = element.concat(query[i]);
        }else{
          if((i % 2) === 0){
            element = element.concat(query[i]);
          }else if ((i % 2) === 1){
            element = element.concat( 'OR' + query[i] + 'OR');
          }
        }
      };

      this.setState({
        queryList:element,
      })
    };
    
    buildURL = () => {
      let { selectedOrg } = this.props;
      let { queryList } = this.state;
      let url = `https://vaki.quickbase.com/db/bkcc59wk9?a=API_GenResultsTable&query=${queryList}
                &slist=172&clist=111.113.235.327.429.172.262.449.448.441.439.456.458&options=sortorder-D.ned.nvw.phd
                &usertoken=b2u2cv_hd6a_cyrnirkytxgimc9p8sq8bq5s7ur`;
      //API_Authenticate&username=${userName}&password=${password}&hours=4360
      //usertoken=b2u2cv_hd6a_cyrnirkytxgimc9p8sq8bq5s7ur
      let cookUrl =  `https://vaki.quickbase.com/db/bkcc59wk9?a=API_GenResultsTable&query=${queryList}
                      &slist=172&clist=111.113.235.327.429.172.262.443.447.438.439.455.449.448.441.439.456.458
                      &options=sortorder-D.ned.nvw.phd&usertoken=b2u2cv_hd6a_cyrnirkytxgimc9p8sq8bq5s7ur`;
      //API_Authenticate&username=${userName}&password=${password}&hours=4360
      //usertoken=b2u2cv_hd6a_cyrnirkytxgimc9p8sq8bq5s7ur
      let returnUrl ="";
      switch (selectedOrg.value) {
        case '363':
          returnUrl = cookUrl;
          break;
        case '274':
          returnUrl = cookUrl;
          break;
        case '660':
          returnUrl = cookUrl;
          break;
        case '298':
          returnUrl = cookUrl;
          break;
        case '175':
          returnUrl = cookUrl;
          break;
        default:
          returnUrl = url;
          //returnUrl = testUrl;
          break;
      }
      return returnUrl;     
    };
    
    render() {
      let { isLoading } = this.state;
      let customerUrl = this.buildURL();
      this.setLoading();
      
      return (
        <div className="equipment-container">
            <div className="overlay">
            {
              isLoading ? 
              <Loading /> :<iframe 
                className="counters-iframe" 
                title="qbcounters" 
                src={customerUrl} 
                width={'100%'} 
                type="text/xml" 
                crossOrigin="anonymous">
              </iframe>
            }

            </div>
          </div>
      );
    }
  }