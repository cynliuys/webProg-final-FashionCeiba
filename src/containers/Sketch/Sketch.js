import React from 'react';
import { CompactPicker } from 'react-color';
import { Mutation } from 'react-apollo'
import 'flexboxgrid';
import './Sketch.css';
import PicQuery from'../../components/PicQuery/PicQuery';
import Toolbox from'../../components/Toolbox/Toolbox';

import { GridTile, IconButton } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RemoveIcon from 'material-ui/svg-icons/content/clear';
import ZoomInIcon from 'material-ui/svg-icons/action/zoom-in';
import ZoomOutIcon from 'material-ui/svg-icons/action/zoom-out';
import { SketchField, Tools } from 'react-sketch';
import {
    TEACHER_PIC_MUTATION, STUDENT_PIC_MUTATION, 
} from '../../graphql'

const dataUrl = "";
const styles = {
    root: {
        padding: '3px',
        display: 'flex',
        flexWrap: 'wrap',
        margin: '10px 10px 5px 10px',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%',
        overflowY: 'auto',
        marginBottom: '24px'
    },
    gridTile: {
        backgroundColor: '#fcfcfc'
    },
    appBar: {
        backgroundColor: '#333'
    },
    radioButton: {
        marginTop: '3px',
        marginBottom: '3px'
    },
    separator: {
        height: '42px',
        backgroundColor: 'white'
    },
    iconButton: {
        fill: 'white',
        width: '30px',
        height: '30px'
    },
    dropArea: {
        width: '100%',
        height: '64px',
        border: '2px dashed rgb(102, 102, 102)',
        borderStyle: 'dashed',
        borderRadius: '5px',
        textAlign: 'center',
        paddingTop: '20px'
    },
    activeStyle: {
        borderStyle: 'solid',
        backgroundColor: '#eee'
    },
    rejectStyle: {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
    },
    cardHeader:{
        background: '#dadada',
        color: 'white',
        
    }
};

/**
 * Helper function to manually fire an event
 *
 * @param el the element
 * @param etype the event type
 */
function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

class Sketch extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            tool: Tools.Pencil,
            lineWidth: 8.5,
            lineColor: 'black',
            fillColor: '#68CCCA',
            fillWithColor: false,


            backgroundColor: 'transparent',
            shadowWidth: 0,
            shadowOffset: 0,
            fillWithBackgroundColor: false,
            drawings: [],
            canUndo: false,
            canRedo: false,
            controlledSize: false,
            stretched: true,
            stretchedX: false,
            stretchedY: false,
            originX: 'left',
            originY: 'top',
            upToDate: false,
        };
        this.unsubscribe = null;
    }

    handleTool = (e, i, v)=>{
        this.setState({
            tool: v
        });    
    }

    handleWidth = (e, v)=>{
        console.log(v);
        this.setState({
            lineWidth: v * 15 + 1
        });
    }

    handleLineColor = (color)=>{
        this.setState({
            lineColor: color.hex
        });
    }

    handleFillWithColor = ()=>{
        this.setState({
            fillWithColor: !this.state.fillWithColor
        });
    }

    handleFillColor = (color)=>{
        this.setState({
            fillColor: color.hex
        });
    }
    
    _renderTile = (drawing, index) => {
        return (
            <GridTile
                key={index}
                title='Canvas Image'
                actionPosition="left"
                titlePosition="top"
                titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                cols={1} rows={1} style={styles.gridTile}
                actionIcon={<IconButton onClick={(c) => this._removeMe(index)}><RemoveIcon
                    color="white" /></IconButton>}>
                <img src={drawing} />
            </GridTile>
        );
    };
    _removeMe = (index) => {
        let drawings = this.state.drawings;
        drawings.splice(index, 1);
        this.setState({ drawings: drawings });
    };
    _undo = () => {
        this._sketch.undo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };
    _redo = () => {
        this._sketch.redo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };
    _clear = () => {
        if(this._sketch){
            this._sketch.clear();
            this._sketch.setBackgroundFromDataUrl('');
            // this.setState({
            //     controlledValue: null,
            //     backgroundColor: 'transparent',
            //     fillWithBackgroundColor: false,
            //     canUndo: this._sketch.canUndo(),
            //     canRedo: this._sketch.canRedo()
            // })
        }
    };
    _onSketchChange = () => {
        let prev = this.state.canUndo;
        let now = this._sketch.canUndo();
        if (prev !== now) {
          this.setState({ canUndo: now });
        }
        if (this.state.upToDate) {
          this.setState({ upToDate: false });
        } else  {
            var error = false;
            let data = {
                pic: this._sketch.toDataURL(),
                filename: this.props.fileName,
                page: this.props.page
            }
            if(this.props.user.name !== 'ADMIN'){
                data.student = this.props.user.name;
            }
            this.updatePic({
                variables: data
            })
            .catch(() => { error=true; alert('error in updatePic!');})
            .then(() => {
                console.log("Mutation !");
            });
        }
    };
    _onBackgroundImageDrop = (accepted/*, rejected*/) => {
        if (accepted && accepted.length > 0) {
            let sketch = this._sketch;
            let reader = new FileReader();
            let { stretched, stretchedX, stretchedY, originX, originY } = this.state;
            reader.addEventListener('load', () => sketch.setBackgroundFromDataUrl(reader.result, {
                stretched: stretched,
                stretchedX: stretchedX,
                stretchedY: stretchedY,
                originX: originX,
                originY: originY
            }), false);
            reader.readAsDataURL(accepted[0]);
        }
    };

    componentDidMount = () => {
        /*eslint-disable no-console*/

        (function (console) {
            console.save = function (data, filename) {
                if (!data) {
                    console.error('Console.save: No data');
                    return;
                }
                if (!filename) filename = 'console.json';
                if (typeof data === 'object') {
                    data = JSON.stringify(data, undefined, 4)
                }
                var blob = new Blob([data], { type: 'text/json' }),
                    e = document.createEvent('MouseEvents'),
                    a = document.createElement('a');
                a.download = filename;
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e)
            }
        })(console);

        /*eslint-enable no-console*/
        /*
        if (this.props.socket.id === this.props.id) {
          console.log('listen new', this.props.id);
          this.props.socket.on('new editing', this.sendEditingImage);
        } else {
          console.log(this.props.id);
          this.props.socket.emit('new editing', this.props.id);
        }
        this.props.socket.on(`editing image:${this.props.id}`, this.updateDraw)
        */
    };
    componentWillUnmount() {
        
        /*
      if (this.props.socket.id === this.props.id) {
        this.props.socket.off('new editing');
      }
      this.props.socket.off(`editing image:${this.props.id}`);
      */
    };

    updateDraw = (data) => {
      this.setState({ controlledValue: data, upToDate: true });
      // setTimeout(() => this.setState({ upToDate: false }), 500)
    }
    

    render = () => {
        if(this.props.clear){
            this._clear();
        }
        let { controlledValue } = this.state;
        return (
            <div className="overlay">
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <div className='row'>
                        {/* Sketch Area */}
                        <div className='col-xs-7 col-sm-7 col-md-9 col-lg-9'>
                            {/* Teacher Pic */}
                            {(this.props.user.name!=='ADMIN')?
                                <PicQuery isTeacher={true} user={this.props.user.name}
                                    picOnField={false} sketch={this._sketch} width={this.props.width} height={this.props.height}
                                    fileName={this.props.fileName} page={this.props.page}/>:(null)
                            }

                            {/* Teacher Sketch or Student Sketch */}
                            <Mutation  mutation={(this.props.user.name==='ADMIN')?TEACHER_PIC_MUTATION:STUDENT_PIC_MUTATION}>
                                {updatePic => {
                                    this.updatePic = updatePic;
                                    return (
                                    <SketchField
                                        name='sketch'
                                        className='sketchfield'
                                        ref={(c) => this._sketch = c}
                                        lineColor={this.state.lineColor}
                                        lineWidth={this.state.lineWidth}
                                        fillColor={this.state.fillWithColor ? this.state.fillColor : 'transparent'}
                                        backgroundColor={this.state.fillWithBackgroundColor ? this.state.backgroundColor : 'transparent'}
                                        width={this.props.width }
                                        height={this.props.height }
                                        defaultValue={this.props.sketch}
                                        value={controlledValue}
                                        forceValue={true}
                                        onMouseUp={this._onSketchChange}
                                        tool={this.state.tool}
                                    />
                                )}}
                            </Mutation>

                            {/* Self Pic */}
                            {(this.props.user.name==='ADMIN')?
                                /* Teacher Self Pic */
                                (<PicQuery isTeacher={true} user={this.props.user.name}
                                    picOnField={true} sketch={this._sketch} width={this.props.width} height={this.props.height}
                                    fileName={this.props.fileName} page={this.props.page}/>):
                                /* Student Self Pic */
                                (<PicQuery isTeacher={false} user={this.props.user.name}
                                    picOnField={true} sketch={this._sketch} width={this.props.width} height={this.props.height}
                                    fileName={this.props.fileName} page={this.props.page}/>)
                            }
                        </div>
                        {/* Tool Box */}
                        <Toolbox handleTool={(e, i, v)=>this.handleTool(e, i, v)} tool={this.state.tool}
                                handleWidth={(e, v)=>this.handleWidth(e, v)} width={this.state.tool}
                                handleLineColor={(color)=>this.handleLineColor(color)} lineColor={this.state.lineColor}
                                handleFillWithColor={()=>this.handleFillWithColor()} fillWithColor={this.state.fillWithColor}
                                handleFillColor={(color)=>this.handleFillColor(color)} fillColor={this.state.fillColor}
                            />
                    </div>
                </MuiThemeProvider>
            </div>
        )
    };
}

export default Sketch;
