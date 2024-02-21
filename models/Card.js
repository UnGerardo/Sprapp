
export default class Card {
  constructor({ front, back, date }) {
    this.front = front;
    this.back = back;
    this.date = date;
    this.interval = 0;
    this.repetitions = 0;
    this.easeFactor = 2.5;
  }
}