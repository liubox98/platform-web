// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value)
          .toFixed(digits)
          .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      )
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/** 时间过滤器 */
export function msgDateFormat(msg, pattern = '') {
  var mt = new Date(msg)
  var y = mt.getFullYear()
  var m = (mt.getMonth() + 1).toString().padStart(2, '0')
  var d = mt.getDate().toString().padStart(2, '0')
  if (pattern === 'yyyy-mm-dd') {
    return y + '-' + m + '-' + d
  }
  var h = mt.getHours().toString().padStart(2, '0')
  var mi = mt.getMinutes().toString().padStart(2, '0')
  var s = mt.getSeconds().toString().padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mi}:${s}`
}

/** 时间格式过滤 */
export function TimeFormat(msg) {
  if (msg === null) {
    return
  }
  return msg.replace(/T/g, ' ').replace(/Z/g, '')
}

/** 名字格式化 */
export function nameFormat(name) {
  if (/[\u4e00-\u9fa5]/.test(name)) {
    // 中文名字
    if (name.length >= 3) {
      return name.substring(name.length - 2)
    }
    return name
  } else {
    // 英文名字
    return name
  }
}

