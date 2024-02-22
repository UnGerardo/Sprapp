
export default class Card {
  constructor({ id = crypto.randomUUID(), front = '', back = '', date = '', interval = 0, repetitions = 0, easeFactor = 2.5}) {
    this.id = id;
    this.front = front;
    this.back = back;
    this.date = date;
    this.interval = interval;
    this.repetitions = repetitions;
    this.easeFactor = easeFactor;
  }
}