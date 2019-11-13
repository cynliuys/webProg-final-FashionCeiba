import React from 'react';
import { Mutation } from 'react-apollo'
import 'flexboxgrid';
import './Sketch.css';
import PicQuery from'../../components/PicQuery/PicQuery';
import Toolbox from'../../components/Toolbox/Toolbox';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { SketchField, Tools } from 'react-sketch';
import {
    TEACHER_PIC_MUTATION, STUDENT_PIC_MUTATION, 
} from '../../graphql'



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
            lineWidth: 1.5,
            lineColor: 'black',
            fillColor: '#68CCCA',
            fillWithColor: false,
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
    
    clear = () => {
        if(this._sketch){
            this._sketch.clear();
            this._sketch.setBackgroundFromDataUrl('');
        }
    };
    onSketchChange = () => {
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
    };

    render = () => {
        // {console.log("Render : ",this.props.clean)}
        if(this.props.clear){
            this.clear();
        }
        if(this.props.clean){
            this.clear();
            this.onSketchChange();
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
                                        onMouseUp={this.onSketchChange}
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
                                handleWidth={(e, v)=>this.handleWidth(e, v)} width={this.state.lineWidth}
                                handleLineColor={(color)=>this.handleLineColor(color)} lineColor={this.state.lineColor}
                                handleFillWithColor={()=>this.handleFillWithColor()} fillWithColor={this.state.fillWithColor}
                                handleFillColor={(color)=>this.handleFillColor(color)} fillColor={this.state.fillColor}
                                toolboxOpen={this.props.toolboxOpen} changeDrawer={(name, open)=>this.props.changeDrawer(name, open)}
                            />
                    </div>
                </MuiThemeProvider>
            </div>
        )
    };
}

export default Sketch;