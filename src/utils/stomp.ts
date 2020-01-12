const randomInteger = (min: number, max: number) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

const getJson = (data: string) => {
  return JSON.parse(data.slice(data.indexOf('\n\n') + 2, data.indexOf('\x00')).trim())
}

const connect = (host: string, login: string, passcode: string, heartbeats = [10000, 20000]) => {
  if (login !== undefined) {
    return `CONNECT\naccept-version:1.1\nhost:${host}\nheart-beat:${heartbeats[0]},${heartbeats[1]}\nlogin:${login}\npasscode:${passcode}\n\n\x00\n`
  } else {
    return `CONNECT\naccept-version:1.1\nhost:${host}\nheart-beat:${heartbeats[0]},${heartbeats[1]}\n\n\x00\n`
  }
}

const subscribe = (path: string, idx: string | null = null, ack = 'auto') => {
  const cidx = idx ? idx : randomInteger(0, 100000000)
  return `SUBSCRIBE\nid:${cidx}\ndestination:${path}\nack:${ack}\n\n\x00\n`
}

const send = (path: string, msg: string = '', contentType = 'application/json') => {
  const message = `SEND\ndestination:${path}\ncontent-type:${contentType}\n\n${msg}\x00\n`
  return message
}

export default { connect, subscribe, send, getJson }
