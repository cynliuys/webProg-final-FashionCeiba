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
import MailIcon from '@material-ui/icons/Mail';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Chat from '@material-ui/icons/ChatOutlined';


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
            fromContent: ''
        }
        this.classes = inputStyles;
        this.buttonclasses = buttonStyles;
        this.unsubscribe = null
    };

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
        this.unsubscribe = null
    }

    render() {
        return (
            <div>
                <Chat style={{ fontSize: 40, color: 'rgba(198, 198, 198, 0.461)' }} onClick={this.ShowDrawer}/>
                <Drawer open={this.props.left} onClose={this.props.toggleDown} style={{"width": "350px"}}>
                    <Container style={{"width": "350px"}}>
                    <Row style={{ "margin": "auto", "width": "80%", "overflowWrap": "break-word"}}>
                        <Query query={CHATS_QUERY}>
                            {({ loading, error, data, subscribeToMore }) => {
                                if (loading) return <p>Loading...</p>
                                if (error) return <p>Error :(((</p>
                        
                                const messages = data.chats.map(c => {
                                    return (<div key={c.id} id="message" className="chat-message" style={{"margin":"3px"}} >
                                        {c.from} : {c.message}
                                    </div>)
                                })
                                
                                const chats = <div style={{"width": "100%", "height":"500px", "margin":'10px'}}>
                                    <h2> Chatroom </h2><div
                                        style={{"border":"1px solid", "overflowY": "scroll", 
                                        "overflowWrap": "break-word", "height":"90%"}}>
                                        {messages}
                                    </div></div>

                                if (!this.unsubscribe)
                                    this.unsubscribe = subscribeToMore({
                                    document: MESSAGE_SENT_SUBSCRIPTION,
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev
                                        console.log(subscriptionData.data.messageSent)
                                        console.log(prev.chats)
                                        const newMessage = subscriptionData.data.messageSent

                                        return {
                                            ...prev,
                                            chats: [...prev.chats,newMessage]
                                        }
                                    }})
                                return <div style={{width:"100%"}}>{chats}</div>
                            }}
                        </Query>
                    </Row>
                    <Row style={{ "margin": "auto", "width": "90%", "marginLeft":"10%"}}>
                        <Mutation mutation={SEND_MESSAGE_MUTATION}>
                            {createMessage => {
                                this.createMessage = createMessage

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
                </Drawer>
            </div>
    )}
}

export default Chatroom