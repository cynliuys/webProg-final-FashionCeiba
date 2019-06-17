import { gql } from 'apollo-boost'

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