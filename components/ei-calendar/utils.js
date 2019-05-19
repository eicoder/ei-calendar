export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || 'YYYY/MM/DD hh:mm:ss';
  let date;
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time)
  }
  const formatObj = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/(YYYY|MM|DD|hh|mm|ss|a)+/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0;
  });
  return time_str;
}

export function preYearMonth(dateStr) {
  // const current = parseTime(new Date(date), 'YYYY/MM');
  const [year, month] = dateStr.split('-');
  const newMonth = (+month === 1) ? 12 : `${+month - 1}`.padStart(2,'0');
  return `${+year - (+month === 1 ? 1 : 0)}-${newMonth}`;
}

export function nextYearMonth(dateStr) {
  // const current = parseTime(new Date(date), 'YYYY/MM');
  const [year, month] = dateStr.split('-');
  const newMonth = (+month === 12) ? 1 : `${+month + 1}`.padStart(2,'0');
  return `${+year + (+month === 12 ? 1 : 0)}-${newMonth}`;
}
