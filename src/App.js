import React from 'react';
import './App.css';
import Localbase from 'localbase';
import userService from './services/userService';
import worker from './WebWorkers/worker.js';
import WebWorker from './WebWorkers/workerSetup';

let db = new Localbase('db')
var myWorker = new WebWorker(worker);

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      isEditable: null,
      username: [],
      password: [],
      carID: []
    };
  }

  componentDidMount() {
    this.localbaseDBSync();
  }

  localbaseDBSync = () => {
    var dbIDs = "";
    var localbaseIDs = "";
    
    db.collection('users').get().then((users) => {
      users.forEach((user) => { localbaseIDs = localbaseIDs + '' + user.id })
      myWorker.postMessage({type: "Get all users"});
      myWorker.onmessage = (users) => {
        users.data.forEach((user) => { dbIDs = dbIDs + '' + user.id });
        console.log(dbIDs);
        console.log(localbaseIDs)
        if (dbIDs === localbaseIDs) {
          var stateData = [];
          db.collection('users').get().then((users) => {
            users.forEach((user) => { stateData.push(user) })
            this.setState({ data: stateData })
          })
        } else {
          console.log('Syncing.')
          this.syncData();
        }
      }
      
    })
    

  }

  syncData = () => {
    myWorker.postMessage({type: "Get all users"});
    myWorker.onmessage = (users) => {
      db.collection('users').delete();
      console.log("Localbase deleted")

      users.data.forEach((user) => {
        const inputData = {
          id: user.id,
          username: user.username,
          password: user.password,
          carID: user.carID
        }
        db.collection('users').add(inputData)
        console.log('Inputted to localbase: ' , inputData) 
        
      })
    } 
    var stateData = [];
    db.collection('users').get().then((users) => {
      users.forEach((user) => { stateData.push(user) })
      console.log(stateData)
      this.setState({ data: stateData })
    })
    
    
  }

  submitForm = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const carID = e.target.carID.value; 

    myWorker.postMessage({type: "Input User", username: username, password: password, carID: carID})
    myWorker.onmessage = (e) => { 
      console.log(e.data);
      if(e.data === 'Success'){
        this.localbaseDBSync();
      }
    } 
    
    // userService.getAll().then(async (users) => {
    //   const inputData = {
    //     id: users.data.length,
    //     username: username,
    //     password: password,
    //     carID: carID
    //   }
    //   await userService.createData(inputData)

    // }).then(() =>
    //   this.localbaseDBSync()
    // )

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
    console.log(userid);

    data[isEditable].username = username;
    data[isEditable].password = password;
    data[isEditable].carID = carID;

    this.setState({ data: data }, () => {
      db.collection('users').doc({ id: userid }).update({
        id: userid,
        username: username,
        password: password,
        carID: carID

      })
    });
    userService.get(userid).then((oldData) => {
      userService.updateData(oldData.data[0]._id, data[isEditable])
    })
    this.localbaseDBSync();
  }

  deleteData = userid => () => {
    const { data, isEditable } = this.state;

    const filteredData = data.filter((input, index) => index !== isEditable);
    this.setState({ data: filteredData, isEditable: null }, () => {
      db.collection('users').doc({ id: userid }).delete()
    });

    userService.get(userid).then((oldData) => {
      userService.deleteData(oldData.data[0]._id)
    })
    this.localbaseDBSync();
  }

  deleteAll = () => {
    this.setState({ data: [] })
    userService.deleteAll();
    db.collection('users').delete();
    this.localbaseDBSync();
  }

  getUsername = (e) => {
    e.preventDefault();
    var usernameArray = [];
    myWorker.postMessage({type: "Get Username"})
    myWorker.onmessage = ($event) => {
      console.log("Username: ", $event.data.username);
      usernameArray.push($event.data)
      console.log(usernameArray)
      this.setState({username: usernameArray})
      console.log(this.state.username)
    }
  }

  getPassword = (e) => {
    e.preventDefault();
    var passwordArray = [];
    myWorker.postMessage({type: "Get Password"})
    myWorker.onmessage = ($event) => {
      console.log("Password: ", $event.data.password);
      passwordArray.push($event.data)
      console.log(passwordArray)
      this.setState({password: passwordArray})
      console.log(this.state.password)
    }
  }

  getCarID = (e) => {
    e.preventDefault();
    var carIDArray = [];
    myWorker.postMessage({type: "Get CarID"})
    myWorker.onmessage = ($event) => {
      console.log("CarID: ", $event.data.carID);
      carIDArray.push($event.data)
      console.log(carIDArray)
      this.setState({carID: carIDArray})
      console.log(this.state.carID)
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
