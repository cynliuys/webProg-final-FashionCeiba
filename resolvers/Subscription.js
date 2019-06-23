const Subscription = {
    PDF: {
        subscribe: async(parent, args, { pubsub }, info) => {
          return pubsub.asyncIterator('PDF')
        }
    },

    PIC: {
      subscribe: async(parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('PIC')
      }
    },

    studentPIC: {
      subscribe: async(parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('studentPIC')
      }
    },

}

export { Subscription as default }