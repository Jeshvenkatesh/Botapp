import React from 'react';
import classes from './ClientPage.module.css';
import Axios from 'axios';
import { GetAllClientsAPI, AddClientAPI,DeleteClientAPI } from "../Utilities/API";
import EditClient from "../Client/EditClientPopUp";
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css';
import Loader from "../Utilities/Loader";

class ClientAdd extends React.Component {
    state = {
        validEmail: true,
        validPhnumber: true,
        addClentPopUP: false,
        editClientPopUp: false,
        responseAllClients: [],
        PassingDataToEditPopup: [],
        getRowPosFromTable:0,
        showLoader:true,
        showAddClientMessage:false,
        clientNameIntVal:'',
        showUpdateMessage:false,
        showDeleteMessage:false,
        validPwd: true,
        //--------------------
        query: '',
        data: [],
        searchString:[],
        filterArry:[],
    }

   handleInputChange = (event) => {
            this.setState({
                query: event.target.value
            },()=>{
          this.filterArray();
        })
        }
   
    filterArray = () => {
            let searchString = this.state.query;
            let responseData = this.state.data;
            if(searchString.length > 0){
                const filteredData = responseData.filter((item)=>{
                    const name=item.client_name.toLowerCase()
                    if(name.startsWith(searchString.toLowerCase()) ){
    
                        return true;
    
                    }else{
                        return false;
                    }
                })
                console.log(filteredData);
               
                this.setState({filterArry:filteredData})
            }else{
                this.setState({filterArry:responseData})
            }
        }
    handleUpdateStatus=()=>{
        this.setState({showUpdateMessage:true})
    }
    handleAddClientPopUp = () => {
        this.setState({ addClentPopUP: !this.state.addClentPopUP })
    }
    handleAddClientPopUpCancel=()=>{
        this.setState({ addClentPopUP: !this.state.addClentPopUP, showLoader:false })
    }
    handleEditClientPopUp = () => {
        this.setState({ editClientPopUp: !this.state.editClientPopUp, showLoader:true });
        this.getClientsData();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
   handleEditClientPopUpOnclickRow=()=>{
    this.setState({ editClientPopUp: !this.state.editClientPopUp });
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
   }
   handleDeleteClientPopUpRemove=()=>{
    this.setState({ editClientPopUp: !this.state.editClientPopUp,showLoader:true });
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
   }
    handleEditClientPopUpRemove=()=>{
        this.setState({ editClientPopUp: !this.state.editClientPopUp });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
    handleEditData = (pos) => {
        if (pos !== undefined && pos !== null) {
            this.setState({ PassingDataToEditPopup: this.state.filterArry[pos] });
        }
    }
    handleEmailField = (e) => {
        var fieldEmail = e.target.value;
        var validEmailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var email = fieldEmail.match(validEmailPattern);
        if (email === null) {
            this.setState({ validEmail: false })
            console.log('enter correct user name')
        } else {
            this.setState({ validEmail: true })
            console.log(email)
        }
    }
    handlePhoneField = (e) => {
        var fieldPh = e.target.value;
        var validPhPattern = /^[\d]{10}$/;
        var Phnumber = fieldPh.match(validPhPattern);
        if (Phnumber === null) {
            this.setState({ validPhnumber: false })
            console.log('enter correct phone number')
        } else {
            this.setState({ validPhnumber: true })
            console.log(Phnumber)
        }
    }
    handleReset=(e)=>{
        this.setState({validEmail:true,validPhnumber:true,validPwd: true})
    }
    onSubmitClick = (e) => {
         this.setState({clientNameIntVal:e.target.username.value})
         const password = e.target.pwd.value;
         const role = e.target.role.value;
         console.log(password,role);
        e.preventDefault();
        const data = {
            client_name:e.target.username.value,
            address: e.target.address.value,
            email: e.target.email.value,
            role : e.target.role.value,
            password : e.target.pwd.value,
            phone: e.target.phone.value,
            isActive: "Y"
        }
        console.log(data);

        if(role!=="a"){
        const API = AddClientAPI;
        Axios.post(API, data)
            .then((response) => {
                this.setState({showAddClientMessage:true})
                this.getClientsData();
            })
            .catch((err) => {
                console.log(err)
                alert(err);
            })
        }
        this.handleAddClientPopUp();
    }
    handleDeleteClient = () => {
        console.clear();
        const pos =this.state.getRowPosFromTable;
        const id = this.state.filterArry[pos].id;
        console.log(id)
        const confirmDelete = window.confirm('Do you want to delete ?');
        console.clear();
        if (confirmDelete) {
            const API = DeleteClientAPI;
            Axios.delete(API + id)
                .then((response) => {
                    this.setState({showDeleteMessage:true})
                    this.getClientsData()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        this.handleDeleteClientPopUpRemove()
    }

    handlePwdField = (e) => {
        var fieldPwd = e.target.value;
        var validPwdPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        var pwd = fieldPwd.match(validPwdPattern);
        if (pwd === null) {
            this.setState({ validPwd: false })
        } else {
            this.setState({ validPwd: true })
        }
    }
    getClientsData() {
        console.clear();
        const API = GetAllClientsAPI;
        Axios.get(API)
            .then((response) => {
                const allClients = JSON.stringify(response.data.clients);
                console.log(allClients)
                sessionStorage.setItem("allClients",allClients);
                console.log(response.data.clients)
                this.setState({ responseAllClients: [...response.data.clients], showLoader:false, showAddClientMessage:false, showUpdateMessage:false, showDeleteMessage:false })
                this.setState({
                    data:[...response.data.clients],
                    searchString:[...response.data.clients],
                    filterArry:[...response.data.clients],// responseAllClients
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    componentDidMount() {
        this.getClientsData();
    }
    render() {
        const iterateAllClients = this.state.filterArry === null ? [] : this.state.filterArry.map((item, pos) => {
            return (
                {
                    name: item.client_name,
                    Address: item.address,
                    Email: item.email,
                    Phone: item.phone,                
                }
            )
        })
        const data = [...iterateAllClients]
        const columns = [{
            Header: 'Name',
            accessor: 'name', // String-based value accessors!
            className: classes.react_tbl_text_center,
            headerClassName: classes.headerClass,
        }, {
            Header: 'Address',
            accessor: 'Address',
            className: classes.react_tbl_text_center,
            headerClassName: classes.headerClass,
        },
        {
            Header: 'Email',
            accessor: 'Email',
            className: classes.react_tbl_text_center,
            headerClassName: classes.headerClass,
        },
        {
            Header: 'Phone',
            accessor: 'Phone',
            className: classes.react_tbl_text_Right,
            headerClassName: classes.headerClassRight,
        }
        ]
        return (
            <div className={classes.botsalgo_mainSection}>
              {this.state.showAddClientMessage === true ? <p className={classes.showAddMessage}>{this.state.clientNameIntVal} has been added successfully!</p>:null}
               {this.state.showUpdateMessage === true ? <p className={classes.showAddMessage}> Updated Successfully!</p> : null}
               {this.state.showDeleteMessage=== true ? <p className={classes.showAddMessage}>Deleted Successfully!</p>: null}
                <div className={classes.botsalgo_searchSection}>
                    <div className={classes.botsalgo_searchbar}>
                        <div >
                            <form>
                            <input type="text" placeholder="Search Client..."  onChange={this.handleInputChange}/>
                            <button type="button" className={classes.client_btn} onClick={this.handleAddClientPopUp}>Add Client</button>
                            </form>
                        </div>
                    </div>
                </div>
                <br />
                <br />
                <div className={classes.ClentDetailsSection} >
                {
                    this.state.showLoader ===true ? <Loader/> :
                    <ReactTable data={data} columns={columns} 
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                                onDoubleClick: (e) => {
                                       if(rowInfo){
                                        //    console.clear();
                                        //    console.log(rowInfo);
                                        // console.log(rowInfo.index);
                                        this.handleEditData(rowInfo.index)
                                        this.handleEditClientPopUpOnclickRow();
                                        this.setState({getRowPosFromTable:rowInfo.index})
                                       }
                                    }
                            }}} />
                }
               </div>
                {
                    this.state.addClentPopUP === false ? null :
                        <div className={classes.AddClent_popUp_Wrapper}>
                            <div className={classes.crossIcon } onClick={this.handleAddClientPopUpCancel}>X</div>
                            <div className={classes.Sub_Popup_Wrapper} onDoubleClick={this.handleAddClientPopUpCancel}></div>
                            <div className={classes.AddClient_popup}>
                                <div className={classes.popup_heading}><h3>Add Client</h3></div>
                                <form onSubmit={this.onSubmitClick}>
                                    <div className={classes.formDiv}>
                                        <span>Name :</span>
                                        <input type="text" required name="username" minLength={6} />
                                    </div>
                                    <div className={[classes.textarea_wrapper,classes.formDiv].join(" ")}>
                                        <span>Address : </span>
                                        <textarea name="address" minLength={10} maxLength={50}></textarea>
                                    </div>
                                    <div className={classes.formDiv}>
                                        <span>Email : </span>
                                        <input type="email" required name="email" onInput={this.handleEmailField} />
                                    </div>
                                    {
                                            this.state.validEmail === true ? null :
                                                <div style={{ color: 'red', fontSize: '12px',textAlign:'center', margin: '0px', lineHeight: '0' }}>
                                                    <p>Please enter valid Email</p>
                                                </div>
                                        }
                                    <div className={classes.formDiv}>
                                        <span>Password :</span>
                                        <input type="password" required name="pwd" onChange={this.handlePwdField}/>
                                    </div>
                                    {
                                                this.state.validPwd === true ? null :
                                                    <div  style={{ color: 'red', fontSize: '12px',textAlign:'center', margin: '0px', lineHeight: '0' }}>
                                                <p>Minimum eight characters, at least one letter, one number and one special character</p>
                                                    </div>
                                            }
                                    <div className={classes.formDiv}>
                                        <span>Role :</span>
                                        <select name="role">
                                            <option value="a" >Select Role</option>
                                            <option>Client</option>
                                            <option>SupportUser</option>
                                        </select>
                                    </div>
                                    <div className={classes.formDiv}>
                                        <span>Phone :</span>
                                        <input type="tel" required name="phone" minLength={10} maxLength={10} onInput={this.handlePhoneField} />
                                    </div>
                                    {
                                            this.state.validPhnumber === true ? null :
                                                <div style={{ color: 'red', fontSize: '12px', margin: '0px',textAlign:'center', lineHeight: '1' }}>
                                                    <p>Please enter valid phone number</p>
                                                </div>
                                        }
                                    
                                    <button type="submit" >Submit</button>
                                    <button type="reset" onClick={this.handleReset}>Reset</button>
                                    <button onClick={this.handleAddClientPopUpCancel} >Cancel</button>
                                </form>
                            </div>
                        </div>
                }
                {
                    this.state.editClientPopUp === false ? null :
                        <EditClient handleUpdateStatus={this.handleUpdateStatus} handleEditClientPopUp={this.handleEditClientPopUp} handleDeleteClient={this.handleDeleteClient} PassingDataToEditPopup={this.state.PassingDataToEditPopup} handleEditClientPopUpRemove={this.handleEditClientPopUpRemove} />
                }
            </div>
        )
    }

}
export default ClientAdd;