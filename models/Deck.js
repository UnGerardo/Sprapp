// import { updateDeck } from "../js/db.js";

export default class Deck {
  constructor({ name = '' } = {}) {
    this.name = name;
  }

  // changeName(name) {
  //   this.name = name;
  //   updateDeck(this);
  //   TODO: go through each card that belongs to this deck and change its name to this new name
  // }
}