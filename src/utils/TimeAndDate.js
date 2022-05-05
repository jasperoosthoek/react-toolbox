import moment from 'moment';

export const getTimestamp = () => Math.round(new Date().getTime()/1000);
export const getToday = () => moment().utc().startOf('day');