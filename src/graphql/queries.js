import { gql } from 'apollo-boost'

export const CHATS_QUERY = gql`
  query ChatsQuery {
    chats {
      id
      from
      message
    }
  }
`

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

export const TODOS_QUERY = gql`
  query {
    getTODOs {
      id
      text
      time
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

export const STUDENT_PIC_QUERY = gql`
    query($student: String!) {
        getStudentPic(student: $student){
          id
          pic
          filename
          page
          student
    }
  }
`