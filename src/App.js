import React from 'react';
import './App.css';
import Axios from 'axios';
import Topbar from './User/Topbar.js';
import ClientAdd from './Client/ClientPage';
import Exchange from './Exchange/Exchange';
import LoginPage from './User/LoginPage';
import ManualTrade from "./Transaction/Manual Trade/ManualTrade";
import TotalVolume from "./Reports/TotalVolume";
import ViewOpenTran from "./Transaction/View Open Transaction/ViewOpenTran";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { GetAllExchangesAPI, GetAllClientsAPI } from "./Utilities/API";
import HomePage from "./Home/Homepage";
import ExchangeTable from "./Home/ExchangeTable";

class App extends React.Component {
  state={
    isUserLogin : true,
    menuItemPos : 0,
    loginFormShow : true,
    getAllExchanges : [],
    getClientDataForRole:[],
    currentUser:"",
    showForgotPwd:true,
    verificationCode:false,
    userName:"",
    userId:null,
    currentClientExchanges:[],
  }

  handlecurrentUserRole=(currentUserRole,userName,userId)=>{
    this.setState({currentUser:currentUserRole,userName:userName,userId:userId})
    this.getClientsData();
  }
  handleMenuItemPos=(pos)=>{
    this.setState({menuItemPos:pos})
  }
  handlesubmitVerificationCode=()=>{
    this.setState({verificationCode:false,showForgotPwd:true,loginFormShow:true})
  }
  handleLoginStatus=()=>{
    this.setState({isUserLogin : true})
  }
  handleLogoutStatus=()=>{
    this.setState({isUserLogin : false})
  }
  handleLoginFormShow=()=>{
    this.setState({loginFormShow : true})
  }
  handleSigUpFormShow=()=>{
    this.setState({loginFormShow : false})
  }
  handleForgetPwd=()=>{
    this.setState({showForgotPwd:!this.state.showForgotPwd, loginFormShow:!this.state.loginFormShow})
  }
  //---storing exchanges and clients in session storage here //
  getAllExchangesDataForTable = () => {
    const API = GetAllExchangesAPI;
    Axios.get(API)
        .then((response) => {
         this.setState({getAllExchanges : [...response.data.exchanges]})
         const allExchanges = JSON.stringify(response.data.exchanges);
         sessionStorage.setItem("allExchanges",allExchanges);
        })
        .catch((err) => {
            console.log(err)
        })
}
getClientsData() {
    const API = GetAllClientsAPI;
    Axios.get(API)
        .then((response) => {
          this.setState({getClientDataForRole:[...response.data.clients]})
          const allClients = JSON.stringify(response.data.clients);
          console.log(allClients);
          sessionStorage.setItem("allClients",allClients);
          const getCurrenClientExchangesId= response.data.clients.map((item,pos)=>{
            if(item.client_name === this.state.userName){
                this.setState({currentClientExchanges:[...item.exchanges]})
            }
        })
        })
        .catch((err) => {
            console.log(err)
        })
}
  componentDidMount(){
    this.getAllExchangesDataForTable();
    this.getClientsData();
  }
  //--------completed---//
  render(){
//----------- nameIdPairs store in session storage to avoid null--
 const getKeys = this.state.getAllExchanges.map((item)=>{
        
      return item.id
  })
 const getValues = this.state.getAllExchanges.map((item)=>{
      return item.exchange_unique_name
  })
  const result =  getValues.reduce(function(result, field, index) {
      result[getKeys[index]] = field;
      return result;
    }, {})
  const getNameIDPairs = getKeys.reduce(function(result, field, index) {
      result[getValues[index]] = field;
      return result;
    }, {})
  const nameIdPairs= JSON.stringify(getNameIDPairs)
  sessionStorage.setItem("nameIdPairs",nameIdPairs);
  //----------- completed--//
    return (
      <BrowserRouter>
      <section>
      <Topbar  userName={this.state.userName} currentUser={this.state.currentUser} handleLogoutStatus={this.handleLogoutStatus} LoginStatus={this.state.isUserLogin} handleLoginFormShow={this.handleLoginFormShow} handleSigUpFormShow={this.handleSigUpFormShow} menuItemPos={this.state.menuItemPos} handleMenuItemPos={this.handleMenuItemPos}/>
        <Switch>
          <Route exact path={'/OpenTra'} render={()=> this.state.isUserLogin === true ? <ViewOpenTran currentClientExchanges={this.state.currentClientExchanges} userName={this.state.userName} currentUser={this.state.currentUser}/> : <Redirect to={'/Login'}/>}/>
          <Route exact path={'/TotalVolume'} render={()=> this.state.isUserLogin === true ? <TotalVolume currentClientExchanges={this.state.currentClientExchanges} userName={this.state.userName} currentUser={this.state.currentUser} /> : <Redirect to={'/Login'}/>}/>
          <Route exact path={'/ManualTra'} render={()=> this.state.isUserLogin === true ? <ManualTrade userName={this.state.userName} currentUser={this.state.currentUser} /> : <Redirect to={'/Login'}/>}/>
          <Route exact path={'/Login'} render={() => this.state.isUserLogin === false ?  < LoginPage  handleForgetPwd={this.handleForgetPwd} showForgotPwd={this.state.showForgotPwd} handlecurrentUserRole={this.handlecurrentUserRole} handleLoginStatus={this.handleLoginStatus} handleMenuItemPos={this.handleMenuItemPos} loginFormShow={this.state.loginFormShow} handleLoginFormShow={this.handleLoginFormShow} handleSigUpFormShow={this.handleSigUpFormShow} /> :  < Redirect to={'/'} /> } />
          <Route exact path={'/Exchange'} render={() => this.state.isUserLogin === true ? <Exchange userName={this.state.userName} currentUser={this.state.currentUser}  handleMenuItemPos={this.handleMenuItemPos} /> : < Redirect to={'/Login'} /> } />
          <Route exact path={'/Client'} render={() => this.state.isUserLogin === true ? <ClientAdd/> : < Redirect to={'/Login'} /> } />
          <Route exact path={"/ExchangeTable"} render={() => this.state.isUserLogin === true ? <ExchangeTable userId={this.state.userId} userName={this.state.userName} currentUser={this.state.currentUser}/> : < Redirect to={'/Login'} /> } />
          <Route exact path={"/"} render={()=>this.state.isUserLogin === false ? <Redirect to ={'/Login'}/> : <HomePage userId={this.state.userId} currentUser={this.state.currentUser} userName={this.state.userName}/>} />
        </Switch>
      </section>
      </BrowserRouter>
    );
  }
}
export default App;

