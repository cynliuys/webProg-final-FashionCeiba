import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo'
import { MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdbreact';
import {
    Container,
    Row,
    Col,
  } from 'reactstrap'
import {
    LOGIN_USER_MUTATION, 
    LOGIN_QUERY,
    USERS_QUERY
  } from '../../graphql'

import './Login.css'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          formEmail: '',
          formPwd: '',
        }
      }

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
                history.push('/main')
                return <Redirect to="/main" />},1000);
            }
        })
        this.setState({
            formEmail: '',
            formPwd: '',
        })

    }

    render () {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 className="title">Modern Ceiba</h1>
                    </Col>
                </Row>
                <Row className="form-row">
                    <MDBCol className="form-simple" md="6">
                        <MDBCard className="form-simple-card">
                            <div className="header pt-3 grey lighten-2">
                            <MDBRow className="d-flex justify-content-start">
                                <h3 className="deep-grey-text mt-1 mb-1 pb-1 mx-1">
                                Log in
                                </h3>
                            </MDBRow>
                            </div>
                            <Mutation mutation={LOGIN_USER_MUTATION} refetchQueries={[{ query: LOGIN_QUERY, USERS_QUERY }]}>
                                {loginUser => {
                                this.loginUser = loginUser
                                return (
                                    <MDBCardBody className="mx-1 mt-1 form-simple-card-body">
                                    <MDBInput label="Your email" group type="text" validate 
                                              value={this.state.formEmail}
                                              onChange={e =>
                                              this.setState({ formEmail: e.target.value })
                                              }/>
                                    <MDBInput
                                        label="Your password"
                                        group
                                        type="password"
                                        validate
                                        containerClass="mb-0"
                                        value={this.state.formPwd}
                                        onChange={e =>
                                        this.setState({ formPwd: e.target.value })
                                        }
                                    />
                                    <div className="text-center mb-2 mt-2">
                                        <MDBBtn
                                        color="danger"
                                        type="button"
                                        className="btn-block z-depth-2"
                                        onClick={this.handleFormSubmit}
                                        >
                                        Log in
                                        </MDBBtn>
                                    </div>
                                    <div className="font-small grey-text d-flex justify-content-center">
                                        Don't have an account?
                                        <h6 onClick={this.SignUp} className="signup dark-grey-text font-weight-bold ml-1">
                                            Sign up
                                        </h6>
                                    </div>
                                    </MDBCardBody>
                                )}}
                            </Mutation>
                        </MDBCard>
                    </MDBCol>
                </Row>
            </Container>
          );
    }
}

export default Login;