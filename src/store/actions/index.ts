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
    GET_POLLS_START: `${ActionPrefixes.poll}/GET_POLLS_START`,
    GET_POLLS_SUCCESS: `${ActionPrefixes.poll}/GET_POLLS_SUCCESS`,
    GET_POLLS_FAIL: `${ActionPrefixes.poll}/GET_POLLS_FAIL`,
    CREATE: `${ActionPrefixes.poll}/CREATE`
  }
}

export default ActionTypes
