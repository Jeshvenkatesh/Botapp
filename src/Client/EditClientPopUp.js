import React from 'react';
import Axios from 'axios';
import { EditClientAPI } from "../Utilities/API";
import classes from "./EditClient.module.css";
import { withRouter } from 'react-router-dom';


class EditClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientName: this.props.PassingDataToEditPopup.client_name === undefined || null ? '' : this.props.PassingDataToEditPopup.client_name,
            clientAddress: this.props.PassingDataToEditPopup.address === undefined ? '' : this.props.PassingDataToEditPopup.address,
            clientEmail: this.props.PassingDataToEditPopup.email === undefined ? '' : this.props.PassingDataToEditPopup.email,
            clientPhone: this.props.PassingDataToEditPopup.phone === undefined ? '' : this.props.PassingDataToEditPopup.phone,
            ClientId: this.props.PassingDataToEditPopup.id === undefined ? '' : this.props.PassingDataToEditPopup.id,
            role: this.props.PassingDataToEditPopup.role === undefined ? '' : this.props.PassingDataToEditPopup.role,
            password: this.props.PassingDataToEditPopup.password === undefined ? '' : this.props.PassingDataToEditPopup.password


        }
        this.onSubmitEditClick = this.onSubmitEditClick.bind(this)
    }
    handleEditClientPopUp = () => {
        // this.props.handleEditClientPopUpRemove()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
    onClientNameChange = (e) => {
        this.setState({ clientName: e.target.value })
    }
    onClientAddressChange = (e) => {
        this.setState({ clientAddress: e.target.value })
    }
    onEmailIntValChange = (e) => {
        this.setState({ clientEmail: e.target.value })
    }
    onPhoneIntValChange = (e) => {
        this.setState({ clientPhone: e.target.value })
    }
    onPasswordIntValChange=(e)=>{
        this.setState({password:e.target.value})
    }
    onRoleChange=(e)=>{
        this.setState({role:e.target.value})
    }

    onSubmitEditClick(e) {
        e.preventDefault();
        const data = {
            client_name: this.state.clientName,
            address: this.state.clientAddress,
            email: this.state.clientEmail,
            phone: this.state.clientPhone,
            password: this.state.password,
            role: this.state.role,
            isActive: "Y"
        }
        console.log(data);
        const Id = this.state.ClientId;
        const API = EditClientAPI;
        Axios.patch(API + Id, data)
            .then((response) => {
                this.props.handleEditClientPopUp();
                this.props.handleUpdateStatus()
            })
            .catch((err) => {
                this.props.handleEditClientPopUp();
                console.log(err)
            })
    }
    render() {
        return (
            <section>
                {
                    this.state.editClientPopUpShow === false ? null :
                        <div className={classes.AddClent_popUp_Wrapper}>
                            <div className={classes.crossIcon} onClick={this.props.handleEditClientPopUpRemove}>X</div>
                            <div className={classes.Sub_Popup_Wrapper} onDoubleClick={this.props.handleEditClientPopUpRemove}></div>
                            <div className={classes.AddClient_popup}>
                                <div className={classes.popup_heading}><h3>Edit Client</h3></div>
                                <form onSubmit={this.onSubmitEditClick}>
                                    <section>
                                        <div className={classes.formDiv}>
                                            <span>Name :</span>
                                            <input type="text" required name="username" value={this.state.clientName} onInput={this.onClientNameChange} minLength={6} />
                                        </div>
                                        <div className={classes.textarea_wrapper}>
                                            <span>Address : </span>
                                            <textarea name="address" maxLength={50} value={this.state.clientAddress} required onInput={this.onClientAddressChange}></textarea>
                                        </div>
                                        <div className={classes.formDiv}>
                                            <span>Email : </span>
                                            <input type="email" required name="email" value={this.state.clientEmail} onInput={this.onEmailIntValChange} />
                                            {/* {
                                                this.state.validEmail === true ? null :
                                                    <div style={{ color: 'red', fontSize: '12px', margin: '0px', lineHeight: '0' }}>
                                                        <p>Please enter valid Email</p>
                                                    </div>
                                            } */}
                                        </div>
                                        <div className={classes.formDiv}>
                                            <span>Password :</span>
                                            <input type="password" required name="pwd" value={this.state.password}  onInput={this.onPasswordIntValChange}/>
                                        </div>
                                        <div className={classes.formDiv} >
                                            <span>Role :</span>
                                            {
                                                this.state.role===null && undefined && "" ?
                                                <select name="role" onChange={this.onRoleChange}>
                                                    <option>Select Role</option>
                                                    <option>Client</option>
                                                    <option>SupportUser</option>
                                                </select>
                                                :
                                                <select name="role" onChange={this.onRoleChange} >
                                                {/* <option>{this.state.role}</option> */}
                                                <option>{this.state.role}</option>
                                                <option>{this.state.role === "SupportUser" ? "Client" : "SupportUser"}</option>
                                            </select>
                                            }
                                        </div>
                                        <div className={classes.formDiv}>
                                            <span>Phone :</span>
                                            <input type="tel" maxLength={10} required name="phone" value={this.state.clientPhone} onInput={this.onPhoneIntValChange} />
                                            {/* {
                                                this.state.validPhnumber === true ? null :
                                                    <div style={{ color: 'red', fontSize: '12px', margin: '0px', lineHeight: '1' }}>
                                                        <p>Please enter valid phone number</p>
                                                    </div>
                                            } */}
                                        </div>
                                        <div className={classes.btnWrapper}>
                                        <button type="submit">Update</button>
                                        <button type="button" onClick={this.props.handleDeleteClient}>Delete</button>
                                        <button type="button" onClick={this.props.handleEditClientPopUpRemove} >Cancel</button>
                                        </div>
                                    </section>
                                </form>
                            </div>
                        </div>
                }
            </section>
        )
    }
}

export default withRouter(EditClient);