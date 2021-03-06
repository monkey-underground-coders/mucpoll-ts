export const PRODUCTION_MODE = process.env.NODE_ENV === 'production'
export const DEV_MODE = process.env.NODE_ENV === 'development'

const proxy = 'http://5.101.181.94:7999'
const hostname = 'https://mucpoll.a6raywa1cher.com/mucpoll-spring'
const wsHostname = 'wss://mucpoll.a6raywa1cher.com/mucpoll-spring'

const getUrl = (route: string) => {
  if (DEV_MODE) {
    return `${proxy}/${hostname}/${route}`
  }
  return `${hostname}/${route}`
}

const getWsUrl = (route: string) => {
  return `${wsHostname}/${route}`
}

export const apiRoutes = {
  authorize: getUrl(`user/cookies`),
  register: getUrl(`user/reg`),
  getPolls: (size: number = 10, page: number = 0) =>
    getUrl(`poll/polls?size=${size}&page=${page}&sort=createdAt%2Cdesc`),
  createPoll: getUrl(`poll/create`),
  poll: (pid: number) => getUrl(`poll/${pid}`),
  pollQuestion: (pid: number) => getUrl(`poll/${pid}/question`),
  pollHistory: (pid: number, size: number = 10, page: number = 0) =>
    getUrl(`poll/${pid}/history?size=${size}&page=${page}&sort=startedAt%2Cdesc`)
}

export const wsRoutes = {
  poll: getWsUrl(`poll`)
}

export const selfUrl = window.location.origin

export default apiRoutes
