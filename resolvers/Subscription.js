const Subscription = {
    PDF: {
        subscribe: async(parent, args, { pubsub }, info) => {
          return pubsub.asyncIterator('PDF')
        }
    },

    login: {
        subscribe: async(parent, args, { pubsub }, info) => {
          return pubsub.asyncIterator('login')
        }
    },

    PIC: {
      subscribe: async(parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('PIC')
      }
  },

}

export { Subscription as default }