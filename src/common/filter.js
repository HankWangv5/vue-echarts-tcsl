/**
 * title
 * @version  v1.0
 * @createTime: 2017/12/19
 * @createAuthor LXR
 */
import constant from '@/common/plugins/PluginConstant';

let formatDate = (date, param) => {
  if (date) {
    let time = new Date(date);
    if (param === 'endTime') {
      time = new Date(date - 24 * 60 * 60 * 1000);
    }
    let obj = {
      year: time.getFullYear(),
      month: time.getMonth(),
      date: time.getDate()
    };
    return `${obj.year}.${(obj.month + 1)}.${obj.date}`;
  } else {
    return '时间';
  }
};

/**
 * title
 * @version  v1.0
 * @createTime: 2018/3/16
 * @createAuthor zdl
 */

function thousandth (str) {
  let reg = /\d(?=(?:\d{3})+(?:\.\d+|$))/g;
  return str.replace(reg, (...rest) => rest[0] + ',');
};

function getReportFilter ({reportCode, reportParam, field, callBackFun, menuCode = '', tracId = '', dataStart = -1, dataEnd = -1, cacheKey = '', filterCondition = null, roleId = ''}) {
  let param = {
    // menuCode: menuCode,
    reportCode: reportCode,
    reportParam: {
      tbName: reportParam.tbName || reportParam.tableName || reportParam.tableCode,
      tbId: reportParam.tbId || reportParam.tableId,
      dbName: reportParam.dbName || reportParam.databaseName,
      tracId: tracId === '' ? (Date.parse(new Date()) + '') : tracId,
      indexCondition: [field]
    },
    roleId: roleId
  };
  if (!(menuCode === '')) {
    Object.assign(param, {menuCode: menuCode});
  }
  if (dataStart >= 0 && dataEnd >= dataStart) {
    let obj = {
      requestType: '1',
      dataStart: dataStart,
      dataEnd: dataEnd
    };
    Object.assign(param.reportParam, obj);
  }
  if (!(cacheKey === '')) {
    Object.assign(param.reportParam, {cacheKey: cacheKey});
  }
  if (filterCondition) {
    Object.assign(param.reportParam, {filterCondition: [filterCondition]});
  }
  callBackFun(param);
};

/**
 * 自定义筛选时间类型对时间戳显示格式format
 * @version  v1.0
 * @createTime: 2018/11/7
 * @createAuthor ashen
 */

function filterTimeFormate (node) {
  let filter = {};
  filter.filterValue = [node.time.timeFlag, node.time.beginTime, node.time.endTime, node.time.tag || undefined];
  filter.filterUse = [...filter.filterValue, node.time.picker || undefined];
  if (node.time.timeFlag === 'all') {
    const finder = constant.DataButtons.find((btn) => { return btn.tag === node.time.tag; });
    if (finder) filter.showName = finder.label;
  } else {
    const computeTime = (Date) => {
      return {
        year: Date.getFullYear(),
        month: Date.getMonth(),
        date: Date.getDate()
      };
    };
    let time = new Date(node.time.beginTime);
    time = computeTime(time);
    let time2 = new Date(node.time.endTime - 24 * 60 * 60 * 1000);
    time2 = computeTime(time2);
    if (JSON.stringify(time) === JSON.stringify(time2)) {
      filter.showName = `${time.year}.${(time.month + 1)}.${time.date}`;
    } else {
      filter.showName = `${time.year}.${(time.month + 1)}.${time.date}~${time2.year}.${(time2.month + 1)}.${time2.date}`;
    }
  }
  return filter;
}

export {
  formatDate,
  thousandth,
  filterTimeFormate,
  getReportFilter
};
