import React from 'react';
import { CompactPicker } from 'react-color';
import 'flexboxgrid';
import { MenuItem, SelectField, Slider, Toggle, } from 'material-ui';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Create from '@material-ui/icons/Create';
import BorderColor from '@material-ui/icons/BorderColor';
import Color_lens from '@material-ui/icons/ColorLens';
import FormatColorFill from '@material-ui/icons/FormatColorFill';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';


import { Tools } from 'react-sketch';


const styles = makeStyles({
    drawer: {
        width: '10px'
    },
});


class Toolbox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: null,
        };
        this.unsubscribe = null;
    }

    

    handleExpand = panel => (event, isExpanded) => {  
        console.log(panel);
        if(this.state.expanded === panel) {this.setState({expanded: null})}
        else{this.setState({expanded: panel})}
    };

    

    render = () => {
        return (        
            <div className='col-xs-5 col-sm-5 col-md-3 col-lg-3 sidebar'>
                <Drawer anchor="right" open={this.props.toolboxOpen} onClose={this.props.changeDrawer('toolbox', false)} >
                    <div role="presentation" style={{width: "300px"}}>
                        <List>
                            {/* Panel 1 */}
                            <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={this.handleExpand('panel1')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content" id="panel1bh-header" >
                                    <ListItem button key={"Tools"}>
                                        <ListItemIcon> <Create /> </ListItemIcon>
                                        <ListItemText primary={"Tools"} />
                                    </ListItem>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <SelectField ref='tool' value={this.props.tool} onChange={(e, i, v)=>this.props.handleTool(e, i, v)}>
                                        <MenuItem value={Tools.Pencil} primaryText="Pencil" />
                                        <MenuItem value={Tools.Line} primaryText="Line" />
                                        <MenuItem value={Tools.Rectangle} primaryText="Rectangle" />
                                        <MenuItem value={Tools.Circle} primaryText="Circle" />
                                    </SelectField>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            {/* Panel 2 */}
                            <ExpansionPanel expanded={this.state.expanded === 'panel2'} onChange={this.handleExpand('panel2')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content" id="panel1bh-header" >
                                    <ListItem button key={"Line Weight"}>
                                        <ListItemIcon> <BorderColor /> </ListItemIcon>
                                        <ListItemText primary={"Line Weight"} />
                                    </ListItem>
                                </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Slider ref='slider' step={0.01}
                                            defaultValue={(this.props.width-1)/15} style={{width: "250px"}}
                                            onChange={(e, v)=>this.props.handleWidth(e, v)}/>
                                    </ExpansionPanelDetails>
                            </ExpansionPanel>
                            {/* Panel 3 */}
                            <ExpansionPanel expanded={this.state.expanded === 'panel3'} onChange={this.handleExpand('panel3')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content" id="panel1bh-header" >
                                    <ListItem button key={"Line Color"}>
                                        <ListItemIcon> <Color_lens /> </ListItemIcon>
                                        <ListItemText primary={"Line Color"} />
                                    </ListItem>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <CompactPicker
                                        id='lineColor' color={this.props.lineColor}
                                        onChange={(color)=>this.props.handleLineColor(color)} />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            {/* Panel 4 */}
                            <ExpansionPanel expanded={this.state.expanded === 'panel4'} onChange={this.handleExpand('panel4')}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content" id="panel1bh-header" >
                                    <ListItem button key={"Fill Color"}>
                                        <ListItemIcon> <FormatColorFill /> </ListItemIcon>
                                        <ListItemText primary={"Fill Color"} />
                                    </ListItem>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Toggle label="Fill with color"
                                        defaultToggled={this.props.fillWithColor}
                                        onToggle={()=>this.props.handleFillWithColor()} />
                                </ExpansionPanelDetails>
                                <ExpansionPanelDetails>
                                    <CompactPicker
                                        color={this.props.fillColor}
                                        onChange={(color)=>this.props.handleFillColor(color)} />
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </List>
                    </div>
                </Drawer>
            </div>
        )
    };
}

export default Toolbox;