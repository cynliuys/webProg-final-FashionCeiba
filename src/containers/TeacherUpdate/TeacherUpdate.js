import React, { Component } from "react";
import { Mutation } from 'react-apollo'
import { MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBInput } from 'mdbreact';
import {
    Container,
    Row,
    Col,
  } from 'reactstrap'
import {
    TEACHER_PIC_MUTATION,
    TEACHER_PIC_QUERY
  } from '../../graphql'

  import './Register.css'

class TeacherUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {

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
                    <Mutation  mutation={CREATE_USER_MUTATION}>
                        {createUser => {
                        this.createUser = createUser
                        return (
                            <MDBCard className="form-simple-card">
                                <div className="header pt-3 grey lighten-2">
                                <MDBRow className="d-flex justify-content-start">
                                    <h3 className="deep-grey-text mt-1 mb-1 pb-1 mx-1">
                                    Sign up
                                    </h3>
                                </MDBRow>
                                </div>
                                <MDBCardBody className="mx-1 mt-1 form-simple-card-body">

                                <div className="form-name-age">
                                    <div className="form-name">
                                        <MDBInput  label="Your name*" group type="text" validate                                               
                                                onChange={e => this.setState({ formName: e.target.value })}
                                                value={this.state.formName}
                                        />
                                    </div>
                                </div>
                                <MDBInput label="Your email*" group type="text" validate 
                                        onChange={e => this.setState({ formEmail: e.target.value })}
                                        value={this.state.formEmail}
                                />
                                <MDBInput
                                    label="Your password*"
                                    group
                                    type="password"
                                    validate
                                    containerClass="mb-0"
                                    value={this.state.formPwd}
                                    onChange={e => this.setState({ formPwd: e.target.value })}
                                />
                                <div className="text-center mb-2 mt-2">
                                    <MDBBtn
                                    color="danger"
                                    type="button"
                                    className="btn-block z-depth-2"
                                    onClick={this.handleFormSubmit}
                                    >
                                    Sign up
                                    </MDBBtn>
                                </div>
                                </MDBCardBody>
                            </MDBCard>
                        )}}
                    </Mutation>
                </MDBCol>
            </Row>
        </Container>
        )
    }
}


export default TeacherUpdate;