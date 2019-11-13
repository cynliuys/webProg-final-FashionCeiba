import React from 'react';
import { Query } from 'react-apollo'
import 'flexboxgrid';
import './PicQuery.css';

import {
    TEACHER_PIC_QUERY, TEACHER_PIC_SUBSCRIPTION, STUDENT_PIC_QUERY, STUDENT_PIC_SUBSCRIPTION
} from '../../graphql'


class PicQuery extends React.Component {
    constructor(props){
        super(props);
        this.unsubscribe = null;
    }  

    showQuery = (data)=>{
        if(this.props.isTeacher){
            if(Object.keys(data).length ===  0){ return null; }
            if(data.getTeacherPic.length ===  0){ return null; }
            console.log("Query !");
            return data.getTeacherPic.map((picture) =>{
                if(picture.filename===this.props.fileName && parseInt(picture.page)===this.props.page){
                    if(this.props.picOnField){
                        if(this.props.sketch){
                            this.props.sketch._fc.height = this.props.height;
                            this.props.sketch._fc.width = this.props.width;
                            this.props.sketch.setBackgroundFromDataUrl(picture.pic, {
                                stretched: true,
                            })
                        }
                    }
                    else{
                        return (<img className='teacherPic' src={picture.pic} width={this.props.width} height={this.props.height}/>);
                    }
                    return null;
                }
            });
        }
        else{
            if(Object.keys(data).length ===  0){ return null; }
            if(data.getStudentPic.length ===  0){ return null; }
            data.getStudentPic.map((picture) =>{
                if(picture.filename===this.props.fileName && parseInt(picture.page)===this.props.page){
                    if(this.props.sketch){
                        this.props.sketch.setBackgroundFromDataUrl(picture.pic, {
                            stretched: true,
                        })
                        // this.props.sketch.addImg(picture.pic, {
                        //     scale: 0.5,
                        // });
                    }
                }
            });
            return null;
        }
    }

    render(){
        return (
            <Query query={(this.props.isTeacher)?TEACHER_PIC_QUERY:STUDENT_PIC_QUERY}
                variables={{student: this.props.user}}>
                {({loading, error, data, subscribeToMore}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>Error...</p>
                    if (!this.unsubscribe) this.unsubscribe = subscribeToMore({
                        document: (this.props.isTeacher)?TEACHER_PIC_SUBSCRIPTION:STUDENT_PIC_SUBSCRIPTION,
                        updateQuery: (prev, { subscriptionData }) => {
                            if(!subscriptionData.data) return prev;
                            if(!this.props.isTeacher){
                                if (subscriptionData.data.studentPIC.data.student!==this.props.user) return prev;
                            }
                            // console.log("updateQuery !");
                            const temp = (this.props.isTeacher)?"PIC":"studentPIC"
                            const newData = subscriptionData.data[temp]["data"];
                            if(this.props.isTeacher){
                                if(subscriptionData.data.PIC.mutation === "CREATED"){
                                    return { ...prev, getTeacherPic: [newData, ...prev.getTeacherPic] }
                                }
                                else if(subscriptionData.data.PIC.mutation === "UPDATED"){
                                    let a = prev.getTeacherPic.map((prevData)=>{
                                        if(prevData.filename===newData.filename &&
                                            prevData.page===newData.page){ return newData; }
                                        else return prevData; 
                                    });
                                    return{ ...prev, getTeacherPic: a }
                                }
                            }
                            else{
                                if(subscriptionData.data.studentPIC.mutation === "CREATED"){
                                    return {
                                        ...prev,
                                        getStudentPic: [newData, ...prev.getStudentPic]
                                    }
                                }
                                else if(subscriptionData.data.studentPIC.mutation === "UPDATED"){
                                    let a = prev.getStudentPic.map((prevData)=>{
                                        if(prevData.filename===newData.filename &&
                                            prevData.page===newData.page){ return newData; }
                                        else{ return prevData; }
                                    });
                                    return{ ...prev, getStudentPic: a }
                                }

                            }
                        }
                    })
                    return this.showQuery(data);
                }}
            </Query>
            
        );
    }
}

export default PicQuery;