function replaceFormat(format) {
  if (!format) return format;
  if (format.match(/T/)) return format;
  return format.replace(/-/g, '/');
}

function Format(date, format = 'YYYY/MM/DD') {
  if (!date) return null;
  if (typeof date !== 'object') {
    date = new EDate([date]);
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
  return format.replace(/(YYYY|MM|DD|hh|mm|ss|a)+/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0;
  });
}

function Modify(date, { y, m, d }) {
  if (!date) return;
  if (typeof date !== 'object') {
    date = new EDate([date]);
  }
  if (d) {
    date.setDate(date.getDate() + d);
  }
  if (m) {
    const d = date.getDate();
    date.setMonth(date.getMonth() + m);
    if (date.getDate() < d)  date.setDate(0);
  }
  if (y) {
    const m = date.getMonth();
    date.setFullYear(date.getFullYear() + y);
    if (m < date.getMonth()) date.setDate(0);
  }
  return date;
}

export default class EDate extends Date {
  constructor(params = [], format) { // 只保留一个参数
    format && (format = replaceFormat(format));
    if (params.length > 1) {
      if (format) {
        super(Format(new Date(...params), format));
      } else {
        super(...params);
      }
      return;
    }
    let param = params[0];
    if (typeof param === 'string') {
      param = replaceFormat(param);
    }
    if (!format) {
      if (!param) { // 对undefined和null、0进行过滤
        super();
      } else {
        super(param);
      }
    } else {
      if (!param) { // 对undefined和null、0进行过滤
        param = Format(new Date(), format);
      } else {
        param = Format(new Date(param), format);
      }
      super(param);
    }
  }

  format(formatStr) {
    return Format(this, formatStr);
  }

  modify(param) {
    return Modify(this, param);
  }

  static format = Format;

  static modify = Modify;
}
