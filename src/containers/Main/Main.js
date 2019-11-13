import React from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import { default as InputFile } from '../../components/Inputfile/inputfile';
import { default as FileList } from '../../components/Filelist/filelist';
import { default as Sketch } from '../Sketch/Sketch';
import { default as Chatroom } from '../Chatroom/Chatroom';
import { Query, Mutation } from 'react-apollo'
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';
import {
  PDFS_QUERY,
  SINGLE_UPLOAD_PDF_MUTATION,
  LOGIN_QUERY,
  PDF_SUBSCRIPTION
} from '../../graphql';
import IconButton from '@material-ui/core/IconButton';

import ColorLens from '@material-ui/icons/ColorLensOutlined';
import Delete from '@material-ui/icons/DeleteOutlined';


import './Main.css';
import { inherits } from 'util';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let unsubscribe = null
let login_user = null;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentfile: null,
      currentPages: 0,
      pageNumber: 1, 
      fileName: null,
      height: null,
      skechH: null,
      skechW: null,
      skechWH: null,
      left: false,

      toolbox: false,
      clean: false,
    }
    this.clearSketch = false;
    this.loading = false
  }

  toggleDrawer = (open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
    }
    this.setState({ left: open });
    //console.log(this.state.left)
  };

  changeDrawer = (type, open) => event => {
    //console.log(type, open);
    if(this.state.currentfile){
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
      this.setState({ toolbox: open });
    }
};
   
  keyFunction = e => {
    if(e.keyCode === 37) {
      this.goToPrevPage()
    }
    else if (e.keyCode === 39){
      this.goToNextPage()
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.keyFunction, false);
    window.addEventListener("resize",this.setDivSize, false);
    this.setDivSize()
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyFunction, false);
  }

  setDivSize = () => {
    if(this.pdfWrapper){
      this.setState({
        height: this.pdfWrapper.getBoundingClientRect().height,
        skechH: this.pdfWrapper.getBoundingClientRect().height,
        skechW: this.pdfWrapper.getBoundingClientRect().height*this.state.skechWH,
      })
    }
  }

  uploadFileHandler = async (e) => {
    if(e.target.files[0].type!=='application/pdf'){
      alert('must PDF file!!!');
      return
    }
    if (typeof(e.target.files[0])==='undefined')
      return
    const file = e.target.files[0];
    this.loading = true;
    this.singleUploadPDF({
      variables: { data: file }
    })
  }

  goToPrevPage = () => {
    this.clearSketch = true
    document.activeElement.blur()
    if (this.state.currentPages === 0)
      return
    const currentPageNumber = this.state.pageNumber;
    let nextPageNumber;
    if (currentPageNumber - 1 === 0) {
      nextPageNumber = 1;
    } else {
      nextPageNumber = currentPageNumber - 1;
    }
    this.setState({
      pageNumber: nextPageNumber
    });
  }

  goToNextPage = () => {
    this.clearSketch = true;
    document.activeElement.blur()
    if (this.state.currentPages === 0)
      return
    const currentPageNumber = this.state.pageNumber;
    
    let nextPageNumber;
    if (currentPageNumber + 1 > this.state.currentPages) {
      return
    } else {
      nextPageNumber = currentPageNumber + 1;
    }
    this.setState({
      pageNumber: nextPageNumber
    });

  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ currentPages: numPages });
  }

  onLoadSuccess = (page) =>{
    this.setState({
      skechH: page.height,
      skechW: page.height*page.originalWidth/page.originalHeight,
      skechWH: page.originalWidth/page.originalHeight
    });
  }


  removeDisplay = () => {
    this.setState({ currentfile: null});
    this.setState({ pageNumber: 1});
  }

  clean = () =>{
    this.setState({clean: true})
  }
  

  loadDisplay = (file) => {   
    //console.log(file.pdf);
    this.setState({ currentfile: file});
    this.setState({ 
      pageNumber: 1, 
      fileName: file.filename});
  }

  render() {
    return (
        <div className="all">
          <div className="center" onClick={this.toggleDrawer(false)} onKeyDown={this.toggleDrawer(false)}>
            <div className="Sidebar">
            <Query query={LOGIN_QUERY}>
              {({ loading, error, data}) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>
                login_user = data.isLogin
                if (!login_user)
                  return <Redirect to="/login" />;
                else{
                  return (
                    <div className="head">
                      <Mutation mutation={SINGLE_UPLOAD_PDF_MUTATION}>
                        { singleUploadPDF => {
                          this.singleUploadPDF = singleUploadPDF
                          return (
                            <div style={{margin:'auto'}}>
                            {this.loading?
                            <CircularProgress style={this.state.currentfile?{zIndex:1000,color:'black',position:'fixed',top:'50%',left:'58%'}:{color:'white',position:'fixed',top:'50%',left:'58%'}} size={40} thickness={4}/>
                            :null
                            }
                            <InputFile uploadFileHandler={this.uploadFileHandler.bind(this)} user={login_user}>
                              Select a PDF
                            </InputFile>
                            </div>)
                        }}
                      </Mutation>

                    </div>)
                }
              }}
            </Query>

            <Query query={PDFS_QUERY}>
              {({loading, error, data, subscribeToMore}) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error...</p>
                if (!unsubscribe)
                  unsubscribe = subscribeToMore({
                    document: PDF_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      if (subscriptionData.data.PDF.mutation === 'CREATED'){
                        const newFile = subscriptionData.data.PDF.data
                        const index = prev.getPDFs.findIndex(pdf => pdf.id === newFile.id)
                        this.loading = false;
                        if (index!==-1){
                          if (prev.getPDFs[index].pdf){
                            return {
                              ...prev,
                              getPDFs: prev.getPDFs
                            }
                          }
                          else{
                            prev.getPDFs[index] = newFile
                            return {
                              ...prev,
                              getPDFs: prev.getPDFs
                            }
                          }
                        }
                        else{
                          return {
                            ...prev,
                            getPDFs: [...prev.getPDFs,newFile]
                          }
                        }
                      }
                      else if (subscriptionData.data.PDF.mutation === 'DELETED'){
                        const deleteFile = subscriptionData.data.PDF.data
                        const Files = prev.getPDFs.filter(pdf => pdf.id!==deleteFile.id)
                        if (this.state.currentfile)
                          if (this.state.currentfile.id === deleteFile.id)
                            this.removeDisplay()
                        return {
                          ...prev,
                          getPDFs: Files
                        }
                      }
                    }
                  })   
                let files = data.getPDFs
                if (files[0] && login_user){
                  return (
                  <FileList 
                    files={files} 
                    loadDisplay={this.loadDisplay} 
                    user={login_user}
                    />)
                }
                else
                  return (null)
              }}
            </Query>
            
            </div>

            <div className="Content">
              {
              this.state.currentfile?
              null:
              <h1 style={{ marginTop: '5%', color: "#efefef", }}>Your PDF file will be viewed here.</h1>
              }
              <div className="temp" id="pdfWrapper" ref={(ref) => this.pdfWrapper = ref} >
                <Document
                  file={this.state.currentfile ? "data:application/pdf;base64," + this.state.currentfile.pdf:null}
                  onLoadSuccess={this.onDocumentLoadSuccess}
                  onLoadError={(error) => console.log(error.message)}
                  onSourceError={(error) => console.log(error.message)}
                  noData={null}
                  loading={null}
                >
                  <Page onLoadSuccess={this.onLoadSuccess} pageNumber={this.state.pageNumber} height={this.state.height} />
                  <Sketch height={this.state.skechH} width={this.state.skechW} clear={this.clearSketch}
                          fileName={this.state.fileName} page={this.state.pageNumber} user={login_user}
                          toolboxOpen={this.state.toolbox} changeDrawer={(name, open)=>this.changeDrawer(name, open)}
                          clean={this.state.clean}
                          />
                </Document>
                {this.state.currentfile?<div className="Foot">
                  <button className="PageButton" onClick={this.goToPrevPage} onKeyPress={this.goToPrevPage}>{`<`}</button>
                  <h2 className="PageName">Page 
                    {this.state.currentPages===0?null:this.state.pageNumber}
                    {this.state.currentPages===0?null:`/`}
                    {this.state.currentPages===0?null:this.state.currentPages}
                  </h2>
                  <button className="PageButton" onClick={this.goToNextPage} onKeyPress={this.goToNextPage}>{`>`}</button>
                </div>:null}


                {this.clearSketch = false}
                {this.state.clean = false}
                {/* {console.log("end : ",this.state.clean)} */}
              </div>
            </div>
          </div>
          <div className='DrawerButtonContainer'>
            {  
              <Query query={LOGIN_QUERY}>
              {({ loading, error, data}) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>
                if (data.isLogin)
                return (
                  <Chatroom 
                  author={data.isLogin} 
                  left={this.state.left} 
                  toggleUp={this.toggleDrawer(true)}
                  toggleDown={this.toggleDrawer(false)}/>
                )
                else 
                  return null
              }}
              </Query>  
            }
            <IconButton style={this.state.currentPages?{'cursor':'pointer'}:{'cursor':'not-allowed'}} onClick={this.changeDrawer('toolbox', true)}>
              <ColorLens className="DrawerButton" style={{ fontSize: 40, color: 'rgba(198, 198, 198, 0.461)' }}/>
            </IconButton>
            <IconButton style={this.state.currentPages?{'cursor':'pointer'}:{'cursor':'not-allowed'}} onClick={()=>this.clean()}>
              <Delete className="DrawerButton" style={{ fontSize: 40, color: 'rgba(198, 198, 198, 0.461)' }}/>
            </IconButton>
          </div>
        </div>
      )
  }

};

export default Main;