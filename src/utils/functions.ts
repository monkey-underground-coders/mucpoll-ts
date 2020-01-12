export const generatebase64 = (data: Array<string> | string) => {
  const dataSeq = data instanceof Array ? data.join(':') : data
  return window.btoa(unescape(encodeURIComponent(dataSeq)))
}
