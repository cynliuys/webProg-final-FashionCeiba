import React, { Component } from "react";
import { Mutation } from 'react-apollo'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {
    CREATE_USER_MUTATION
} from '../../graphql'

const ColorButton = withStyles(theme => ({
    root: {
      color: theme.palette.getContrastText(green[400]),
      backgroundColor: green[400],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
}))(Button);

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(5),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      backgroundColor: theme.palette.secondary.main,
      alignItems: 'center',
      margin: 'auto',
      marginTop: '10%'
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
          borderColor: 'green !important',
          fontSize: '1200'
        },
    },
    cssFocused: {},
    notchedOutline: {},
    cssOutlinedLabelInput: {
        '&$cssLabelFocused': {
          color: 'green !important',
        },
    },
    cssLabelFocused: {},
    submit: {
      margin: theme.spacing(3, 0, 2),
      color: 'white',
      fontWeight: '600'
    },
    footlink: {
        display:'flex',
    }
  });


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
          formName: '',
          formEmail: '',
          formPwd: '',
        }
      }

    handleFormSubmit = e => {
        e.preventDefault()

        const { formName, formEmail, formPwd} = this.state
    
        if (!formEmail || !formPwd || !formName) return        
        var error = false;
        this.createUser({
        variables: {
            name: formName,
            email: formEmail,
            pwd: formPwd}
        })
        .catch(() => { error=true; alert('Email Exists');})
        .then(() => {
            if (!error){
                this.setState({
                    formPwd: '',
                    formEmail: '',
                    formName: '',
                });
                const { history } = this.props;
                history.push('/login');
            }
            else{
                this.setState({
                    formPwd: '',
                    formEmail: '',
                });
            }
        })
    };
    
    render () {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <h1 style={{fontSize:'50px'}}>Modern Ceiba</h1>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign Up
                </Typography>
                <Mutation  mutation={CREATE_USER_MUTATION}>
                    {createUser => {
                    this.createUser = createUser
                    return (
                        <form className={classes.form} noValidate>
                            <TextField
                                InputProps={{
                                    classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                    },
                                }}
                                InputLabelProps={{
                                    classes: {
                                    root: classes.cssOutlinedLabelInput,
                                    focused: classes.cssLabelFocused,
                                    },
                                }}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="Name"
                                label="Name"
                                name="Name"
                                autoComplete="fname"
                                autoFocus
                                onChange={e => this.setState({ formName: e.target.value })}
                                value={this.state.formName}
                            />
                            <TextField
                                InputProps={{
                                    classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                    },
                                }}
                                InputLabelProps={{
                                    classes: {
                                    root: classes.cssOutlinedLabelInput,
                                    focused: classes.cssLabelFocused,
                                    },
                                }}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={e => this.setState({ formEmail: e.target.value })}
                                value={this.state.formEmail}
                            />
                            <TextField
                                InputProps={{
                                    classes: {
                                    root: classes.cssOutlinedInput,
                                    focused: classes.cssFocused,
                                    notchedOutline: classes.notchedOutline,
                                    },
                                }}
                                InputLabelProps={{
                                    classes: {
                                    root: classes.cssOutlinedLabelInput,
                                    focused: classes.cssLabelFocused,
                                    },
                                }}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={e => this.setState({ formPwd: e.target.value })}
                                value={this.state.formPwd}
                            />
                        <ColorButton                  
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleFormSubmit}
                        >
                            Sign Up
                        </ColorButton>
                        </form>
                    )}}
                    </Mutation>
              </div>
            </Container>
          );
    }
}

export default withStyles(useStyles)(Register);
