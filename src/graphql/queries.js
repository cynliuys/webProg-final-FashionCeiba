import { gql } from 'apollo-boost'

export const LOGIN_QUERY = gql`
  query {
    isLogin {
      id
      name
      email
    }
  }
`

export const USERS_QUERY = gql`
  query {
    getUSERs {
      name
    }
  }
`

export const PDFS_QUERY = gql`
    query {
        getPDFs{
          id
          filename
          pdf
    }
  }
`

export const TEACHER_PIC_QUERY = gql`
    query {
        getTeacherPic{
          id
          pic
          filename
          page
    }
  }
`