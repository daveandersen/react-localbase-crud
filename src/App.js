import React from 'react';
import './App.css';
import Localbase from 'localbase';
import userService from './services/userService';
import worker from './WebWorkers/worker.js';
import WebWorker from './WebWorkers/workerSetup';

let db = new Localbase('db')

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      isEditable: null,
    };
  }

  componentDidMount() {
    this.localbaseDBSync();
    this.worker = new WebWorker(worker);
  }

  localbaseDBSync = () => {
    var dbIDs = "";
    var localbaseIDs = "";

    db.collection('users').get().then(async (users) => {
      users.forEach((user) => { localbaseIDs = localbaseIDs + '' + user.id })
      await userService.getAll().then((users) => {
        users.data.forEach((user) => { dbIDs = dbIDs + '' + user.id });

      })
    }).finally(() => {
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
    })

  }

  syncData = async () => {
    var stateData = [];
    var inputDataArray = [];
    await db.collection('users').delete()
      .then(async () => {
        await userService.getAll().then((users) => {
          users.data.forEach((user) => {
            const inputData = {
              id: user.id,
              username: user.username,
              password: user.password,
              description: user.description
            }
            inputDataArray.push(inputData)
          })

          inputDataArray.forEach((inputData) => {
            db.collection('users').add(inputData)
          })
        })
          .then(async () => {
            await db.collection('users').get().then((users) => {
              users.forEach((user) => { stateData.push(user) })
              this.setState({ data: stateData }, () => {
                console.log('Sync Success.')
              })
            })
          })
      })
  }

  submitForm = (e) => {
    e.preventDefault();

    const username = e.target.input.value;
    const password = e.target.password.value;
    const description = e.target.description.value;

    userService.getAll().then(async (users) => {
      const inputData = {
        id: users.data.length,
        username: username,
        password: password,
        description: description
      }
      await userService.createData(inputData)

    }).then(() =>
      this.localbaseDBSync()
    )

  }

  edit = (index) => {
    this.setState({ isEditable: index });
  }

  updateForm = (e, userid) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    const { data, isEditable } = this.state;
    console.log(userid)

    data[isEditable].user = inputValue;

    this.setState({ data: data }, () => {
      db.collection('users').doc({ id: userid }).update({
        id: userid,
        user: inputValue
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


  render() {
    const { data, isEditable } = this.state;

    return (
      <div>
        <form onSubmit={(e) => this.submitForm(e)}>
          Username: <input type="text" name="input" />
          <br></br>
          Password: <input type="text" name="password"/>
          <br></br>
          Description: <input type="text" name="description"/>
          <br></br>
          <button type="submit">Add</button>
        </form>
        <div>
          <ul>
            {data.map((input, index) => (

              <li key={input.username + index}>
                <div>
                  <label>
                  Username: 
                  </label>
                  {input.username}
                  <button onClick={() => this.edit(index)}>Edit</button>
                </div>
                <div style={{ display: `${isEditable !== index ? 'none' : 'block'}` }}>
                  <form onSubmit ={(e) => this.updateForm(e, input.id)}>
                    <input type="text" name="input" defaultValue={input.username} />
                    <button type="submit">update</button>
                  </form>
                  <button type='button' onClick={this.deleteData(input.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {this.state.data.length > 0 ? <button onClick={this.deleteAll}>Clear</button> : <></>}
        </div>
        <br/>
        <div>
          <button>Get Username</button>
          <button>Get Password</button>
          <button>Get Description</button>
          <ul>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
