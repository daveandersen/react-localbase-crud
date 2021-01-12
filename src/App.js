//GOAL
//1. Fix Update
//2. Solve Delete
//3. Complete Axios

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
    // let check = window.localStorage.getItem('data');
    let check = db.collection('messages').get();
    console.log(check);

    // db.collection('messages').add()

    // db.collection('messages').get()
    //   .then((messages) => {
    //     if (messages.length > 0 && Array.isArray(messages)) {
    //       this.setState({ data: messages })
    //     } else {
    //       console.log("Error");
    //     }
    //   })
    MessageService.getAll().then((response) => {
      console.log(response)
      this.setState({data: response.data})
    })
    

    // db.collection('messages').get()
    // .then((messages) => {
    //   const response = messages.json();

    //   response.then(function(response){
    //     this.setState(response)
    //   })
    // })

    // const length = db.collection('messages').get().then( messages => {
    //   return Promise.resolve(messages.length)
    // })

    // check = JSON.parse(check);
    // if (Array.isArray(check) && check.length > 0) {
    //   this.setState({data: check});
    // }

    // if (typeof(check) === 'object' && Object.values(check) > 0){
    //   this.setState({data: check})
    // }
  }

  componentDidUpdate(prevProps, prevState, preState) {
    // console.log(preState);
    // console.log(prevState)

  }

  submitForm = (e) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    this.setState(
      (prevState) => ({ data: [...prevState.data, inputValue] }),
      (prevState) => {
        // window.localStorage.setItem('data', JSON.stringify(this.state.data));
        console.log(this.state.data)
        db.collection('messages').add({
          id: this.state.data.length-1,
          message: inputValue
        })
      }
    );
    MessageService.createData({
      id: this.state.data.length,
      message: inputValue
    });
    // db.collection('messages').add({
      
    // })
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
      // window.localStorage.setItem('data', JSON.stringify(this.state.data));
      db.collection('messages').doc({ id: messageid }).update({
        id: messageid, 
        message: inputValue
      })
    });
    MessageService.get(messageid).then((oldData) => {
      console.log(oldData.data[0]._id);
      console.log(data[isEditable])
      MessageService.updateData(oldData.data[0]._id, data[isEditable])
    })
  }


  deleteData = messageid => () => {
    const { data, isEditable } = this.state;
    const newData = [...data];
    const filteredData = newData.filter((input, index) => index !== isEditable);
    this.setState({ data: filteredData, isEditable: null }, () => {
      // window.localStorage.setItem('data', JSON.stringify(this.state.data));
      db.collection('messages').doc({ id: messageid }).delete()
    });
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
