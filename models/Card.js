import { putCard } from "../js/db.js";

const MAX_INTERVAL = 100;

export default class Card {
  constructor({ id = crypto.randomUUID(), deck = '', front = '', back = '', date = '', interval = 0, repetitions = 0, easeFactor = 2.5} = {}) {
    this.id = id;
    this.deck = deck;
    this.front = front;
    this.back = back;
    this.date = date;
    this.interval = interval;
    this.repetitions = repetitions;
    this.easeFactor = easeFactor;
  }

  updateCard(rating) {
    if(rating >= 3) {
      if(this.repetitions === 0) {
        this.interval = 1;
      } else if(this.repetitions === 1) {
        this.interval = 6;
      } else {
        const calculatedInterval = Math.ceil(this.interval * this.easeFactor) + 1;
        this.interval = calculatedInterval > MAX_INTERVAL ? MAX_INTERVAL : calculatedInterval;
        // This increases ease factor when rating is 5, makes no change when rating is 4, and decreases ease factor by varying amounts when rating is lower than 4. The lower rating is, the more ease factor is decreased.
        this.easeFactor = this.easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
      }
      this.repetitions++;
    } else {
      this.repetitions = 0;
      this.interval = 1;
    }

    if(this.easeFactor < 1.3) {
      this.easeFactor = 1.3;
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + this.interval);
    nextDate.setHours(0, 0, 0, 0); // Resets time to 00H:00M:00S.000MS
    this.date = nextDate;

    putCard(this);
  }
}