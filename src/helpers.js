export function toHumanTime(duration, showSeconds) {
  const hour = 60 * 60;
  const minute = 60;

  const hours = Math.floor(duration / hour);
  const minutes = Math.floor((duration - hours * hour) / minute);
  const seconds = duration % 60;

  let str = '';
  if (hours > 0) {
    str += `${hours}h`;
  }
  if (minutes > 0) {
    str += `${minutes}m`;
  }
  if (showSeconds && seconds > 0) {
    str += `${seconds}s`;
  }
  return str;
}

export function getLocalStore(key, defaultValue) {
  const value = JSON.parse(window.localStorage.getItem(key));
  return value === null ? defaultValue : value;
}

export default null;
