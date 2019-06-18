import React from 'react';
import logo from '../../images/x.png'
import { Mutation } from 'react-apollo'
import {
  DELETE_PDF_MUTATION
} from '../../graphql'
import './filelist.css'

class FileList extends React.Component {

  removePDF = (file) => {
    this.deletePDF({
      variables: {
        id: file.id,
        filename: file.id
      }
    })
  }

  render() {
    const { files } = this.props;
    return (
      <Mutation mutation={DELETE_PDF_MUTATION}>
      {deletePDF => {
        this.deletePDF = deletePDF;
        return (
        <div className="FileList">
            { 
              files.map( (file, index) => 
                (
                <div key={index} className="FileList__item">
                  <div className="FileList__text"  onClick={() => this.props.loadDisplay(file)}>
                    <h3>{file.filename}</h3>
                  </div>
                  {
                    this.props.user.email==='ADMIN'?
                    <img className="FileList__X" src={logo} alt="X" onClick={() => this.removePDF(file)}></img>
                    :null
                  }
                </div>
                
                ))
            }
        </div>)
      }}
      </Mutation>
    )
  }
}

export default FileList