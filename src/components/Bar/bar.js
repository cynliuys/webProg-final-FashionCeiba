import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PostIcon from '@material-ui/icons/Message';
import CourseIcon from '@material-ui/icons/ImportContacts'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import PDFIcon from '@material-ui/icons/Description'
import PeopleIcon from '@material-ui/icons/People'
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect, Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from 'react-apollo'
import {
    LOGIN_QUERY,
    SIGNOUT_USER_MUTATION,
} from '../../graphql'


const useStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontWeight: '600',
    marginRight: '2%',
    marginLeft: '2%'
  },
});


class MenuAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        }
        this.login_user = null;
    };
    handleMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }
    handleClose = () => {
        this.setState({ anchorEl: null });
    }
    signout = () => {
        this.signoutUser();
    }


    render () {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
            <AppBar position="static" style={{backgroundColor:'green'}}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Modern Ceiba
                    </Typography>
                        <div style={{flexGrow: 1, justifyContent:'center',alignItems:"center", display: 'flex', flexWrap: 'wrap'}}>
                        <Link to={'/courseinfo'} style={{ color: '#FFF', textDecoration: 'none' }}>
                        <MenuItem style={{width:'250px',justifyContent:'center',alignItems:"center"}}>
                            <IconButton aria-label="Show mails" color="inherit" >
                                <CourseIcon />
                            </IconButton>
                            <p style={{fontWeight: '600'}}>Course Info.</p>
                        </MenuItem>
                        </Link>   
                        

                        <MenuItem style={{width:'250px',justifyContent:'center',alignItems:"center"}}>
                            <IconButton aria-label="Show mails" color="inherit" >
                                <PeopleIcon />
                            </IconButton>
                            <p style={{fontWeight: '600'}}>Teacher Info.</p>
                        </MenuItem>
                        
                        <Link to={'/main'} style={{ color: '#FFF', textDecoration: 'none' }}>
                        <MenuItem style={{width:'250px',justifyContent:'center',alignItems:"center"}}>
                            <IconButton aria-label="Show mails" color="inherit" >
                                <PDFIcon />
                            </IconButton>
                            <p style={{fontWeight: '600'}}>Lecture</p>
                        </MenuItem>
                        </Link>
                        
                        <Link to={'/board'} style={{ color: '#FFF', textDecoration: 'none' }}>
                        <MenuItem style={{width:'250px',justifyContent:'center',alignItems:"center"}}>
                            <IconButton aria-label="Show mails" color="inherit" >
                                <PostIcon />
                            </IconButton>
                            <p style={{fontWeight: '600'}}>Bulletin Board</p>
                        </MenuItem>
                        </Link>
                        
                        <Link to={'/calendar'} style={{ color: '#FFF', textDecoration: 'none' }}>
                        <MenuItem style={{width:'250px',justifyContent:'center',alignItems:"center"}}>
                            <IconButton aria-label="Show mails" color="inherit" >
                                <CalendarIcon />
                            </IconButton>
                            <p style={{fontWeight: '600'}}>Calendar</p>
                        </MenuItem>
                        </Link>

                        </div>
                        <Query query={LOGIN_QUERY}>
                        {({ loading, error, data}) => {
                            if (loading) return null
                            if (error) return null
                            this.login_user = data.isLogin
                            if (!this.login_user)
                                return (
                                    <div>
                                    <IconButton
                                    aria-label="Account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    color="inherit"
                                    style = {{visibility: 'hidden'}}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                    <Redirect to='/login' />
                                    </div>)
                            else {
                                return (<div>
                                    <IconButton
                                        aria-label="Account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={this.handleMenu}
                                        color="inherit"
                                    >
                                        <AccountCircle fontSize="large"/>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={this.state.anchorEl}
                                        anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                        }}
                                        open={Boolean(this.state.anchorEl)}
                                        onClose={this.handleClose}
                                    >
                                        <h3 style={{textAlign:'center', padding:'10px'}}>{this.login_user.name}</h3>
                                        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={this.handleClose}>My account</MenuItem>
                                        <Mutation mutation={SIGNOUT_USER_MUTATION} refetchQueries={[{ query: LOGIN_QUERY }]}>
                                            {signoutUser => {
                                            this.signoutUser = signoutUser;
                                            return (
                                            <MenuItem onClick={this.signout}>Log out</MenuItem>
                                            );}}
                                        </Mutation> 
                                        
                                    </Menu>
                                    </div>)
                            }
                            
                        }}
                        </Query>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default  withStyles(useStyles)(MenuAppBar);