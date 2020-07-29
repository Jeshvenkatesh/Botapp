import React from "react";
import classes from "./ViewOpenTran.module.css";
import Axios from 'axios';
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css';
import { ViewOpenTranAPI, OpenTranCancelAPI } from "../../Utilities/API";
import { getCurrentDate } from "../../Utilities/CurrentDate";
import Loader from '../../Utilities/Loader';
import { withRouter } from 'react-router-dom';


class ViewOpenTran extends React.Component {
    state = {
        // currentDate: getCurrentDate(),
        // getDate: getCurrentDate(),
        date:getCurrentDate(),
        todate:getCurrentDate(),
        responseAllClients: [],
        getAllExchanges: JSON.parse(sessionStorage.getItem("allExchanges")),
        clientName: JSON.parse(sessionStorage.getItem("allClients")),
        clientExchanges: [],
        showLoader: true,
        nameIDPairs: JSON.parse(sessionStorage.getItem("nameIdPairs")),
        getOpenTransData: [],
        currentClient: '',
        currentExe: "",
        iterateResponse: false,
        showErrMsg: false,
        showCancelMsg: false,
        showCancelErrMsg: false,
        currentExeIdForCancel: null,
        passId: null,
        passLimit: null,
        currentClientExchanges:this.props.currentClientExchanges,
    }
    handlePosClient = (e) => {
        if (e.target.value !== "a") {
            const exchanges = this.state.clientName[e.target.value].exchanges;
            this.setState({ clientExchanges: exchanges })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const nameIDPairs = this.state.nameIDPairs;
        // console.log(this.state.nameIDPairs); chance to get null here

        if (nameIDPairs !== null && nameIDPairs !== null && e.target.client.value !== "a" && e.target.client.value !== null && e.target.ExeName.value !== "a" && e.target.ExeName.value !== null && e.target.ExeName.value !== undefined) {
            this.setState({ showLoader: true })
            const clientName = this.state.clientName[e.target.client.value].client_name;
            const Exe = e.target.ExeName.value;
            const id = nameIDPairs[e.target.ExeName.value];
            const limit = e.target.limit.value;
            this.setState({ showErrMsg: false, currentExeIdForCancel: id, passId: id, passLimit: limit });
            this.handelGetResponse(id, limit, Exe, clientName);
        }
        else {
            this.setState({ showErrMsg: true })
        }
    }
    handelGetResponse = (id, limit, Exe, clientName) => {
        const API = ViewOpenTranAPI;
        this.setState({ showLoader: false });
        Axios.get(API + id + "/" + limit)
            .then((response) => {
                const responseData = JSON.parse(JSON.parse(response.data));
                this.setState({ getOpenTransData: [...responseData], iterateResponse: true })
                this.setState({ currentClient: clientName, currentExe: Exe, showLoader: false });
                // showCancelMsg:false,showCancelErrMsg:false
            })
            .catch((err) => {
                console.log(err)
                this.setState({ showLoader: false })
            })
    }
    datechange=(e)=>{
        const d=e.target.value;
        const date=e.target.value.slice(8,10);
       const month = d.slice(5,7);
       const year = d.slice(0,4);
       if(date){
        const correctFormate = date+"-"+ month+"-"+year;
        this.setState({date:correctFormate})
       }
       else{
        this.setState({date:null})
       }
    }
    Currentdatechange=(e)=>{
        const d=e.target.value;
        const date=e.target.value.slice(8,10);
       const month = d.slice(5,7);
       const year = d.slice(0,4);
       if(date){
        const correctFormate = date+"-"+ month+"-"+year;
        this.setState({todate:correctFormate})
       }
       else{
        this.setState({todate:null})
       }
    }
    handleCancelClick = (pos) => {
        const passLimit = this.state.passLimit;
        const passId = this.state.passId;
        const orderId = this.state.getOpenTransData[pos].id;
        const id = this.state.currentExeIdForCancel;
        const currentExe = this.state.currentExe;
        const currentClient = this.state.currentClient;

        this.handelGetResponse(passId, passLimit, currentExe, currentClient);
        if (id !== null && id !== undefined) {
            const data = {
                exchangeId: id,
                orderId: orderId
            }
            const API = OpenTranCancelAPI;
            Axios.post(API, data)
                .then((response) => {
                    this.setState({ showCancelMsg: true });
                    setTimeout(() => {
                        this.setState({ showCancelMsg: false })
                    }, 3000)
                    this.handelGetResponse(passId, passLimit, currentExe, currentClient);
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({ showCancelErrMsg: true });
                    setTimeout(() => {
                        this.setState({ showCancelErrMsg: false })
                    }, 3000)
                    this.handelGetResponse(passId, passLimit, currentExe, currentClient);
                })
        }
    }
    handleRedirectToPath = () => {
        this.props.history.push('/');
    }
    getDateIntValChange = (e) => {
        this.setState({ currentDate: e.target.value })
    }
    currentDateIntValChange = (e) => {
        this.setState({ getDate: e.target.value })
    }
    componentDidMount() {
        this.setState({ showLoader: false });
    }
    render() {
        const getKeys = this.state.getAllExchanges.map((item) => {
            return item.id
        })
        const getValues = this.state.getAllExchanges.map((item) => {
            return item.exchange_unique_name
        })
        const result = getValues.reduce(function (result, field, index) {
            result[getKeys[index]] = field;
            return result;
        }, {})

        const curtClientExchanges = this.state.currentClientExchanges.map((item,pos)=>{
            if (result[item]) {
                return (
                    <option key={pos} >{result[item]}</option>
                )
            }
        })
        const getNameIDPairs = getKeys.reduce(function (result, field, index) {
            result[getValues[index]] = field;
            return result;
        }, {})
        const nameIdPairs = JSON.stringify(getNameIDPairs)
        sessionStorage.setItem("nameIdPairs", nameIdPairs);

        const getClientNames = this.state.clientName.map((item, pos) => {
            return (
                <option key={pos} value={pos}>{item.client_name}</option>
            );
        });
        const getClientExchanges = this.state.clientExchanges.map((item, pos) => {
            if (result[item]) {
                return (
                    <option key={pos}>{result[item]}</option>
                )
            }

        })
        const getOpenTrans = this.state.getOpenTransData === null ? [] : this.state.getOpenTransData.map((item, pos) => {
            const itR = this.state.iterateResponse;
            if (itR === true) {
                return (
                    {
                        Client: this.state.currentClient,
                        Exchange: this.state.currentExe,
                        Operation: item.side,
                        OrderQuantity: item.quantity,
                        Action: <div className={classes.actionIcons}>
                            <button type="button" onClick={() => this.handleCancelClick(pos)}>Cancel</button></div>
                    }
                )
            }
        })
        const data = [...getOpenTrans]
        const columns = [
            {
                Header: "Client", //  column th
                accessor: "Client", // td
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Exchange Name",
                accessor: "Exchange",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,

            },
            {
                Header: "Operation",
                accessor: "Operation",
                sortable: true,
                right: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Order Quantity",
                accessor: "OrderQuantity",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Action",
                accessor: "Action",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            }
        ];
        return (
            <section>
                <h2 className={classes.mainHeading}>View Open Transaction</h2>
                <br />
                {
                    this.state.showCancelErrMsg === true ? <p style={{ color: "red", textAlign: "center" }}>Cancel has been unsucessfull</p> : null
                }
                {
                    this.state.showCancelMsg === true ? <p style={{ color: "green", textAlign: "center" }}>Cancel sucessfully</p> : null
                }
                {
                    this.state.showErrMsg === true ? <p style={{ color: "red", textAlign: "center" }}>Please select Client and Exchange Fields</p> : null
                }
                {
                    this.state.showLoader === true ? <Loader />
                        :
                        <div>
                            <div>
                                <form className={classes.TradeFormWrapper} onSubmit={this.handleSubmit}>
                                    <div className={classes.formDiv}>
                                        <span>Client :</span>
                                        {
                                            this.props.currentUser !== "Client" ?
                                                <select name="client" onChange={this.handlePosClient}>
                                                    <option value="a">Select Client</option>
                                                    {getClientNames}
                                                </select>
                                                :
                                                <select name="client" >
                                                    <option>{this.props.userName}</option>
                                                </select>
                                        }
                                    </div>
                                    <div className={classes.formDiv}>
                                        <span>Exchange :</span>
                                        {
                                            this.props.currentUser !== "Client" ?
                                            <select name="ExeName" required>
                                            <option value="a">Select Exchange</option>
                                            {getClientExchanges}
                                        </select>
                                        :
                                        <select name="ExeName" required>
                                            <option value="a">Select Exchange</option>
                                            {curtClientExchanges}
                                        </select>
                                        }
                                        
                                    </div>
                                    {/* className={classes.formDiv} */}
                                    <div className={classes.timewrapper}>
                                        <span>From Date :</span>
                                        {/* <input type="date" name="fromDate" value={this.state.currentDate} onInput={this.currentDateIntValChange} required /> */}
                                       <div>
                                       <input type="text" className={classes.newDate} value={this.state.date} />
                                         <input type="date" className={classes.dt} onInput={this.datechange} />
                                       </div>
                                    </div>
                                    <div className={[classes.timewrapper, classes.timeInputVal].join(' ')}>
                                        <span>To Date :</span>
                                        {/* <input type="date" name="ToDate" value={this.state.getDate} onInput={this.getDateIntValChange} required /> */}
                                        <div>
                                       <input type="text" className={classes.newDate} value={this.state.todate} />
                                         <input type="date" className={classes.dt} onInput={this.Currentdatechange} />
                                       </div>
                                    </div>
                                    <div className={classes.formDiv}>
                                        <span>Limit :</span>
                                        <input type="number" name="limit" required />
                                    </div>
                                    <div className={classes.formDivBtn}>
                                        <button type="submit">Search</button>
                                        <button type="reset">Reset</button>
                                        <button type="button" onClick={this.handleRedirectToPath}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                            <br /><br /><br />
                            <div className={classes.TableWrapper}>
                                <ReactTable data={data} columns={columns} />
                            </div>
                        </div>
                }
            </section>
        )
    }
}

export default withRouter(ViewOpenTran);