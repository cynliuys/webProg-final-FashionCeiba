import React from 'react';


export default class FileList extends React.Component {
  _printSize(size) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    let i = 0; while( size > 900 ) { size /= 1024; i++; }
    return `${(Math.round(size*100)/100)} ${sizes[i]}`
  }
  render() {
    const { files } = this.props;
    return (
      <div className="FileList">
          { 
            files.map( (file, index) => 
              (<div className="FileList__item" key={index} onClick={() => this.props.loadFile(file)}>
                <h3>{file.filename}</h3>
              </div>))
          }
       </div>
    )
  }
}