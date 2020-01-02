export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'
export const DEV_MODE = process.env.NODE_ENV === 'development'

const proxy = 'http://5.101.181.94:7999'
const hostname = 'https://mucpoll.a6raywa1cher.com/mucpoll-spring'

const getUrl = (route: string) => {
  if (DEV_MODE) {
    return `${proxy}/${hostname}/${route}`
  }
  return `${hostname}/${route}`
}

export const apiRoutes = {
  authorize: getUrl(`user/cookies`),
  getPolls: getUrl(`poll/polls`),
  createPoll: getUrl(`poll/create`)
}

export default apiRoutes
