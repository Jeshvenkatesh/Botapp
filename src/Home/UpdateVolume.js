import React from "react";
import Axios from 'axios';
import classes from './DataTable.module.css';
import Loader from "../Utilities/Loader";
import { EditExchangeAPI, DeleteExchangeAPI } from "../Utilities/API";


class UpdateVolume extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: JSON.parse(sessionStorage.getItem("clientIds"))[this.props.passUpdateVolumeData[0].client_id],
            ExeUniName: this.props.passUpdateVolumeData[0].exchange_unique_name,
            ExeName: this.props.passUpdateVolumeData[0].exchange_name,
            totVolume: this.props.passUpdateVolumeData[0].total_volume,
            totPerDayVol: this.props.passUpdateVolumeData[0].per_day_volume,
            totHours: this.props.passUpdateVolumeData[0].total_hours,
            per_ether_price: this.props.passUpdateVolumeData[0].per_ether_price,
            min_order_quantity: this.props.passUpdateVolumeData[0].min_order_quantity,
            min_vol_order: this.props.passUpdateVolumeData[0].min_vol_order,
            max_vol_order: this.props.passUpdateVolumeData[0].max_vol_order,
            start_date: this.props.passUpdateVolumeData[0].start_date,
            end_date: this.props.passUpdateVolumeData[0].end_date,
            base_currency: this.props.passUpdateVolumeData[0].base_currency,
            quote_currency: this.props.passUpdateVolumeData[0].quote_currency,
            symbol: this.props.passUpdateVolumeData[0].symbol,
            url: this.props.passUpdateVolumeData[0].url,
            endpoint_url: this.props.passUpdateVolumeData[0].endpoint_url,
            description: this.props.passUpdateVolumeData[0].description,
            api_key: this.props.passUpdateVolumeData[0].api_key,
            secret_key: this.props.passUpdateVolumeData[0].secret_key,
            id: this.props.passUpdateVolumeData[0].id,
            is_scheduler_running: this.props.passUpdateVolumeData[0].is_scheduler_running,
            perEtherPrice:this.props.passUpdateVolumeData[0].per_ether_price
        }
        this.handleSubmitVolume = this.handleSubmitVolume.bind(this);
    }

    clientNameIntValChange = (e) => {
        this.setState({ clientName: e.target.value })
    }
    ExeUniNameIntValChange = (e) => {
        this.setState({ ExeUniName: e.target.value })
    }
    ExeNameIntValChange = (e) => {
        this.setState({ ExeName: e.target.value });
    }
    totVolumeIntValChange = (e) => {
        this.setState({ totVolume: e.target.value });
    }
    totPerDayVolIntValChange = (e) => {
        this.setState({ totPerDayVol: e.target.value });
    }
    totHoursIntValChange = (e) => {
        this.setState({ totHours: e.target.value });
    }
    perEtherPriceIntValChange=(e)=>{
        this.setState({perEtherPrice:e.target.value});
        // console.log(this.props.passUpdateVolumeData);
    }
    handleSubmitVolume(e) {
        e.preventDefault();
        // console.clear();
       const per_ether_price=this.state.perEtherPrice;
        const data = {
            // client_name: e.target.clientName.value,
            //-----------------------------
            exchange_unique_name: this.state.ExeUniName,
            exchange_name: this.state.ExeName,
            total_hours: this.state.totHours,
            total_volume: this.state.totVolume,
            per_day_volume: this.state.totPerDayVol,
            per_ether_price: this.state.per_ether_price,
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
            api_key: this.state.api_key,
            secret_key: this.state.secret_key,
        }
        console.log(data);
        const Id = this.state.id
        console.log(Id)
        const API = EditExchangeAPI;
        Axios.patch(API + Id, data)
            .then((response) => {
                // console.log(response)
                this.props.handleUpdateVolPopUp();
                this.props.getAllExchangesDataForTable();
                this.props.handleUpdateStatus();
            })
            .catch((err) => {
                console.log(err)
            })
        e.target.reset();
    }
    render() {
        return (
            <div> 
                <section>
                    <div className={classes.popupWrapper}>
                    <div className={classes.crossIcon } onClick={this.props.handleUpdateVolPopUpCancel} >X</div>
                    <div className={classes.Sub_Popup_Wrapper} onDoubleClick={this.props.handleUpdateVolPopUpCancel}></div>
                        <div className={classes.updateVolume}>
                            <form onSubmit={this.handleSubmitVolume}>
                                <div className={classes.formDiv}>
                                    <span>Client Name :</span>
                                    <input type="text" required name="clientName" value={this.state.clientName} readOnly onInput={this.clientNameIntValChange}></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Exchange Unique Name :</span>
                                    <input type="text" required name="ExeUniName" value={this.state.ExeUniName} readOnly onInput={this.ExeUniNameIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Exchange Name :</span>
                                    <input type="text" required name="ExeName" value={this.state.ExeName} readOnly onInput={this.ExeNameIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Total Volume :</span>
                                    <input type="number" required name="totVolume" value={this.state.totVolume} onInput={this.totVolumeIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Total Per Day Volume :</span>
                                    <input type="number" required name="totPerDayVol" value={this.state.totPerDayVol} onInput={this.totPerDayVolIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Per Ether Price :</span>
                                    <input type="number" required name="perEtherPrice" value={this.state.perEtherPrice} onInput={this.perEtherPriceIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Total Hours :</span>
                                    <input type="number" required name="totHours" value={this.state.totHours} onInput={this.totHoursIntValChange} ></input>
                                </div>
                                <div className={classes.formDiv}>
                                    <span>Is Schedular Running :</span>
                                    {/* <input type="text" required name="Scheduler" placeholder={JSON.parse(sessionStorage.getItem("is_scheduler_running"))}></input> */}
                                    <select required name="Scheduler">
                                        <option>{this.state.is_scheduler_running}</option>
                                        <option>{this.state.is_scheduler_running==="Y"?"N":"Y"}</option>
                                    </select>
                                </div>
                                <div className={classes.formDiv}>
                                    <button type="submit">Update</button>
                                    <button type="button" onClick={this.props.handleUpdateVolPopUpCancel}>Cancel</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default UpdateVolume;