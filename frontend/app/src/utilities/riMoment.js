import moment from 'moment-timezone';

export default function riMoment(mom) { return moment(mom).tz('America/New_York'); };
export function isMoment(mom) { return moment.isMoment(mom); }
