import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo'
import { green } from '@material-ui/core/colors';
import {
    LOGIN_USER_MUTATION, 
    LOGIN_QUERY,
    USERS_QUERY
} from '../../graphql'



const ColorButton = withStyles(theme => ({
    root: {
      color: theme.palette.getContrastText(green[600]),
      backgroundColor: green[600],
      '&:hover': {
        backgroundColor: green[800],
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
      fontWeight: '600',
      color: 'white'
    },
  });



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          formEmail: '',
          formPwd: '',
        }
    };

    SignUp = () => {
        const { history } = this.props;
        history.push('/register');
    };


    handleFormSubmit = e => {
        e.preventDefault()
    
        const { formEmail, formPwd } = this.state
    
        if (!formEmail || !formPwd) return
        
        var error = false;
        this.loginUser({
        variables: {
            email: formEmail,
            pwd: formPwd}
        })
        .catch((e) => { error=true; alert(e); return e})
        .then(() => {
            if (!error){
                const { history } = this.props;
                setTimeout(() => {
                history.push('/courseinfo')
                return <Redirect to="/courseinfo" />},1000);
            }
        })
        this.setState({
            formEmail: '',
            formPwd: '',
        })
    };


    render () {
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Log In
                </Typography>
                <Mutation mutation={LOGIN_USER_MUTATION} refetchQueries={[{ query: LOGIN_QUERY, USERS_QUERY }]}>
                {loginUser => {
                    this.loginUser = loginUser
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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={this.state.formEmail}
                            onChange={e =>this.setState({ formEmail: e.target.value })}
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
                            value={this.state.formPwd}
                            onChange={e =>this.setState({ formPwd: e.target.value })}
                        />
                        <ColorButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={this.handleFormSubmit}
                        >
                            Log In
                        </ColorButton>
                        <Grid container>
                            <Grid item >
                                <Link href="#" variant="body2" onClick={this.SignUp} 
                                style={{color:'black',fontSize:'15px'}}>
                                {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        </form>
                    )}}
                </Mutation>
              </div>
            </Container>
          );
    }
}

export default  withStyles(useStyles)(Login);
