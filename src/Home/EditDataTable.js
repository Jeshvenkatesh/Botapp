import React from 'react';
import Axios from 'axios';
import classes from "./EditDataTable.module.css";
import { EditExchangeAPI, DeleteExchangeAPI } from "../Utilities/API";
import { getCurrentDate } from "../Utilities/CurrentDate"
// import 


class EditExchange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: JSON.parse(sessionStorage.getItem("clientIds"))[this.props.passEditExchangeData[0].client_id],
            ExeUniName: this.props.passEditExchangeData[0].exchange_unique_name,
            ExeName: this.props.passEditExchangeData[0].exchange_name,
            totVolume: this.props.passEditExchangeData[0].total_volume,
            totPerDayVol: this.props.passEditExchangeData[0].per_day_volume,
            totHours: this.props.passEditExchangeData[0].total_hours,
            per_ether_price: this.props.passEditExchangeData[0].per_ether_price,
            min_order_quantity: this.props.passEditExchangeData[0].min_order_quantity,
            min_vol_order: this.props.passEditExchangeData[0].min_vol_order,
            max_vol_order: this.props.passEditExchangeData[0].max_vol_order,
            start_date: this.props.passEditExchangeData[0].start_date,
            end_date: this.props.passEditExchangeData[0].end_date,
            base_currency: this.props.passEditExchangeData[0].base_currency,
            quote_currency: this.props.passEditExchangeData[0].quote_currency,
            symbol: this.props.passEditExchangeData[0].symbol,
            url: this.props.passEditExchangeData[0].url,
            endpoint_url: this.props.passEditExchangeData[0].endpoint_url,
            description: this.props.passEditExchangeData[0].description,
            api_key: this.props.passEditExchangeData[0].api_key,
            secret_key: this.props.passEditExchangeData[0].secret_key,
            id: this.props.passEditExchangeData[0].id,
            is_scheduler_running: this.props.passEditExchangeData[0].is_scheduler_running,
            getRowPosFromTable:1,
            baseURL:true,
            endPointURL:true,
        }
        this.onSubmitClickEditPopUp = this.onSubmitClickEditPopUp.bind(this);
    }
    clientNameIntValChange = (e) => {
        this.setState({ clientName: e.target.value });
    }
    ExeNameIntValChange = (e) => {
        this.setState({ ExeName: e.target.value });
    }
    ExeUniNameIntValChange = (e) => {
        this.setState({ ExeUniName: e.target.value });
    }
    apiKeyIntValChange = (e) => {
        this.setState({ api_key: e.target.value });
    }
    secretKeyIntValChange = (e) => {
        this.setState({ secret_key: e.target.value });
    }
    totalVolumeIntValChange = (e) => {
        this.setState({ totVolume: e.target.value });
    }
    perDayVolumeIntValChange = (e) => {
        this.setState({ totPerDayVol: e.target.value });
    }
    perEtherPriceIntValChange = (e) => {
        this.setState({ per_ether_price: e.target.value });
    }
    totalHrsIntValChange = (e) => {
        this.setState({ totHours: e.target.value });
    }
    minOrderQtyIntValChange = (e) => {
        this.setState({ min_order_quantity: e.target.value });
    }
    minQtyIntValChange = (e) => {
        this.setState({ min_vol_order: e.target.value });
    }
    maxQtyIntValChange = (e) => {
        this.setState({ max_vol_order: e.target.value });
    }
    startDateIntValChange = (e) => {
        this.setState({ start_date: e.target.value });
    }
    endDateIntValChange = (e) => {
        this.setState({ end_date: e.target.value });
    }
    baseCurrencyIntValChange = (e) => {
        this.setState({ base_currency: e.target.value });
    }
    quoteCurrencyIntValChange = (e) => {
        this.setState({ quote_currency: e.target.value });
    }
    symbolIntValChange = (e) => {
        this.setState({ symbol: e.target.value });
    }
    baseURLIntValChange = (e) => {
        this.setState({ url: e.target.value });
    }
    endPointUrlIntValChange = (e) => {
        this.setState({ endpoint_url: e.target.value });
    }
    descriptionIntValChange = (e) => {
        this.setState({ description: e.target.value });
    }
    handlebaseURLField = (e) => {
        var fieldbaseURL = e.target.value;
        var validbaseURLPattern = /^www\.[\w]+\.(com|co|in|org)$/;
        var baseURL = fieldbaseURL.match(validbaseURLPattern);
        if (baseURL === null) {
            this.setState({ baseURL: false })
        } else {
            this.setState({ baseURL: true })
        }
    }
    handleEndPointURLField = (e) => {
        var fieldbaseURL = e.target.value;
        var validURLPattern = /^www\.[\w]+\.(com|co|in|org)$/;
        var URL = fieldbaseURL.match(validURLPattern);
        if (URL === null) {
            this.setState({ endPointURL: false })
        } else {
            this.setState({ endPointURL: true })
        }
    }
    onSubmitClickEditPopUp(e) {
        e.preventDefault();
        console.clear();
        const endPointURL = this.state.endPointURL;
        const baseURL = this.state.baseURL;
        if(endPointURL && baseURL){
            const exchangeFormData = {
                exchange_unique_name: this.state.ExeUniName,
                exchange_name: this.state.ExeName,
                api_key: this.state.api_key,
                secret_key: this.state.secret_key,
                total_volume: this.state.totVolume,
                per_day_volume: this.state.totPerDayVol,
                per_ether_price: this.state.per_ether_price,
                total_hours: this.state.totHours,
                min_order_quantity: this.state.min_order_quantity,
                min_vol_order: this.state.min_vol_order,
                max_vol_order: this.state.max_vol_order,
                start_date: this.state.start_date,
                end_date: this.state.end_date,
                base_currency: this.state.base_currency,
                quote_currency: this.state.quote_currency,
                symbol: this.state.symbol,
                url: this.state.url,
                endpoint_url: this.state.endpoint_url,
                description: this.state.description,
                is_scheduler_running: e.target.Scheduler.value,
                isActive: "Y",
            }
            console.clear();
            const id = this.state.id;
            const API = EditExchangeAPI;
            Axios.patch(API + id, exchangeFormData)
                .then((response) => {
                    this.props.handleEditExchangePopUp();
                    this.props.handleUpdateStatus();
                    this.props.getAllExchangesDataForTable()
                })
                .catch((err) => {
                    console.log(err)
                })
        }else{
            alert("Please enter the marked fields")
        }
    }
    render() {
        return (
            <section>
                <div className={classes.AddClent_popUp_Wrapper} >
                    <div className={classes.crossIcon} onClick={this.props.handleEditExchangePopUpCancel}>X</div>
                    <div className={classes.Sub_Popup_Wrapper}  onDoubleClick={this.props.handleEditExchangePopUpCancel}></div>
                    <div className={classes.FormWrapper}>
                        <div><h3>Edit Exchange</h3></div>
                        <form onSubmit={this.onSubmitClickEditPopUp}>
                            <div className={classes.FormWrapperSubDiv}>
                                <div>
                                    <p>Client Name :</p>
                                    <input type="text" required name="clientName" value={this.state.clientName} onInput={this.clientNameIntValChange} readOnly />
                                </div>
                                <div>
                                    <p>Buy Sequence :</p>
                                    <input type="text" required name="buySequence"  />
                                </div>
                                <div>
                                    <p>Exchange Name:</p>
                                    <input type="text" required name="exchange" value={this.state.ExeName} onInput={this.ExeNameIntValChange} />
                                </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Exchange Unique :</p>
                                <input type="text" required name="exchangeName" value={this.state.ExeUniName} onInput={this.ExeUniNameIntValChange} />
                                {/* {
                                            this.state.exchangeName === true ? null :
                                                <div style={{ color: 'red', fontSize: '16px', marginTop: '30px', lineHeight: '0', textAlign: 'center' }}>
                                                    <p> *Alphanumeric length btw 6 to 15</p>
                                                </div>
                                        } */}
                            </div>
                            <div>
                                <p>API Key :</p>
                                <input type="text" required name="apiKey" value={this.state.api_key} onInput={this.apiKeyIntValChange} />
                            </div>
                        </div>
                        <div className={classes.FormWrapperSubDiv}>
                        <div>
                                <p>Secret Key :</p>
                                <input type="text" required name="secretKey" value={this.state.secret_key} onInput={this.secretKeyIntValChange} />
                            </div>
                            <div>
                                <p>Total Volume :</p>
                                <input type="number" required name="totalVolume" value={this.state.totVolume} onInput={this.totalVolumeIntValChange} />
                            </div>
                        </div>
                        <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Per Day Volume :</p>
                                <input type="number" required name="perDayVolume" value={this.state.totPerDayVol} onInput={this.perDayVolumeIntValChange} />
                            </div>
                            <div>
                                <p>Per Ether Price :</p>
                                <input type="text" required name="perEtherPrice" value={this.state.per_ether_price} onInput={this.perEtherPriceIntValChange} />
                            </div>
                         </div> 
                         <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Total Hours :</p>
                                <input type="number" required name="totalHrs" value={this.state.totHours} onInput={this.totalHrsIntValChange} />
                            </div>
                            <div>
                                <p>Min Order Qty :</p>
                                <input type="number" required name="minOrderQty" value={this.state.min_order_quantity} onInput={this.minOrderQtyIntValChange} />
                            </div>
                         </div>
                         <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Min Qty :</p>
                                <input type="number" required name="minQty" value={this.state.min_vol_order} onInput={this.minQtyIntValChange} />
                            </div>
                            <div>
                                <p>Max Qty :</p>
                                <input type="number" required name="maxQty" value={this.state.max_vol_order} onInput={this.maxQtyIntValChange} />
                            </div>
                          </div>  
                          <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Start Date :</p>
                                <input type="date" required name="startDate" value={this.state.start_date} onInput={this.startDateIntValChange} />
                            </div>
                            <div>
                                <p>End Date :</p>
                                <input type="date" required name="endDate" value={this.state.end_date} onInput={this.endDateIntValChange} />
                            </div>
                        </div>
                            <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Base Currency :</p>
                                <input type="text" required name="baseCurrency" value={this.state.base_currency} onInput={this.baseCurrencyIntValChange} />
                            </div>
                            <div>
                                <p>Quote Currency :</p>
                                <input type="text" required name="quoteCurrency" value={this.state.quote_currency} onInput={this.quoteCurrencyIntValChange} />
                            </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Symbol :</p>
                                <input type="text" required name="symbol" value={this.state.symbol} onInput={this.symbolIntValChange} />
                            </div>
                            <div>
                                <p>Is Scheduler running ?</p>
                                <select required name="Scheduler">
                                    <option>{this.state.is_scheduler_running}</option>
                                    <option>{this.state.is_scheduler_running === "Y" ? "N" : "Y"}</option>
                                </select>
                            </div>
                            </div>
                            {/* ----------------------------------------------------------------- */}
                            <div className={classes.FormWrapperSubDiv}>
                            <div>
                                <p>Base URL :</p>
                                <input type="text" required name="baseURL" value={this.state.url} onInput={this.baseURLIntValChange} onChange={this.handlebaseURLField} />
                                {
                                            this.state.baseURL === true ? null :
                                                <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', lineHeight: '0', textAlign: 'center' }}>
                                                    <p>Please Enter Valid URL</p>
                                                </div>
                                        }
                            </div>
                            {/* ------------------------------------------------------------------------- */}
                            <div>
                                <p>End Point URL :</p>
                                <input type="text" required name="endPointUrl" value={this.state.endpoint_url} onInput={this.endPointUrlIntValChange} onChange={this.handleEndPointURLField}/>
                                {
                                            this.state.endPointURL === true ? null :
                                                <div style={{ color: 'red', fontSize: '12px', marginTop: '6px', lineHeight: '0', textAlign: 'center' }}>
                                                    <p>Please Enter Valid URL</p>
                                                </div>
                                        }
                            </div>
                            </div>
                            <div className={classes.FormWrapperSubDiv}>
                            <div >
                                <p>Description : </p>
                                <textarea name="description" required value={this.state.description} onInput={this.descriptionIntValChange}></textarea>
                            </div>
                            <div className={classes.formBtnWrapper}>
                                <button type="submit">Update</button>
                                <button type="button" onClick={this.props.handleDeleteExchange}>Delete</button>
                                <button type="button" onClick={this.props.handleEditExchangePopUpCancel}>Cancel</button>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        )
    }
}
export default EditExchange;