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

export const parseDate = (date: string) => {
  if (!date) return date
  return new Date(date).toLocaleDateString('en-GB', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export const generateChartBarColor = (index: number) => {
  const chartBarColors = ['#8884d8', '#82ca9d', '#b45cc3', '#9816f4', '#ff7844', '#c35c61']
  return chartBarColors[index % chartBarColors.length]
}

export const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const getCurrentSeconds = () => {
  return new Date().getTime() / 1000
}
