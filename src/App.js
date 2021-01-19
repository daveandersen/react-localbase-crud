import React from 'react';
import './App.css';
import Localbase from 'localbase';
import MessageService from './services/messageService'
import worker from './WebWorkers/worker.js'
import WebWorker from './WebWorkers/workerSetup'

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

    db.collection('messages').get().then(async (messages) => {
      messages.forEach((message) => {localbaseIDs = localbaseIDs + '' + message.id})
      await MessageService.getAll().then((messages) => {
        messages.data.forEach((message) => {dbIDs = dbIDs + '' + message.id});
        
      })
    }).finally(() => {
      if(dbIDs === localbaseIDs){
        var stateData = [];
        db.collection('messages').get().then((messages) => {
          messages.forEach((message) => {stateData.push(message)})
          this.setState({ data : stateData })
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
    await db.collection('messages').delete()
      .then(async () => {
        await MessageService.getAll().then((messages) => {
          messages.data.forEach((message) => {
            const inputData = {
              id: message.id,
              message: message.message
            }
            inputDataArray.push(inputData)
        })
  
        inputDataArray.forEach((inputData) => {
          db.collection('messages').add(inputData)
        })
      })
      .then(async () => {
        await db.collection('messages').get().then((messages) => {
          messages.forEach((message) => {stateData.push(message)})
          this.setState({ data : stateData }, () => {
            console.log('Sync Success.')
          })
        })
      })
      })
  }

  submitForm = (e) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    this.worker.postMessage({type: 'Input', value: inputValue})
    this.worker.addEventListener = e => {
      console.log(e.data)
    }
    MessageService.getAll().then(async (messages) => {
      const inputData = {
        id: messages.data.length,
        message: inputValue
      }
      await MessageService.createData(inputData)
      
    }).then(() =>
      this.localbaseDBSync()
    )
    
    }
    

  edit = (index) => {
    this.setState({ isEditable: index });
  }

  updateForm = (e, messageid) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    const { data, isEditable } = this.state;
    console.log(messageid)

    data[isEditable].message = inputValue;
    
    this.setState({ data: data }, () => {
      db.collection('messages').doc({ id: messageid }).update({
        id: messageid, 
        message: inputValue
      })
    });
    MessageService.get(messageid).then((oldData) => {
      MessageService.updateData(oldData.data[0]._id, data[isEditable])
    })
    this.localbaseDBSync();
  }

  deleteData = messageid => () => {
    const { data, isEditable } = this.state; 

    const filteredData = data.filter((input, index) => index !== isEditable);
    this.setState({ data: filteredData, isEditable: null }, () => {
      db.collection('messages').doc({ id: messageid }).delete()
    });

    MessageService.get(messageid).then((oldData) => {
      MessageService.deleteData(oldData.data[0]._id)
    })
    this.localbaseDBSync();
  }

  deleteAll = () => {
    this.setState({data : []})
    MessageService.deleteAll();
    db.collection('messages').delete();
    this.localbaseDBSync();
  }


  render() {
    const { data, isEditable } = this.state;
    
    return (
      <div className="app">
        <form onSubmit={(e) => this.submitForm(e)}>
          <input type="text" name="input" />
          <button type="submit">Add</button>
        </form>
        <div className="data">
          <ul>
            {data.map((input, index) => ( 
              <li key={input.message + index}>
                <div>
                  {input.message}
                  <button onClick={() => this.edit(index)}>Edit</button>
                </div>
                <div style={{ display: `${isEditable !== index ? 'none' : 'block'}` }}>
                  <form onSubmit={(e) => this.updateForm(e, input.id)}>
                    <input type="text" name="input" defaultValue={input.message} />
                    <button type="submit">update</button>
                  </form>
                  <button type='button' onClick={this.deleteData(input.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {this.state.data.length > 0 ? <button onClick={this.deleteAll}>Clear</button> :<></>}
        </div>
      </div>
    )
  }
}

export default App
