import React from "react";
import classes from "./TotalVolume.module.css";
import Axios from 'axios';
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css';
import { TotalVolumeAPI } from "../Utilities/API";
import { getCurrentDate } from '../Utilities/CurrentDate';
import Loader from '../Utilities/Loader';
import VolumeTable from "./TotalVolumeTable";
import { withRouter } from 'react-router-dom';



class TotalVolume extends React.Component {

    state = {
        currentDate: getCurrentDate(),
        getDate: getCurrentDate(),
        date:getCurrentDate(),
        todate:getCurrentDate(),
        responseAllClients: [],
        getAllExchanges: JSON.parse(sessionStorage.getItem("allExchanges")),
        clientName: JSON.parse(sessionStorage.getItem("allClients")),
        clientExchanges: [],
        clientId: '',
        showLoader: true,
        nameIDPairs: JSON.parse(sessionStorage.getItem("nameIdPairs")),
        getVolumeData: [],
        showErrMsg: false,
        showSuccessMsg: false,
        showUnsuccessMsg: false,
        currentClientExchanges:this.props.currentClientExchanges,
    }
    handlePosClient = (e) => {
        if (e.target.value !== "a") {
            const id = this.state.clientName[e.target.value].id;
            const exchanges = this.state.clientName[e.target.value].exchanges;
            this.setState({ clientId: id, clientExchanges: exchanges })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const nameIDPairs = this.state.nameIDPairs;
        // console.log(this.state.nameIDPairs);// here chance to get null 

        if (nameIDPairs !== null && nameIDPairs !== undefined && e.target.client.value !== "a" && e.target.client.value !== null && e.target.ExeName.value !== "a" && e.target.ExeName.value !== null && e.target.ExeName.value !== undefined) {
            this.setState({ showErrMsg: false, showLoader: true })
            const id = nameIDPairs[e.target.ExeName.value];
            const limit = e.target.limit.value;
            const API = TotalVolumeAPI;
            Axios.get(API + id + "/" + limit)
                .then((response) => {
                    const responseData = JSON.parse(JSON.parse(response.data));
                    this.setState({ getVolumeData: [...responseData], showLoader: false, showSuccessMsg: true, showUnsuccessMsg: false })
                    
                    setTimeout(() => {
                        this.setState({ showSuccessMsg: false })
                    }, 3000)
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({ showLoader: false })
                })
        } else {
            this.setState({ showErrMsg: true })
        }
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
    currentDateIntValChange = (e) => {
        this.setState({ currentDate: e.target.value })
    }
    getDateIntValChange = (e) => {
        this.setState({ currentDate: e.target.value })
    }
    handleRedirectToPath = () => {
        this.props.history.push('/');
    }

    componentDidMount() {
        this.setState({ showLoader: false });
    }
    render() {

        const generateVolumeData = this.state.getVolumeData.map((item) => {
            const presentDate = getCurrentDate();
            return ({
                Date: presentDate,
                Operation: item.side,
                OrderQuantity: item.quantity,
                FillQuantity: item.filled,
                Condition: item.condition
            })
        })
        const getClientNames = this.state.clientName.map((item, pos) => {
            return (
                <option key={pos} value={pos}>{item.client_name}</option>
            );
        });
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
        const getClientExchanges = this.state.clientExchanges === null ? [] : this.state.clientExchanges.map((item, pos) => {
            if (result[item]) {
                return (
                    <option key={pos}>{result[item]}</option>
                )
            }
        })
        const data = [...generateVolumeData];
        const columns = [
            {
                Header: "Date", //  column th
                accessor: "Date", // td
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Operation",
                accessor: "Operation",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,

            },
            {
                Header: "Order Quantity",
                accessor: "OrderQuantity",
                sortable: true,
                right: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Fill Quantity",
                accessor: "FillQuantity",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Condition",
                accessor: "Condition",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            }
        ];
        return (
            <section>
                <h2 className={classes.mainHeading}>Total Volume</h2>
                <br />
                {
                    this.state.showErrMsg === true ? <p style={{ color: "red", textAlign: "center" }}>Please select Client and Exchange Fields</p> : null
                }
                {
                    this.state.showSuccessMsg === true ? <p style={{ color: "green", textAlign: "center" }}  >Search has been sucessfull</p> : null
                }
                {
                    this.state.showUnsuccessMsg === true ? <p style={{ color: "red", textAlign: "center" }}>Search has been unsucessfull</p> : null
                }

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
                            <div  className={classes.timewrapper}>
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
                    
                    <div>
                        <div>
                            <VolumeTable getVolumeData={this.state.getVolumeData} />
                        </div>
                        <br /><br /><br />
                        <div className={classes.TableWrapper}>
                            <ReactTable data={data} columns={columns} defaultPageSize={10} minRows={10} />
                        </div>
                    </div>
                </div>

            </section>
        )
    }
}

export default withRouter(TotalVolume);