import React, { Component } from 'react';
import InputName from './Input_Name';
import InputTime from './Input_Time';
import '../todo.css'

class Input extends Component {
  constructor(props){
    super(props);
    this.state = {
        text: "",
        time: ""
    };
  };

  onChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  setChange = e => {
    e.preventDefault();
    if (this.state.text.trim() !== "" && this.state.time !== "" && new Date(this.state.time) >= new Date()){    
        this.props.add({
            text: this.state.text,
            time : this.state.time === "" ? "no date" : this.state.time
        });
        this.setState({text: "", time: ""});
    }
    if (this.state.text.trim() === ""){
      alert('Give todos name');
    }
    else if (this.state.time === ""){
      alert('Give todos time')
    }
    else if (new Date(this.state.time) < new Date()){
      alert('Give future time')
    }
  };

  render() {
    return (
        <form onSubmit={this.setChange}>
            <InputName value={this.state.text} onChange={this.onChange} />
            <InputTime value={this.state.time} onChange={this.onChange} />
        </form>
    );
  };
}

export default Input;
