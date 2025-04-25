import moment from 'moment';
// import { addUtcForIsoString } from 'utils/timezone';

export const formatMDY = (data) => {
  return data ? window?.moment?.utc(data).local().format('MM/DD/YYYY') : '';
};

export const formatMDYHMS = (data) => {
  return data ? window?.moment?.utc(data).local().format('MM/DD/YYYY HH:mm:ss') : '';
};

export const customFormat = (data, format) => {
  const date = window?.moment?.utc(data).local();
  return date.isValid() ? date.format(format) : '';
};

export const getDateFormat = (date) => {
  const d = moment(date);
  return date && d.isValid() ? d : '';
};

export const formatYMD = (data) => {
  return data ? moment(data).format('YYYY-MM-DD') : '';
};

export const startDMY = (data, type) => {
  return moment(data).startOf(type).toString();
};

export const endDMY = (data, type) => {
  return moment(data).endOf(type).toString();
};

export const formatMDYWithParam = (param) => {
  return param && param.value ? formatMDY(param.value) : '';
};
export const formatMDYHMSWithParam = (param) => {
  return param && param.value ? formatMDYHMS(param.value) : '';
};

export const formatTime = (data) => {
  return data ? moment(data).format('HH:mm A') : '';
};

export const formatFullTime = (data) => {
  return data ? moment(data).format('MM/DD/YYYY hh:mm A') : '';
};

export const exportToChatTime = (isoDate) => {
  if (!isoDate) return;
  const diff = moment(isoDate).diff(new Date(), 'hours');

  let result;

  if (-diff < 10) {
    result = window?.moment(isoDate).fromNow();
  }

  if (-diff >= 10) {
    result = window?.moment(isoDate).calendar();
  }

  return result;
};

export const formattedFullTime = (data) => moment(data).format('YYYY-MM-DDTHH:mm:ss[Z]');

export const startISOTime = (data, typeView) => {
  return moment(data).startOf(typeView).toISOString();
};

export const endISOTime = (data, typeView) => {
  return moment(data).endOf(typeView).toISOString();
};

// export const importFormDate = (isoDate) => {
//   return isoDate ? moment(addUtcForIsoString(isoDate)) : null;
// };

export const exportFormDate = (date) => {
  return date ? moment(date).toISOString() : null;
};

export const exportFormDateWithoutTime = (date, option = {}) => {
  if (date) {
    let newDate = new Date(moment(date));
    option?.isEnd ? newDate.setHours(23, 59, 59, 0) : newDate.setHours(0, 0, 0, 0);
    return newDate.toISOString();
  }
  return null;
};

export const formatRangeDateTime = (value) => {
  return value ? value?._d || value?.$d || null : null;
};
