import React from 'react';
import './App.css';
import Localbase from 'localbase';
import axios from 'axios';
import MessageService from './services/messageService'

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
     db.collection('messages').get()
      .then((messages) => {
        if (messages.length > 0 && Array.isArray(messages)) {
          this.setState({ data: messages })
        } else {
          console.log("Empty Data");
        }
      })
  }

  submitForm = (e) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    const inputData = {
      id: this.state.data.length,
      message: inputValue
    }
    this.setState(
      (prevState) => ({ data: [...prevState.data, inputData] }),
      () => {
        console.log(this.state.data)
        db.collection('messages').add(inputData)
      }
    );

    MessageService.createData(inputData)
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
  }

  deleteData = messageid => () => {
    const { data, isEditable } = this.state; 

    const filteredData = data.filter((input, index) => index !== isEditable);
    this.setState({ data: filteredData, isEditable: null }, () => {
      console.log("Hello")
      db.collection('messages').doc({ id: messageid }).delete()
    });

    MessageService.get(messageid).then((oldData) => {
      console.log("Hai")
      MessageService.deleteData(oldData.data[0]._id)
    }) 
  }

  render() {
    const { data, isEditable } = this.state;
    console.log(data)

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
        </div>
      </div>
    )
  }
}

export default App
