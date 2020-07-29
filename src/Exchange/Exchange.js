import React from 'react';
import classes from './Exchange.module.css';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { GetAllClientsAPI, AddExchangeAPI, GetAllExchangesAPI } from "../Utilities/API";
import { getCurrentDate } from "../Utilities/CurrentDate";

class Exchange extends React.Component {
    state = {
        date:getCurrentDate(),
        todate:getCurrentDate(),
        baseURL: true,
        endPointURL: true,
        exchangeName: true,
        clientName: [],
        getAllExchanges: [],
        updatClientValue: '',
        clientId: '',
        clientExchanges: [],
        currentBuySequenceId: null,
        userRole: "",
        currentClientExchanges:[],
    }
    handleExchangeName = (e) => {
        var exchangeName = e.target.value;
        var exchangeNamePattern = /^[\w]{6,15}$/;
        var validExchangeName = exchangeName.match(exchangeNamePattern);
        if (validExchangeName === null) {
            this.setState({ exchangeName: false })
        } else {
            this.setState({ exchangeName: true })
        }
    }
    handlePosClient = (e) => {
        if (e.target.value !== "a") {
            const id = this.state.clientName[e.target.value].id;
            const exchanges = this.state.clientName[e.target.value].exchanges;
            this.setState({ clientId: id, clientExchanges: exchanges })
        }
    }
    handleRedirectToPath = () => {
        this.props.history.push('/ExchangeTable');
    }
    handlePosSequence = (e) => {
        const getValues = this.state.getAllExchanges.map((item) => {
            return item.exchange_unique_name
        })
        const getKeys = this.state.getAllExchanges.map((item) => {
            return item.id
        })
        const getNameIDPairs = getKeys.reduce(function (result, field, index) {
            result[getValues[index]] = field;
            return result;
        }, {})
        this.setState({ currentBuySequenceId: getNameIDPairs[e.target.value] })
    }
    onSubmitClick = (e) => {
        e.preventDefault();
        const endPointURL = this.state.endPointURL;
        const baseURL = this.state.baseURL;
        const currentBuySequenceId = this.state.currentBuySequenceId;
        if (endPointURL && baseURL) {
            const exchangeFormData = {
                exchange_unique_name: e.target.exchange.value,
                exchange_name: e.target.exchangeName.value,
                api_key: e.target.apiKey.value,
                secret_key: e.target.secretKey.value,
                total_volume: e.target.totalVolume.value,
                per_day_volume: e.target.perDayVolume.value,
                per_ether_price: e.target.perEtherPrice.value,
                total_hours: e.target.totalHrs.value,
                min_order_quantity: e.target.minOrderQty.value,
                min_vol_order: e.target.minQty.value,
                max_vol_order: e.target.maxQty.value,
                start_date: e.target.startDate.value,
                end_date: e.target.endDate.value,
                base_currency: e.target.baseCurrency.value,
                quote_currency: e.target.quoteCurrency.value,
                symbol: e.target.symbol.value,
                url: e.target.baseURL.value,
                endpoint_url: e.target.endPointUrl.value,
                description: e.target.description.value,
                is_scheduler_running: e.target.Scheduler.value,
                isActive: "Y",
                client_id: this.state.clientId,
                buy_sequence : currentBuySequenceId,
            }
            const API = AddExchangeAPI;
            Axios.post(API, exchangeFormData)
                .then((response) => {
                    this.handleRedirectToPath()
                })
                .catch((err) => {
                    console.log(err)
                })
            e.target.reset();
        }
        else {
            alert('Please enter marked fields');
        }
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
    getAllClientsData = () => {
        Axios.get(GetAllClientsAPI)
            .then((response) => {
                this.setState({ clientName: [...response.data.clients] });
                const getCurrenClientExchangesId= response.data.clients.map((item,pos)=>{
                    if(item.client_name === this.props.userName){
                        this.setState({currentClientExchanges:[...item.exchanges]})
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    componentDidMount() {
        this.getAllClientsData();
        this.getAllExchangesDataForTable();
    }
    render() {
        const getClientNames = this.state.clientName.map((item, pos) => {
            const name = item.client_name
            return (
                <option key={pos} value={pos} >{item.client_name}</option>
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
        const getClientExchanges = this.state.clientExchanges.map((item, pos) => {
            if (result[item]) {
                return (
                    <option key={pos}   >{result[item]}</option>
                )
            }
        })
        const currentClientExchanges = this.state.currentClientExchanges.map((item,pos)=>{
            if (result[item]) {
                return (
                    <option key={pos}   >{result[item]}</option>
                )
            }
        })
        return (
            <div>
                <section>
                    <div className={classes.FormWrapper}>
                        <h3>Add Exchange</h3>
                        <form onSubmit={this.onSubmitClick}>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Client Name :</p>
                                    {
                                        this.props.currentUser !== "Client" ?
                                            <select name="select" onChange={this.handlePosClient}>
                                                <option value="a">Select Client</option>
                                                {getClientNames}
                                            </select>
                                            :
                                            <select name="select">
                                                <option>{this.props.userName}</option>
                                            </select>
                                    }
                                </div>
                                <div>
                                    <p>Buy Sequence :</p>
                                    {
                                        this.props.currentUser !== "Client" ?
                                            <select name="buySequence" onChange={this.handlePosSequence} >
                                                <option value="a">Select Exchange</option>
                                                {getClientExchanges}
                                            </select>
                                        :
                                        <select name="buySequence" onChange={this.handlePosSequence}>
                                            <option value="a">Select Exchange</option>
                                            {currentClientExchanges}
                                        </select>
                                    }

                                </div>
                                <div>
                                    <p>Exchange Name :</p>
                                    <input type="text" required name="exchange" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Exchange Unique Name :</p>
                                    <input type="text" required name="exchangeName" />
                                </div>
                                <div>
                                    <p>API Key :</p>
                                    <input type="text" required name="apiKey" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Secret Key :</p>
                                    <input type="text" required name="secretKey" />
                                </div>
                                <div>
                                    <p>Total Volume :</p>
                                    <input type="number" required name="totalVolume" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Per Day Volume :</p>
                                    <input type="number" required name="perDayVolume" />
                                </div>
                                <div>
                                    <p>Per Ether Price :</p>
                                    <input type="text" required name="perEtherPrice" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Total Hours :</p>
                                    <input type="number" required name="totalHrs" />
                                </div>
                                <div>
                                    <p>Min Order Qty :</p>
                                    <input type="number" required name="minOrderQty" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Min Qty :</p>
                                    <input type="number" required name="minQty" />
                                </div>
                                <div>
                                    <p>Max Qty :</p>
                                    <input type="number" required name="maxQty" />
                                </div>
                            </div>
                            <div className={classes.dateSectionWrapper}>
                                <div className={classes.timewrapper}>
                                    <p>Start Date :</p>
                                    {/* <input type="date" required name="startDate" /> */}
                                    <div>
                                       <input type="text" className={classes.newDate} name="startDate" value={this.state.date} />
                                         <input type="date" className={classes.dt} onInput={this.datechange} />
                                     </div>
                                </div>
                                <div className={[classes.timewrapper, classes.timeInputVal].join(' ')}>
                                    <p>End Date :</p>
                                    {/* <input type="date" required name="endDate" /> */}
                                    <div>
                                       <input type="text" className={classes.newDate} name="endDate" value={this.state.todate} />
                                         <input type="date" className={classes.dt} onInput={this.Currentdatechange} />
                                       </div>
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Base Currency :</p>
                                    <input type="text" required name="baseCurrency" />
                                </div>
                                <div>
                                    <p>Quote Currency :</p>
                                    <input type="text" required name="quoteCurrency" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Symbol :</p>
                                    <input type="text" required name="symbol" />
                                </div>
                                <div>
                                    <p>Is Scheduler running ?</p>
                                    <select required name="Scheduler">
                                        <option>Y</option>
                                        <option>N</option>
                                    </select>
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Base URL :</p>
                                    <input type="text" required name="baseURL" />
                                </div>
                                <div>
                                    <p>End Point URL :</p>
                                    <input type="text" required name="endPointUrl" />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Description : </p>
                                    <textarea required minLength={10} name="description"></textarea>
                                </div>
                                <div className={classes.formBtnWrapper}>
                                    <button type="submit">Add</button>
                                    <button type="reset">Reset</button>
                                    <button type="reset" onClick={this.handleRedirectToPath}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(Exchange);