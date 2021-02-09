import React from 'react';
import './App.css';
import worker from './WebWorkers/worker.js';
import WebWorker from './WebWorkers/workerSetup';
import _ from 'lodash';

var myWorker = new WebWorker(worker);

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      isEditable: null,
      username: [],
      password: [],
      carID: [],
      lastAction: null
    };
  }

  componentDidMount() {
    this.localbaseDBSync();
    // this.syncData();
  }

  localbaseDBSync = () => {
    myWorker.postMessage({type: "Get All"});
    myWorker.onmessage = (localUsers) => { 
      var dbIDs = "";  
      var localbaseIDs = "";

      localUsers.data.forEach((user) => { localbaseIDs = localbaseIDs + '' + user.id})
      myWorker.postMessage({type: "Get all users"});
      myWorker.onmessage = (users) => {
        users.data.forEach((user) => { dbIDs = dbIDs + '' + user.id });
        console.log(dbIDs);
        console.log(localbaseIDs)
        if (dbIDs === localbaseIDs) {
          this.updateState();
        } else {
          console.log('Syncing.')
          this.syncData();
        }
      }
    }
  }

  syncData = () => {
    myWorker.postMessage({type: "Get all users"}); 
    myWorker.onmessage = (users) => {
      myWorker.postMessage({type: "Get All"});
      myWorker.onmessage = (localusers) => {
        switch(this.state.lastAction){
          case "INSERT":
            const inputData = {
              id: users.data.length,
              username: users.data[users.data.length-1].username,
              password: users.data[users.data.length-1].password,
              carID: users.data[users.data.length-1].carID
            }
            myWorker.postMessage({type: "Create User", value: inputData});
            break;
          case "UPDATE":
            const { isEditable } = this.state; 
            console.log(users.data[isEditable]); 
            // console.log(!_.isEqual(users, localusers))
            // console.log(users.data)
            if(!_.isEqual(users, localusers)){
              myWorker.postMessage({type:"Update One", value: users.data[isEditable]});
            }
              
            break;
          
          case "DELETE":

            break;

          default:
            myWorker.postMessage({type: "Delete User"});
            users.data.forEach((user) => {
            const inputData = {
              id: user.id,
              username: user.username,
              password: user.password,
              carID: user.carID
            }
            myWorker.postMessage({type: "Create User", value: inputData})
          });
            break;
        };
        this.updateState();
      }
    }
  } 
  
  updateState = () => {
    var stateData = []; 
    myWorker.postMessage({type: "Get All"})
    myWorker.onmessage = (users) => {
      if(Array.isArray(users.data)) {
        users.data.forEach((user) => stateData.push(user));
        this.setState({data: stateData})
      }
      
    }
  }

  submitForm = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const carID = e.target.carID.value; 

    myWorker.postMessage({type: "Input User", username: username, password: password, carID: carID})
    myWorker.onmessage = (e) => { 
      if(e.data === 'Success'){
        this.setState({lastAction: "INSERT"})
        this.localbaseDBSync();
      }
    } 
  }

  edit = (index) => {
    this.setState({ isEditable: index });
  }

  updateForm = (e, userid) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const carID = e.target.carID.value;
    const { data, isEditable } = this.state; 

    data[isEditable].username = username;
    data[isEditable].password = password;
    data[isEditable].carID = carID; 

    myWorker.postMessage({type: "Get one user", value: {id: userid}});
    myWorker.onmessage = (user) => {
      myWorker.postMessage({type: "UpdateOne", value: {id: user.data[0]._id, username: username, password: password, carID: carID}})
      myWorker.onmessage = (result) => {
      if(result.data === 'Success'){
        this.setState({lastAction: "UPDATE"})
        this.syncData();
      };
    }
    }
    

  }

  deleteData = userid => () => {
    
    myWorker.postMessage({type: "Get one user", value: {id: userid}}); 
    myWorker.onmessage = (user) => {
      myWorker.postMessage({type: "DeleteOne", value: {id: user.data[0]._id}})
      myWorker.onmessage = (result) => { 
        if(result.data === 'Success'){
          this.syncData();
        };
      }
    }
  }

  deleteAll = () => {
    myWorker.postMessage({type: "DeleteAll"})
    myWorker.onmessage = (result) => {
      if(result.data === 'Success'){
        this.syncData();
      }
    }
  }

  getUsername = (e) => {
    e.preventDefault();
    myWorker.postMessage({type: "Get Username"})
    myWorker.onmessage = ($event) => {
      this.setState({username: $event.data})
    }
  }

  getPassword = (e) => {
    e.preventDefault();
    myWorker.postMessage({type: "Get Password"})
    myWorker.onmessage = ($event) => {
      this.setState({password: $event.data})
    }
  }

  getCarID = (e) => {
    e.preventDefault();
    myWorker.postMessage({type: "Get CarID"})
    myWorker.onmessage = ($event) => {
      this.setState({carID: $event.data})
    }
  }

  getAll = (e) => {
    e.preventDefault();
    myWorker.postMessage({type: "Get All"})
    myWorker.onmessage = ($event) => {
      console.log($event.data);
    }
  }


  render() {
    const { data, isEditable, username, password, carID} = this.state;

    return (
      <div>
        <form onSubmit={(e) => this.submitForm(e)}>
          Username: <input type="text" name="username" />
          <br></br>
          Password: <input type="text" name="password" />
          <br></br>
          carID: <input type="text" name="carID" />
          <br></br>
          <button type="submit">Add</button>
        </form>
        <div>
          <br/>
          <table>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>carID</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            {data.map((input, index) => (
              <tr>
                <th>{input.username}</th>
                <th>{input.password}</th>
                <th>{input.carID}</th>
                <th>
                  <div>
                    <button onClick={() => this.edit(index)}>Edit</button>
                  </div>
                  <div style={{ display: `${isEditable !== index ? 'none' : 'block'}` }}>
                    <form onSubmit={(e) => this.updateForm(e, input.id)}>
                      <br></br>
                    Username: <input type="text" name="username" defaultValue={input.username} />
                      <br></br>
                    Password: <input type="text" name="password" defaultValue={input.password} />
                      <br></br>
                    carID: <input type="text" name="carID" defaultValue={input.carID} />
                      <button type="submit">update</button>
                    </form>
                  </div>
                </th>
                <th>
                  <button type='button' onClick={this.deleteData(input.id)}>
                    Delete
                  </button>
                </th>
              </tr>
            ))}
          </table>
          {this.state.data.length > 0 ? <button onClick={this.deleteAll}>Clear</button> : <></>}
        </div>
        <br />
        <div>
          <button onClick = {this.getUsername}>Get Username</button>
          <button onClick = {this.getPassword}>Get Password</button>
          <button onClick = {this.getCarID}>Get carID</button>
          <button onClick = {this.getAll}>Get All</button>
          <table>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
            {username.map((user, index) => (
              <tr>
                <th>{user.id}</th>
                <th>{user.username}</th>
              </tr>
            ))}
          </table>
          <br/>
          <table>
            <tr>
              <th>ID</th>
              <th>Password</th>
            </tr>
            {password.map((user, index) => (
              <tr>
                <th>{user.id}</th>
                <th>{user.password}</th>
              </tr>
            ))}
          </table>
          <br/>
          <table>
            <tr>
              <th>ID</th>
              <th>CarID</th>
            </tr>
            {carID.map((user, index) => (
              <tr>
                <th>{user.id}</th>
                <th>{user.carID}</th>
              </tr>
            ))}
          </table>
          <br/>
        </div>
      </div>
    )
  }
}

export default App
