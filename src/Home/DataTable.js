import React from "react";
import classes from './DataTable.module.css';
import Axios from 'axios';  
import UpdateVolume from "./UpdateVolume";
import EditExchange from "./EditDataTable";
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css';
import { GetAllExchangesAPI, GetAllClientsAPI, DeleteExchangeAPI } from '.././Utilities/API';
import Loader from "../Utilities/Loader";
import { withRouter } from 'react-router-dom';


class DatatablePage extends React.Component {
    state = {
        showUpdateVolPopUp: false,
        showEditExchangePopUp: false,
        getAllExchanges : [],
        passUpdateVolumeData:[],
        passEditExchangeData:[],
        responseAllClients:[],
        getRowPosFromTable:null,
        showLoader:true,
        ShowUpdateStatus:false,
        showDeleteStatus:false,
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
                const name=item.exchange_unique_name.toLowerCase()
                if(name.startsWith(searchString.toLowerCase())){

                    return true;

                }else{
                    return false;
                }
            })           
            this.setState({filterArry:filteredData})
        }else{
            const user = this.props.currentUser;
            const userName = this.props.userName;
            this.setState({filterArry:responseData})
        }
    }
    handleUpdateStatus=()=>{
        this.setState({ShowUpdateStatus:true})
    }
    handleUpdateVolPopUp = () => {
        this.setState({ showUpdateVolPopUp: !this.state.showUpdateVolPopUp, showLoader:true });
        this.handleScrollBar()
    }
    handlePopUpUpdateBtnOnClick=()=>{
        this.setState({ showUpdateVolPopUp: !this.state.showUpdateVolPopUp });
        this.handleScrollBar() 
    }
    handleUpdateVolPopUpCancel=()=>{
        this.setState({ showUpdateVolPopUp: !this.state.showUpdateVolPopUp, showLoader:false });
        this.handleScrollBar()
    }
    handleUpdateVolume=(pos)=>{
        // alert(pos)
        const volumeData = this.state.filterArry.filter((item)=>{
            if(item.id === pos){
               return true;
            }else{
                return false;
            }
        })
        this.setState({passUpdateVolumeData:volumeData});
    }
    handleEditExchangeData=(pos)=>{
        const volumeData = this.state.filterArry.filter((item)=>{
            if(item.id === pos){
               return true;
            }else{
                return false;
            }
        })
       this.setState({passEditExchangeData:volumeData});
        // if(pos!==undefined && pos!== null){
        //     this.setState({passEditExchangeData : this.state.filterArry[pos]});
        // }
    }
    handleEditExchangePopUpCancel=()=>{
        this.setState({ showEditExchangePopUp: !this.state.showEditExchangePopUp, showLoader:false });
        this.handleScrollBar()
    }
    handleEditExchangePopUp = () => {
        this.setState({ showEditExchangePopUp: !this.state.showEditExchangePopUp, showLoader:true });
        this.handleScrollBar()
    }
    
    handleScrollBar=()=>{
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
    handleCancelEditExchange = () => {
        this.setState({ showEditExchangePopUp: !this.state.showEditExchangePopUp })
    }
    getAllExchangesDataForTable = () => {
        const API = GetAllExchangesAPI;
        Axios.get(API)
            .then((response) => {
                const allExchanges = JSON.stringify(response.data.exchanges);
                sessionStorage.setItem("allExchanges",allExchanges);
                this.setState({getAllExchanges : [...response.data.exchanges]})
                this.setState({showLoader:false, ShowUpdateStatus:false, showDeleteStatus:false});
                this.setState({
                    data:[...response.data.exchanges],
                    searchString:[...response.data.exchanges],
                    filterArry:[...response.data.exchanges],// responseAllExchanges
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    getClientsData() {
        const API = GetAllClientsAPI;
        Axios.get(API)
            .then((response) => {
                this.setState({ responseAllClients: [...response.data.clients] })
                const allClients = JSON.stringify(response.data.clients);
                sessionStorage.setItem("allClients",allClients);
            })
            .catch((err) => {
                console.log(err)
            })
    }
    handleDeleteExchange = () => {
        const Id = this.state.getRowPosFromTable;
        const confirmDelete = window.confirm('Do you want to delete ?')
        if (confirmDelete) {
            const API = DeleteExchangeAPI;
            Axios.delete(API + Id)
                .then((response) => {
                    this.handleDeleteUpdate()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
    handleDeleteUpdate=()=>{
        this.getAllExchangesDataForTable()
        this.setState({showEditExchangePopUp:false, showLoader:true, showDeleteStatus:true})
        this.handleScrollBar()
    }
    componentDidMount() {
        this.getAllExchangesDataForTable()
        this.handleScrollBar()
        this.getClientsData()
    }
    render() {
        const {responseAllClients }=this.state
        const getKeys = this.state.responseAllClients.map((item)=>{
        
            return item.id
        })
        const getValues = this.state.responseAllClients.map((item)=>{
            return item.client_name
        })
        const result =  getValues.reduce(function(result, field, index) {
            result[getKeys[index]] = field;
            return result;
          }, {})
     //-------NOTE:-send here client ids by using session storage to edit form
         sessionStorage.setItem("clientIds", JSON.stringify(result))

         const user = this.props.currentUser;
        const userName = this.props.userName;
        const userId = this.props.userId;
        let responseData = this.state.filterArry;
        const GenerateDataBasedRole = responseData.filter((item)=>{
            if(user === "Client" && userId === item.client_id){
                return true;
            }else if(user !== "Client"){
                return true;
            }else{
                return false;
            }
        })
        const getAllExchangesData = GenerateDataBasedRole === null ? [] :GenerateDataBasedRole.map((item, pos) => {
            const user = this.props.currentUser;
            const userName = this.props.userName;
                return (
                    {
                        name:result[item.client_id],
                        id:item.id,
                        exeUname: item.exchange_unique_name,
                        volume: item.total_volume,
                        hours: item.total_hours,
                        status: item.is_scheduler_running === "Y" ? <p style={{ color: "green" }}> Active</p> : <p style={{ color: "red" }}>Inactive</p>,
                        Action: <div className={classes.actionIcons}>
                            <div>
                            </div>
                            <div>
                                <button onClick={() => {
                                    this.handlePopUpUpdateBtnOnClick();
                                    this.handleUpdateVolume(item.id)
                                }}>Update Volume</button>
                            </div>
                        </div>
                    }
                )
            
        })
        const data = [...getAllExchangesData]
        const columns = [
            {
                Header: "Client Name", //  column th
                accessor: "name", // td
                sortable: true,
                center: true,
                className: classes.react_tbl_text_left,
                headerClassName: classes.headerClassLeft,
            },
            {
                Header: "Exchange",
                accessor: "exeUname",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_left,
                headerClassName: classes.headerClassLeft,

            },
            {
                Header: "Volume",
                accessor: "volume",
                sortable: true,
                right: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Hours",
                accessor: "hours",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_center,
                headerClassName: classes.headerClass,
            },
            {
                Header: "Status",
                accessor: "status",
                sortable: true,
                center: true,
                className: classes.react_tbl_text_left,
                headerClassName: classes.headerClassLeft,

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
            <div>
                {
                    this.state.ShowUpdateStatus===true?<p className={classes.updateStatus}>Updated Successfully!</p> : null
                }
                {
                    this.state.showDeleteStatus===true?<p className={classes.updateStatus} >Deleted Successfully!</p> : null
                }
                <div className={classes.tableMainSection}>
                
                  
                      <div>
                      <div className={classes.searchSection}>
                      <h2>BOTs Dashboard</h2>
                <input className={classes.searchBarWrapper} type="text" placeholder="Search Exchange..."  onChange={this.handleInputChange}/>
                  </div>
                  {
                      this.state.showLoader === true ? <Loader/> : 
                  <ReactTable data={data} columns={columns}   getTdProps={(state, rowInfo, column, instance) => {
  return {
          onDoubleClick: (e) => {
                 if(rowInfo){
                     this.handleEditExchangeData(rowInfo.original.id)
                //   this.handleEditExchangeData(rowInfo.index)
                  this.setState({showEditExchangePopUp:true})
                //   this.setState({getRowPosFromTable:rowInfo.index})
                this.setState({getRowPosFromTable:rowInfo.original.id})
                 }
              }
      }}} />
               }  
               </div>   
                  
                </div>
                {
                    this.state.showUpdateVolPopUp === false ? null :  <UpdateVolume handleUpdateVolPopUp={this.handleUpdateVolPopUp} handleUpdateStatus={this.handleUpdateStatus} handleUpdateVolPopUpCancel={this.handleUpdateVolPopUpCancel} passUpdateVolumeData={this.state.passUpdateVolumeData} getAllExchangesDataForTable={this.getAllExchangesDataForTable}/>

                }
                {
                    this.state.showEditExchangePopUp === false ? null : <EditExchange handleUpdateStatus={this.handleUpdateStatus} handleEditExchangePopUpCancel={this.handleEditExchangePopUpCancel} passEditExchangeData={this.state.passEditExchangeData} handleDeleteExchange={this.handleDeleteExchange} handleEditExchangePopUp={this.handleEditExchangePopUp} getAllExchangesDataForTable={this.getAllExchangesDataForTable}/>

                }
            </div>
        )
    }
}
export default withRouter(DatatablePage);