import { gql } from 'apollo-boost'

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessageMutation($from: String!, $message: String!) {
    sendMessage(
      from: $from,
      message: $message
    ) {
      id
      from
      message
    }
  }
`

export const SINGLE_UPLOAD_PDF_MUTATION = gql`
    mutation singleUploadPDF (
      $data: Upload!
    ){
      singleUploadPDF(data: $data)
        {
          id
          filename
    }
  }
`


export const LOGIN_USER_MUTATION = gql`
  mutation loginUser(
    $email: String!
    $pwd: String!
    ){
      loginUser(
        data: {
          email: $email
          pwd: $pwd
        })
      {
        id
        name
        email
        pwd
      }
    } 
`

export const CREATE_USER_MUTATION = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $pwd: String!
    ){
      createUser(
        data: {
          name: $name
          email: $email
          pwd: $pwd
        })
      {
        name
        email
        pwd 
      }
    } 
`

export const SIGNOUT_USER_MUTATION = gql`
  mutation {
    signoutUser
  }
`

export const DELETE_PDF_MUTATION = gql`
  mutation deletePDF (
      $id: ID!
      $filename: String!
  ){
    deletePDF(
        data: {
          id: $id
          filename: $filename
    })
    {
      id
      filename
    }
  } 
`

export const TEACHER_PIC_MUTATION = gql`
  mutation teacherPic (
      $pic: String!
      $filename: String!
      $page: String!
    ){
      teacherPic(
        data: {
          pic: $pic
          filename: $filename
          page: $page 
        })
      {
        id
        pic
        filename
        page
    }
  } 
`

export const STUDENT_PIC_MUTATION = gql`
  mutation studentPic (
      $pic: String!
      $filename: String!
      $page: String!
      $student: String!
    ){
      studentPic(
        data: {
          pic: $pic
          filename: $filename
          page: $page
          student: $student
        })
      {
        id
        pic
        filename
        page
        student
    }
  } 
`
export const CREATE_TODO_MUTATION = gql`
  mutation createTodo (
      $text: String!
      $time: String!
  ){
    createTodo(
      data:{
        text: $text
        time: $time
      })
    {
      id
      text
      time
    }
  } 
`

export const DELETE_TODO_MUTATION = gql`
  mutation deleteTodo (
      $id: ID!
  ){
    deleteTodo(id: $id)
    {
      id
      text
      time
    }
  } 
`