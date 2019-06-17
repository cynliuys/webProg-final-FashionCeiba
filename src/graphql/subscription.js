import { gql } from 'apollo-boost'

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