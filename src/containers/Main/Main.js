import React from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import { default as InputFile } from '../../components/Inputfile/inputfile';
import { default as FileList } from '../../components/Filelist/filelist';
import { default as Sketch } from '../Sketch/Sketch';
import { Query, Mutation } from 'react-apollo'
import { Redirect } from 'react-router-dom';
import MaterialIcon  from 'material-icons-react'
import {
  PDFS_QUERY,
  SINGLE_UPLOAD_PDF_MUTATION,
  LOGIN_QUERY,
  SIGNOUT_USER_MUTATION,
  PDF_SUBSCRIPTION
} from '../../graphql'

import './Main.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

let unsubscribe = null

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //files: [],
      currentfile: null,
      currentPages: 0,
      pageNumber: 1, 
      fileName: null,
      height: null,
      skechH: null,
      skechW: null,
      skechWH: null,
    }
    this.clearSketch = false;
  }
   
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
    this.setState({
      height: this.pdfWrapper.getBoundingClientRect().height,
      skechH: this.pdfWrapper.getBoundingClientRect().height,
      skechW: this.pdfWrapper.getBoundingClientRect().height*this.state.skechWH,
    })
  }

  uploadFileHandler = e => {
    if(e.target.files[0].type!=='application/pdf'){
      alert('must PDF file!!!');
      return
    }
    if (typeof(e.target.files[0])==='undefined')
      return
    const file = e.target.files[0];
    this.singleUploadPDF({
      variables: { data: file }
    })
  }

  goToPrevPage = () => {
    this.clearSketch = true;
    console.log("now true");
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
    console.log("now true");
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



  signout = () => {
    this.signoutUser()
    const { history } = this.props;
    history.push('/login');
  }

  removeDisplay = () => {
    this.setState({ currentfile: null});
    this.setState({ pageNumber: 1});
  }
  

  loadDisplay = (file) => {   
    //console.log(file.pdf);
    this.setState({ currentfile: file});
    this.setState({ 
      pageNumber: 1, 
      fileName: file.filename});
  }

  render() {
    //let { files} = this.state;
    //console.log("Files", files)
    var login_user = null;
    return (
        <div className="center">
          <div className="Sidebar">
          <Query query={LOGIN_QUERY}>
            {({ loading, error, data}) => {
              if (loading) return <p>Loading...</p>
              if (error) return <p>Error :(((</p>
              login_user = data.isLogin
              if (!login_user)
                return <Redirect to="/login" />;
              else
                return (
                  <div className="head">
                    <Mutation mutation={SINGLE_UPLOAD_PDF_MUTATION}>
                      { singleUploadPDF => {
                        this.singleUploadPDF = singleUploadPDF
                        return (
                          <InputFile uploadFileHandler={this.uploadFileHandler.bind(this)} user={login_user}>
                            Select PDF
                          </InputFile>)
                      }}
                    </Mutation>
                    <Mutation mutation={SIGNOUT_USER_MUTATION} refetchQueries={[{ query: LOGIN_QUERY }]}>
                      {signoutUser => {
                        this.signoutUser = signoutUser;
                        return (
                          <div className="signout" onClick={this.signout}> 
                            EXIT<MaterialIcon icon="exit_to_app"/> 
                          </div>
                        );
                        
                      }}
                    </Mutation> 
                  </div>)
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
                      return {
                        ...prev,
                        getPDFs: [...prev.getPDFs,newFile]
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
              if (files[0])
                return (
                <FileList 
                  files={files} 
                  loadDisplay={this.loadDisplay} 
                  user={login_user}
                  />)
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
            <div className="temp" id="pdfWrapper" ref={(ref) => this.pdfWrapper = ref}>
              <Document
                file={this.state.currentfile ? "data:application/pdf;base64," + this.state.currentfile.pdf:null}
                onLoadSuccess={this.onDocumentLoadSuccess}
                onLoadError={(error) => console.log(error.message)}
                onSourceError={(error) => console.log(error.message)}
                onDocumentLoad={({total, width})=>{console.log("gogo : ", total, width)}}
                noData={null}
                loading={null}
              >
                <Page onLoadSuccess={this.onLoadSuccess} pageNumber={this.state.pageNumber} height={this.state.height} />
                <Sketch height={this.state.skechH} width={this.state.skechW} clear={this.clearSketch}
                        fileName={this.state.fileName} page={this.state.pageNumber} />
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
              {console.log("now false")}

            </div>
          </div>
        </div>
      )
  }

};

export default Main;
