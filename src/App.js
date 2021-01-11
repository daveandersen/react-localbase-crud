//GOAL
//1. Fix Update
//2. Solve Delete
//3. Complete Axios

import React from 'react';
import './App.css';
import Localbase from 'localbase';

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

    db.collection('messages').get()
      .then((messages) => {
        if (messages.length > 0 && Array.isArray(messages)) {
          this.setState({ data: messages })
        } else {
          console.log("Error");
        }
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

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState)
    // console.log(this.state.data)
    /* db.collection('messages').get()
      .then((messages) => {
        if (messages.length > 0 && Array.isArray(messages)) {
          this.setState({data: messages})
        } else {
          console.log("Error");
        }
      }) */
  }

  submitForm = (e) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    this.setState(
      (prevState) => ({ data: [...prevState.data, inputValue] }),
      () => {
        // window.localStorage.setItem('data', JSON.stringify(this.state.data));
        console.log(this.state.data)
        db.collection('messages').add({
          id: Date.now(),
          messages: inputValue
        })
      }
    );
  }

  edit = (index) => {
    this.setState({ isEditable: index });
  }

  updateForm = (e, messageid) => {
    e.preventDefault();
    const inputValue = e.target.input.value;
    const { data, isEditable } = this.state;
    const newData = [...data];
    newData[isEditable] = inputValue;
    console.log(isEditable)
    console.log(typeof (newData))
    console.log(newData)
    this.setState({ data: newData }, () => {
      // window.localStorage.setItem('data', JSON.stringify(this.state.data));
      db.collection('messages').doc({ id: messageid }).update({
        messages: inputValue
      })
    });
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

    return (
      <div className="app">
        <form onSubmit={(e) => this.submitForm(e)}>
          <input type="text" name="input" />
          <button type="submit">Add</button>
        </form>
        <div className="data">
          <ul>
            {data.map((input, index) => (
              <li key={input.messages + index}>
                <div>
                  {input.messages}
                  <button onClick={() => this.edit(index)}>Edit</button>
                </div>
                <div style={{ display: `${isEditable !== index ? 'none' : 'block'}` }}>
                  <form onSubmit={(e) => this.updateForm(e, input.id)}>
                    <input type="text" name="input" defaultValue={input.messages} />
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
