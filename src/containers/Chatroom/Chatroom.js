import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Form,
  CardText, 
} from 'reactstrap'

import {
    CHATS_QUERY,
    SEND_MESSAGE_MUTATION,
    MESSAGE_SENT_SUBSCRIPTION,
} from '../../graphql';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Chat from '@material-ui/icons/ChatOutlined';
import IconButton from '@material-ui/core/IconButton';
import './style.scss';

const inputStyles = makeStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: 8,
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4,
    }
  });

  const buttonStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
      padding: 10
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    }
  }));

class Chatroom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fromContent: '',
            classes: "float-room",
            unRead: 0,
            scroll2bottom: false
        }
        this.classes = inputStyles;
        this.buttonclasses = buttonStyles;
        this.unsubscribe = null
    };

    gotoBottom = id => {
        var element = document.getElementById(id);
        console.log(element.scrollHeight - element.clientHeight)
        element.scrollTop = element.scrollHeight - element.clientHeight;
    }

    handleMessageSubmit = e => {
        e.preventDefault()
    
        const { fromContent } = this.state
    
        if (!fromContent) return
    
        this.createMessage({
          variables: {
            from: this.props.author.name,
            message: fromContent
          }
        })
        this.setState({
          fromContent: ''
        })
    }

    ShowDrawer = e => {
        this.props.toggleUp(e)
        this.setState({unRead: 0})
        this.gotoBottom("chatroom_id")
    }

    render() {
        if(this.props.left && this.state.classes === "float-room") {
            this.setState({classes:"float-room float-room--open"})
        } 
        if(!this.props.left && this.state.classes === "float-room float-room--open") {
            this.setState({classes:"float-room"})
        } 
        //console.log(this.state.classes)

        return (
            <div>
                <IconButton>
                    <Badge badgeContent={this.state.unRead} color="secondary">
                        <Chat style={{ fontSize: 40, color: 'rgba(198, 198, 198, 0.461)' }} onClick={this.ShowDrawer}/>
                    </Badge>
                </IconButton>
                <div className={this.state.classes} style={{borderRight:"0.3px solid gray"}}>
                <Container style={{"width": "350px"}} >
                    <Row style={{ "margin": "auto", "width": "80%", "overflowWrap": "break-word"}}>
                        <Query query={CHATS_QUERY}>
                            {({ loading, error, data, subscribeToMore }) => {
                                if (loading) return <p>Loading...</p>
                                if (error) return <p>Error :(((</p>
                                //console.log(data.chats)
                        
                                const messages = data.chats.map(c => {
                                    if(c.from === this.props.author.name){
                                        return (<div id="message" key={c._id} className="chat-message" style={{"margin":"3px", "width":"95%", "clear":"both"}} >
                                            <div style={{"fontSize":"small", "width":"100%", "textAlign":"right",paddingTop:"15px",paddingBottom:"5px"}}>{c.from}</div>
                                            <div style={{"backgroundColor":"#badac1", "borderRadius":"10%"
                                                        , "width":"60%", "textAlign":"left"
                                                        , "padding":"3%", "float":"right"}}>{c.message}
                                            </div>
                                        </div>)}
                                    else {
                                        return (<div id="message" key={c._id} className="chat-message" style={{"margin":"3px", "width":"95%", "clear":"both"}} >
                                            <div style={{"fontSize":"small", "width":"100%", "textAlign":"left",paddingTop:"15px",paddingBottom:"5px"}}>{c.from}</div>
                                            <div style={{"backgroundColor":"#f3f3f3", "borderRadius":"10%"
                                                        , "width":"60%", "textAlign":"left"
                                                        , "padding":"3%", "float":"left"}}>{c.message}
                                            </div>
                                        </div>)}
                                })
                                
                                const chats = <div style={{"width": "100%", "height":"400px", "margin":'10px',"textAlign":"center"}}>
                                    <h2> Chatroom </h2><div
                                        id = {"chatroom_id"}
                                        style={{"border":"2px solid #f3f3f3", "overflowY": "scroll", 
                                        "overflowWrap": "break-word", "height":"90%"}}>
                                        {messages}
                                    </div></div>

                                if (!this.unsubscribe) {
                                    this.unsubscribe = subscribeToMore({
                                    document: MESSAGE_SENT_SUBSCRIPTION,
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev
                                        console.log(subscriptionData.data.messageSent)
                                        console.log(prev.chats)
                                        const newMessage = subscriptionData.data.messageSent
                                        if(newMessage.from !== this.props.author.name && !this.props.left) {
                                            this.setState({unRead: this.state.unRead+1})
                                        }
                                        this.setState({
                                            scroll2bottom: true
                                          })
                                        return {
                                            ...prev,
                                            chats: [...prev.chats,newMessage]
                                        }
                                    }})}
                                return <div style={{width:"100%"}}>{chats}</div>
                            }}
                        </Query>
                    </Row>
                    <Row style={{ "margin": "auto", "width": "90%", "marginLeft":"10%"}}>
                        <Mutation mutation={SEND_MESSAGE_MUTATION}>
                            {createMessage => {
                                this.createMessage = createMessage
                                if(this.state.scroll2bottom) {
                                    setTimeout(() => {
                                        this.gotoBottom("chatroom_id");}, 100)
                                    this.setState({scroll2bottom: false})
                                }
                                console.log(this.state.scroll2bottom)
                                return (
                                    <Form style={{width:"95%"} }onSubmit={this.handleMessageSubmit}>
                                    <Paper className={this.classes.root} style={{"margin":'10px'}}>
                                        <InputBase
                                            className={this.classes.input}
                                            value={this.state.fromContent}
                                            id="content"
                                            placeholder=" Any question..."
                                            onChange={e =>
                                                this.setState({ fromContent: e.target.value })
                                            }
                                        />
                                        <Button type="submit" aria-label="Directions" color="primary"style={{marginLeft:'5%'}}  className={this.buttonclasses.button}>
                                            <SendIcon className={this.buttonclasses.rightIcon}  />
                                        </Button>
                                    </Paper>
                                    </Form>
                                )
                            }}
                        </Mutation>
                    </Row>
                    </Container>
                    </div>
            </div>
    )}
}

export default Chatroom