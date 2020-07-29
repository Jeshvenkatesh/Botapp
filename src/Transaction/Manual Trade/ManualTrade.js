import React from "react";
import classes from "./ManualTrade.module.css";
import Axios from 'axios';
import { GetAllClientsAPI, GetAllExchangesAPI } from "../../Utilities/API";
import Loader from "../../Utilities/Loader";
import { withRouter } from 'react-router-dom';
import { manualTradePostAPI } from "../../Utilities/API";
import PractiseTask from "../../Client/searchbar";

class ManualTrade extends React.Component {

    state = {
        responseAllClients: [],
        getAllExchanges: [],
        clientName: [],
        clientExchanges: [],
        clientId: '',
        showLoader: true,
        currentExeId: null,
        priceField: false,
        showSuccessMsg: false,
        showUnSuccessMsg: false,
        showCheckFieldsMsg: false,
        currentClientExchanges:[],
    }
    handlePosClient = (e) => {
        if (e.target.value !== "a") {
            const id = this.state.clientName[e.target.value].id;
            const exc = this.state.clientName[e.target.value];
            const exchanges = this.state.clientName[e.target.value].exchanges;
            this.setState({ clientId: id, clientExchanges: exchanges })
        }
    }
    handleExeName = (e) => {
        const getKeys = this.state.getAllExchanges.map((item) => {
            return item.id
        })
        const getValues = this.state.getAllExchanges.map((item) => {
            return item.exchange_unique_name
        })
        const getNameIDPairs = getKeys.reduce(function (result, field, index) {
            result[getValues[index]] = field;
            return result;
        }, {})
        const currentExeId = getNameIDPairs[e.target.value];
        console.log(currentExeId);
        this.setState({ currentExeId: currentExeId })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const id = this.state.currentExeId;
        if (id !== null && e.target.symbol.value !== "a" && e.target.side.value !== "a") {
            const data = {
                exchangeId: id,
                symbol: e.target.symbol.value,
                side: e.target.side.value,
                price: parseFloat(e.target.price.value).toFixed(15),
                quantity: e.target.quantity.value
            }
            console.log(data)
            const API = manualTradePostAPI;
            Axios.post(manualTradePostAPI, data)
                .then((response) => {
                    this.setState({ showSuccessMsg: true })
                    setTimeout(() => {
                        this.setState({ showSuccessMsg: false })
                    }, 3000)
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({ showUnSuccessMsg: true })
                    setTimeout(() => {
                        this.setState({ showUnSuccessMsg: false })
                    }, 3000)
                })
        }
        else {
            alert("please check the required fields")
        }
    }
    // handlePriceField = (e) => {
    //     var fieldbaseURL = e.target.value;
    //     var validURLPattern = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;
    //     var URL = fieldbaseURL.match(validURLPattern);
    //     if (URL === null) {
    //         this.setState({ priceField: true })
    //     } else {
    //         this.setState({ priceField: false })
    //     }
    // }

    handleRedirectToPath = () => {
        this.props.history.push('/');
    }
    getAllClientsData = () => {
        Axios.get(GetAllClientsAPI)
            .then((response) => {
                this.setState({ clientName: [...response.data.clients] });
                const getCurrenClientExchangesId= response.data.clients.map((item,pos)=>{
                    if(item.client_name === this.props.userName){
                        console.log(item.exchanges)
                        this.setState({currentClientExchanges:[...item.exchanges]})
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    getAllExchangesDataForTable = () => {
        const API = GetAllExchangesAPI;
        Axios.get(API)
            .then((response) => {
                this.setState({ getAllExchanges: [...response.data.exchanges] })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    componentDidMount() {
        this.getAllClientsData();
        this.getAllExchangesDataForTable();
        this.setState({ showLoader: false })
    }
    render() {
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
        const currentClientExchanges = this.state.currentClientExchanges.map((item,pos)=>{
            if (result[item]) {
                return (
                    <option key={pos} >{result[item]}</option>
                )
            }
        })
        const getClientExchanges = this.state.clientExchanges.map((item, pos) => {

            if (result[item]) {
                return (
                    <option key={pos}>{result[item]}</option>
                )
            }
        })
        return (
            <section>
                {/* <PractiseTask/> */}
                {
                    this.state.showUnSuccessMsg === true ? <p style={{ color: "red", textAlign: "center" }} >Trade has not been successfull</p> : null
                }
                {
                    this.state.showSuccessMsg === true ? <p style={{ color: "green", textAlign: "center" }} >Trade has been successfull</p> : null
                }
                {
                    this.state.showLoader === true ? <Loader />
                        :
                        <div >
                            <h2 className={classes.mainHeading}>Manual Trade</h2>
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
                                    <span>Exchange Name :</span>
                                    {
                                        this.props.currentUser !== "Client" ?
                                            <select name="ExeName" onChange={this.handleExeName}>
                                                <option value="a">Select Exchange</option>
                                                {getClientExchanges}
                                            </select>
                                            :
                                            <select name="ExeName" onChange={this.handleExeName}>
                                                <option value="a">Select Exchange</option>
                                                {currentClientExchanges}
                                            </select>
                                    }
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Operation :</span>
                                    <select name="side" >
                                        <option value="a" >Select Operation</option>
                                        <option>BUY</option>
                                        <option>SELL</option>
                                    </select>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Conditions :</span>
                                    <select name="symbol">
                                        <option value="a">Select Conditions</option>
                                        <option>GOOD_TILL_CANCELLED</option>
                                        <option>IMMEDIATE_OR_CANCEL</option>
                                        <option>FILL_OR_KILL</option>
                                        <option> ALL_OR_NONE</option>
                                    </select>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Quantity :</span>
                                    <input type="number" name="quantity" required></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Price :</span>
                                    <input type="text" name="price" required  ></input>

                                </div>
                                {/* onInput={this.handlePriceField} */}
                                {/* {
                                            this.state.priceField === false ? null :
                                                <div style={{ color: 'red', fontSize: '14px', marginTop: '6px', lineHeight: '0', textAlign: 'center' }}>
                                                    <p>Please Enter valid price</p>
                                                </div>
                         } */}
                                <div className={classes.formDivBtn}>
                                    <button type="submit">Trade</button>
                                    <button type="reset">Reset</button>
                                    <button type="button" onClick={this.handleRedirectToPath}>Cancel</button>
                                </div>
                            </form>
                        </div>
                }
            </section>

        )
    }
}

export default withRouter(ManualTrade);