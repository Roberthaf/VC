import React, { useState } from "react";
import "./LicenceGenerator.css";
import useFetch from "./useFetch";
import { FieldGroup } from "../Components/Forms";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import { listLicences } from "../graphql/queries";
import { createLicence } from "../graphql/mutations";
import Amplify, { graphqlOperation, API } from "aws-amplify";
import aws_exports from "../aws-exports";
import Tables from "./Table";

Amplify.configure(aws_exports, {
  API: {
    endpoints: [
      {
        name: "Vakicloud-licencegen",
        endpoint: "https://kopxca6gw6.execute-api.eu-west-1.amazonaws.com/dev",
        service: "lambda",
        region: "eu-west-1"
      }
    ]
  }
});

export default function LicenceGenerator(props) {
  const licenceList = useFetch(listLicences, null, {
    listLicences: { items: [] }
  });
  const magicNumber = useInput("23458");
  const version = useInput("510");
  const cameraSerial = useInput("212345654");
  const currentDate = moment().format("YYYY-MM-DD");
  const counterID = useState(0);
  //const add15months = moment(currentDate).add(15, 'M').format("YYYY-MM-DD");
  //const [date, setDate] = useState(add15months);
  const [dateDiff, setDateDiff] = useState(0);
  const [licenceKey, setLicenceKey] = useState("");
  const [counters, setCounters] = useState(0);
  const [product, setProduct] = useState(0);

  const Nano1 = useInputCounters(false, 1),
    Micro1 = useInputCounters(false, 2),
    Micro3 = useInputCounters(false, 4),
    Macro1 = useInputCounters(false, 8),
    Macro4 = useInputCounters(false, 16),
    Wellboat1400 = useInputCounters(false, 32),
    Macro3 = useInputCounters(false, 64),
    Exel12004 = useInputCounters(false, 128),
    Wellboat2100 = useInputCounters(false, 256),
    Exel12001 = useInputCounters(false, 512),
    Wellboat21002 = useInputCounters(false, 1024),
    Exel12003 = useInputCounters(false, 2048),
    S14002 = useInputCounters(false, 4096);
  //AppAlbert = useInputCounters(false,32768);

  const smartFlow = useInputProduct(false, 1),
    biomass = useInputProduct(false, 2),
    vakicloud = useInputProduct(false, 4);
  //unlimitedTime = useInputProduct(true);
  const unlimitedTime = useInputTime(true);
  function handleRowSelect(obj) {
    // Skip for now
  }

  function useInput(initialValue, number) {
    const [value, setValue] = useState(initialValue);
    function handleChange(event) {
      const target = event.target.value;
      setValue(target);
    }
    return {
      value,
      onChange: handleChange
    };
  }

  /* Function to control the input values for Counters*/
  function useInputCounters(initialValue, number) {
    const [value, setValue] = useState(initialValue);
    function handleChange(event) {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      value ? setCounters(counters + number) : setCounters(counters - number);
      setValue(value);
    }

    return {
      value,
      onChange: handleChange
    };
  }

  function useInputProduct(initialValue, number) {
    const [value, setValue] = useState(initialValue);
    function handleChange(event) {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      value ? setProduct(product + number) : setProduct(product - number);
      setValue(value);
    }
    return {
      value,
      onChange: handleChange
    };
  }

  function useInputTime(initialValue, number) {
    const [value, setValue] = useState(initialValue);
    function handleChange(event) {
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      value ? setDateDiff(0) : setDateDiff(1);
      setValue(value);
    }
    return {
      value,
      onChange: handleChange
    };
  }

  function changeDate(e) {
    e.preventDefault();

    let differ = moment(e.target.value).diff(moment(currentDate), "months");

    if (differ > 15) {
      setDateDiff(0);
    } else {
      setDateDiff(Math.floor(differ));
    }
  }

  async function saveLicence(licenceKey) {
    let event = new Date();
    let newDate = moment(event).format("YYYY-MM-DD HH:MM");
    let licenceInfo = {
      id: licenceKey,
      licence: licenceKey,
      createdBy: props.userData.name,
      couterID: counterID.value,
      createdDate: newDate
    };
    await API.graphql(graphqlOperation(createLicence, { input: licenceInfo }));
    await licenceList.fetchData(listLicences);
  }

  async function fetchLicence(
    camserial,
    magic,
    pversion,
    duration,
    countertype,
    extra
  ) {
    //console.log("camserial",camserial, "magic",magic, "pversion",pversion, "duration",duration, "countertype",countertype, "extra",extra);
    var params = `cameraSerial=${camserial}&magicNumber=${magic}&programVersion=${pversion}&duration=${duration}&countertype=${countertype}&extra=${extra}`;
    //let lKey = "";
    await fetch(
      "https://kopxca6gw6.execute-api.eu-west-1.amazonaws.com/dev/generateLicene?" +
        params,
      {
        method: "POST"
      }
    )
      .then(response => response.json())
      .then(data => {
        //console.log('Success:', data);
        setLicenceKey(data);

        saveLicence(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
    //saveLicence(lKey);
  }

  function changeLicence() {}

  return (
    <div>
      Licence Generator Container
      <div className="licence-container">
        <Row>
          <Col md={4}>
            <div className="inputs-conatiner">
              <FieldGroup
                id={"Magic Number"}
                type={"text"}
                label={"Magic Number"}
                help={"Hvað er magic Number?"}
                value={magicNumber.value}
                placeholder="Magic Number"
                onChange={magicNumber.onChange}
              />

              <FieldGroup
                id={"Pro Version"}
                type={"text"}
                label={"Pro Version"}
                help={"Þarf þetta að vera breytilegt og geymt á netinu?"}
                value={version.value}
                placeholder="Version"
                onChange={version.onChange}
              />
            </div>
            <div className="inputs-conatiner">
              <FieldGroup
                id={"Camera Serial Number"}
                type={"text"}
                label={"Camera Serial Number"}
                help={"Þarf þetta að vera breytilegt og geymt á netinu?"}
                value={cameraSerial.value}
                placeholder="Camera Serial Number"
                onChange={cameraSerial.onChange}
              />

              <FieldGroup
                id={"CounterId"}
                type={"number"}
                label={"CounterId"}
                //help={"Þarf þetta að vera breytilegt og geymt á netinu?"}
                value={counterID.value}
                placeholder="Counter Id - optional"
                onChange={counterID.onChange}
              />
            </div>
            <div className="timebox">
              ExpireDate
              <form>
                <input
                  name="Unlimited Time"
                  type="checkbox"
                  checked={unlimitedTime.value}
                  onChange={unlimitedTime.onChange}
                />
                <label>Unlimited</label>
                <div>
                  {unlimitedTime.value ? (
                    <input
                      type="date"
                      name="bday"
                      onChange={changeDate}
                      disabled
                    />
                  ) : (
                    <input type="date" name="bday" onChange={changeDate} />
                  )}
                </div>
              </form>
            </div>

            <div className="calculate-box">
              <button
                onClick={() =>
                  fetchLicence(
                    cameraSerial.value,
                    magicNumber.value,
                    version.value,
                    dateDiff,
                    counters,
                    product
                  )
                }
              >
                Calculate
              </button>
              <input
                type="text"
                value={licenceKey}
                onChange={changeLicence}
              ></input>
            </div>
          </Col>

          <Col md={3}>
            <div className="flex-container">
              <div className="counters-checkboxes">
                Counter Types
                <form className="form-container">
                  <div>
                    <label>
                      <input
                        name="1 Nano"
                        type="checkbox"
                        checked={Nano1.value}
                        onChange={Nano1.onChange}
                      />
                      1 Nano
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="1 Micro"
                        type="checkbox"
                        checked={Micro1.value}
                        onChange={Micro1.onChange}
                      />
                      1 Micro
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="3 Micro"
                        type="checkbox"
                        checked={Micro3.value}
                        onChange={Micro3.onChange}
                      />
                      3 Micro
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="1 Macro"
                        type="checkbox"
                        checked={Macro1.value}
                        onChange={Macro1.onChange}
                      />
                      1 Macro
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="4 Macro"
                        type="checkbox"
                        checked={Macro4.value}
                        onChange={Macro4.onChange}
                      />
                      4 Macro
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="1 Wellboat 1400"
                        type="checkbox"
                        checked={Wellboat1400.value}
                        onChange={Wellboat1400.onChange}
                      />
                      1 Wellboat 1400
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="3 Macro"
                        type="checkbox"
                        checked={Macro3.value}
                        onChange={Macro3.onChange}
                      />
                      3 Macro
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="4 1200 Exel"
                        type="checkbox"
                        checked={Exel12004.value}
                        onChange={Exel12004.onChange}
                      />
                      4 1200 Exel
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="1 Wellboat 2100"
                        type="checkbox"
                        checked={Wellboat2100.value}
                        onChange={Wellboat2100.onChange}
                      />
                      1 Wellboat 2100
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="1 1200 Exel"
                        type="checkbox"
                        checked={Exel12001.value}
                        onChange={Exel12001.onChange}
                      />
                      1 1200 Exel
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="2 Wellboat 2100"
                        type="checkbox"
                        checked={Wellboat21002.value}
                        onChange={Wellboat21002.onChange}
                      />
                      2 Wellboat 2100
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="3 1200 Exel"
                        type="checkbox"
                        checked={Exel12003.value}
                        onChange={Exel12003.onChange}
                      />
                      3 1200 Exel
                    </label>
                  </div>

                  <div>
                    <label>
                      <input
                        name="2 S1400"
                        type="checkbox"
                        checked={S14002.value}
                        onChange={S14002.onChange}
                      />
                      2 S1400
                    </label>
                  </div>

                  {/*                 <div>
                <label>
                  <input
                    name="AppAlbert"
                    type="checkbox"
                    checked={AppAlbert.value}
                    onChange={AppAlbert.onChange}
                  />
                  App Albert
                </label>
                </div> */}
                </form>
              </div>
              <div className="products-checkboxes">
                Product Types
                <form>
                  <label>
                    <input
                      name="smartFlow"
                      type="checkbox"
                      checked={smartFlow.value}
                      onChange={smartFlow.onChange}
                    />
                    SmartFlow
                  </label>

                  <label>
                    <input
                      name="biomass"
                      type="checkbox"
                      checked={biomass.value}
                      onChange={biomass.onChange}
                    />
                    Biomass Estimation
                  </label>

                  <label>
                    <input
                      name="vakicloud"
                      type="checkbox"
                      checked={vakicloud.value}
                      onChange={vakicloud.onChange}
                    />
                    Vakicloud
                  </label>
                </form>
              </div>
            </div>
          </Col>
          <Col md={5}>
            {/* <button onClick={saveLicence}>Store licence</button> */}
            {Tables(
              licenceList.data.listLicences.items,
              6,
              handleRowSelect,
              false
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
