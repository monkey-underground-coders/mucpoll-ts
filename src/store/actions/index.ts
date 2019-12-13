enum ActionPrefixes {
  session = '%%SESSION',
  user = '%%USER',
  interface = '%%INTERFACE'
}

export const ActionTypes = {
  USER: {
    LOGOUT: `${ActionPrefixes.user}/LOGOUT`
  }
}

export default ActionTypes
