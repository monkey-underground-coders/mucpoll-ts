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

    CREATE_POLL_START: `${ActionPrefixes.poll}/CREATE_POLL_START`,
    CREATE_POLL_SUCCESS: `${ActionPrefixes.poll}/CREATE_POLL_SUCCESS`,
    CREATE_POLL_FAIL: `${ActionPrefixes.poll}/CREATE_POLL_FAIL`,

    DELETE_POLL_START: `${ActionPrefixes.poll}/DELETE_POLL_START`,
    DELETE_POLL_SUCCESS: `${ActionPrefixes.poll}/DELETE_POLL_SUCCESS`,
    DELETE_POLL_FAIL: `${ActionPrefixes.poll}/DELETE_POLL_FAIL`,

    EDIT_POLL_START: `${ActionPrefixes.poll}/EDIT_POLL_START`,
    EDIT_POLL_SUCCESS: `${ActionPrefixes.poll}/EDIT_POLL_SUCCESS`,
    EDIT_POLL_FAIL: `${ActionPrefixes.poll}/EDIT_POLL_FAIL`,

    CREATE_POLL_QUESTIONS_START: `${ActionPrefixes.poll}/CREATE_POLL_QUESTIONS_START`,
    CREATE_POLL_QUESTIONS_SUCCESS: `${ActionPrefixes.poll}/CREATE_POLL_QUESTIONS_SUCCESS`,
    CREATE_POLL_QUESTIONS_FAIL: `${ActionPrefixes.poll}/CREATE_POLL_QUESTIONS_FAIL`
  }
}

export default ActionTypes
