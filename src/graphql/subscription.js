import { gql } from 'apollo-boost'


export const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription MessageSentSubscription {
    messageSent {
      id
      from
      message
    }
  }
`


export const PDF_SUBSCRIPTION = gql`
  subscription {
    PDF {
      mutation
      data {
        id
        filename
        pdf
    }
  }
}
`

export const TODO_SUBSCRIPTION = gql`
  subscription {
    TODO {
      mutation
      data {
        id
        text
        time
    }
  }
}
`


export const TEACHER_PIC_SUBSCRIPTION = gql`
  subscription {
    PIC {
      mutation
      data{
        id
        pic
        filename
        page
      }
    }
}
`

export const STUDENT_PIC_SUBSCRIPTION = gql`
  subscription {
    studentPIC {
      mutation
      data{
        id
        pic
        filename
        page
        student
      }
    }
}
`