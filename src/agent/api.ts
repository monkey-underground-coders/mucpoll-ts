export const hostname = ''

const getUrl = (route: string) => `${hostname}/${route}`

export default {
  register: getUrl('register')
}
