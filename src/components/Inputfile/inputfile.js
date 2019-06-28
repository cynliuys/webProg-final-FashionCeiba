import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../Button/button'
import './inputfile.css'

export default class InputFile extends React.Component {
    triggerInput = e => {
        ReactDOM.findDOMNode(this._inputFile).click();
    }
    render() {
        var visibilityState = this.props.user.email==='ADMIN';
        return (
            <div className="InputFile">
              <Button onClick={this.triggerInput} type="primary" visible={visibilityState}>
                  <input 
                      name="file" 
                      type="file" 
                      className="InputFile__input"
                      accept=".pdf"
                      ref={c => this._inputFile = c}
                      onChange={this.props.uploadFileHandler}
                  />
                  <label htmlFor="file" className="InputFile__label">{this.props.children}</label>
              </Button> 
            </div>
        )
    }
}
