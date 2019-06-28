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

    TODO: {
      subscribe: async(parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('TODO')
      }
    },

    messageSent: {
      subscribe: async(parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('CHAT_CHANNEL')
      }
    }

}

export { Subscription as default }