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

}

export { Subscription as default }