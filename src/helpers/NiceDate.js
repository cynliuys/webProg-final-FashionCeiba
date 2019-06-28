const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

class NiceDate {
  constructor(givendateObj = Date(), daysToAdd = 0) {
    this.dateObj = new Date(givendateObj);
    this.dateObj.setDate(this.dateObj.getDate() + daysToAdd);

    this.refresh();
  }

  show() {
    return `${this.month}.${this.date}.${this.year}`;
  }

  refresh() {
    this.date = this.dateObj.getDate();
    this.day = this.dateObj.getDay();
    this.month = this.dateObj.getMonth() + 1;
    this.monthName = months[this.month - 1];
    this.year = this.dateObj.getFullYear();
  }

  addDays(amount) {
    this.dateObj.setDate(this.dateObj.getDate() + amount);
    this.refresh();
  }

  addMonth(amount) {
    this.dateObj.setMonth(this.dateObj.getMonth() + amount);
    this.refresh();
  }

  static newDate(niceDateObj, amountOfDays, amountOfMonths) {
    const res = new NiceDate(niceDateObj.dateObj);
    if (amountOfDays) {
      res.addDays(amountOfDays);
    }
    if (amountOfMonths) {
      res.addMonth(amountOfMonths);
    }
    return res;
  }
}

export default NiceDate;
