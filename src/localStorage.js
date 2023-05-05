const timeKey = 'kuma-watch-time';
const timeLogKey = 'kuma-watch-timeLog';

export const Storage = {
  getTime() {
    return JSON.parse(localStorage.getItem(timeKey)) ?? { seconds: 0, minutes: 0, hours: 0 };
  },

  setTime(time) {
    localStorage.setItem(timeKey, JSON.stringify(time));
  },

  clearTime() {
    localStorage.setItem(timeKey, JSON.stringify({ seconds: 0, minutes: 0, hours: 0 }));
  },

  getTimeLog() {
    return JSON.parse(localStorage.getItem(timeLogKey)) ?? [];
  },

  addTimeLog(timeLog) {
    localStorage.setItem(timeLogKey, JSON.stringify([...this.getTimeLog(), timeLog]));
  },

  clearTimeLog() {
    localStorage.setItem(timeLogKey, JSON.stringify([]));
  },
};
