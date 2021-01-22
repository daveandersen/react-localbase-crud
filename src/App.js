import React from 'react';
import './App.css';
// import Localbase from 'localbase';
// import userService from './services/userService';
import worker from './WebWorkers/worker.js';
import WebWorker from './WebWorkers/workerSetup';

// let db = new Localbase('db')
// import worker_script from './WebWorkers/worker.js';
var myWorker = new WebWorker(worker);

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      isEditable: null,
    };
  }

  componentWillMount() {
    // this.localbaseDBSync();
    myWorker.onmessage = ($event) => {
      console.log("Client Username", $event.data)
    };

    this.createTable("db", 3, "users")
  }

  createTable(dbName, dbversion, tableName) {
    var request = indexedDB.open(dbName, dbversion);
    request.onupgradeneeded = function (e) {
      var database = e.target.result;
      var objectStore = database.createObjectStore(tableName);
      console.log("Object Store Created");
    };
    request.onsuccess = function (e) {
      var database = e.target.result;

      //code to verify that the table was created    
      database.objectStoreNames.contains("storeName");

      database.close();
    }
    request.onerror = function (e) {
      console.error(e.target.error.message);
    }
  }

  getUsername = async () => {
    console.log("Get Username Clicked")

    myWorker.postMessage({ type: "Get Username" });
  }

  // localbaseDBSync = () => {
  //   var dbIDs = "";
  //   var localbaseIDs = "";

  //   db.collection('users').get().then(async (users) => {
  //     users.forEach((user) => { localbaseIDs = localbaseIDs + '' + user.id })
  //     await userService.getAll().then((users) => {
  //       users.data.forEach((user) => { dbIDs = dbIDs + '' + user.id });

  //     })
  //   }).finally(() => {
  //     console.log(dbIDs);
  //     console.log(localbaseIDs)
  //     if (dbIDs === localbaseIDs) {
  //       var stateData = [];
  //       db.collection('users').get().then((users) => {
  //         users.forEach((user) => { stateData.push(user) })
  //         this.setState({ data: stateData })
  //       })
  //     } else {
  //       console.log('Syncing.')
  //       this.syncData();
  //     }
  //   })

  // }

  // syncData = async () => {
  //   var stateData = [];
  //   var inputDataArray = [];
  //   await db.collection('users').delete()
  //     .then(async () => {
  //       await userService.getAll().then((users) => {
  //         users.data.forEach((user) => {
  //           const inputData = {
  //             id: user.id,
  //             username: user.username,
  //             password: user.password,
  //             carID: user.carID
  //           }
  //           inputDataArray.push(inputData)
  //         })

  //         inputDataArray.forEach((inputData) => {
  //           db.collection('users').add(inputData)
  //         })
  //       })
  //         .then(async () => {
  //           await db.collection('users').get().then((users) => {
  //             users.forEach((user) => { stateData.push(user) })
  //             this.setState({ data: stateData }, () => {
  //               console.log('Sync Success.')
  //             })
  //           })
  //         })
  //     })
  // }

  submitForm = (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;
    const carID = e.target.carID.value;

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
    console.log(userid)

    data[isEditable].username = username;
    data[isEditable].password = password;
    data[isEditable].carID = carID;

    // this.setState({ data: data }, () => {
    //   db.collection('users').doc({ id: userid }).update({
    //     id: userid,
    //     username: username,
    //     password: password,
    //     carID: carID

    //   })
    // });
    // userService.get(userid).then((oldData) => {
    //   userService.updateData(oldData.data[0]._id, data[isEditable])
    // })
    // this.localbaseDBSync();
  }

  deleteData = userid => () => {
    const { data, isEditable } = this.state;

    const filteredData = data.filter((input, index) => index !== isEditable);
    // this.setState({ data: filteredData, isEditable: null }, () => {
    //   db.collection('users').doc({ id: userid }).delete()
    // });

    // userService.get(userid).then((oldData) => {
    //   userService.deleteData(oldData.data[0]._id)
    // })
    // this.localbaseDBSync();
  }

  deleteAll = () => {
    this.setState({ data: [] })
    // userService.deleteAll();
    // db.collection('users').delete();
    // this.localbaseDBSync();
  }

  render() {
    const { data, isEditable } = this.state;

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
          <br />
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
          <button onClick={this.getUsername}>Get Username</button>
          <button>Get Password</button>
          <button>Get carID</button>
          <ul>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
