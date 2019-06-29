import React, {Component} from 'react';
import { Table } from 'reactstrap';
import './CourseInfo.css'
//import 'bootstrap/dist/css/bootstrap.css';

class CourseInfo extends Component {
    render () {
        return (
            <Table hover style={{width:'60%', margin:'auto', marginTop:'5%'}}>
                <thead>
                    <tr>
                        <th className="course_caption" style={{height:'50px'}} colSpan="2">
                            Infomation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Course Name</th>
                        <td className="course_td" style={{height:'50px'}} colSpan="1">Web Programming</td>
                    </tr>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Credits</th>
                        <td className="course_td" colSpan="1" style={{height:'50px'}}>3</td>
                    </tr>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Semester</th>
                        <td className="course_td" colSpan="1" style={{height:'50px'}}>107-2</td>
                    </tr>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Time</th>
                        <td className="course_td" colSpan="1" style={{height:'50px'}}>Wednesday A,B,C</td>
                    </tr>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Classroom</th>
                        <td className="course_td" colSpan="1" style={{height:'50px'}}>EE2-143</td>
                    </tr>
                    <tr>
                        <th className="course_th" style={{height:'50px'}}>Description</th>
                        <td className="course_td" colSpan="1" style={{height:'50px'}}>A good class we can learn how to build a web app</td> 
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default CourseInfo;