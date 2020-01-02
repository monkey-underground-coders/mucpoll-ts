enum ActionPrefixes {
  session = '%%SESSION',
  user = '%%USER',
  interface = '%%INTERFACE',
  poll = '%%POLL'
}

export const ActionTypes = {
  USER: {
    LOGOUT: `${ActionPrefixes.user}/LOGOUT`,
    AUTH: `${ActionPrefixes.user}/AUTH`
  },

  POLL: {
    GET_POLLS: `${ActionPrefixes.poll}/GET_POLLS`,
    CREATE: `${ActionPrefixes.poll}/CREATE`
  }
}

export default ActionTypes
