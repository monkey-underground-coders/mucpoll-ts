export const generatebase64 = (data: Array<string> | string) => {
  const dataSeq = data instanceof Array ? data.join(':') : data
  return window.btoa(unescape(encodeURIComponent(dataSeq)))
}

export const getLocalStorageItem = (key: string) => {
  const item = window.localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const extractHostname = (url: string) => {
  let hostname = url.includes('//') ? url.split('/')[2] : url.split('/')[0]
  hostname = hostname.split(':')[0]
  hostname = hostname.split('?')[0]

  return hostname
}

export const copyToClipBoardEvent = (evt: React.MouseEvent<HTMLButtonElement>, value: string) => {
  const textField = document.createElement('textarea')
  textField.innerText = value
  document.body.appendChild(textField)
  textField.select()
  document.execCommand('copy')
  textField.remove()
}
