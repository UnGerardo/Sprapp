import { updateDeck } from "../js/db.js";

export default class Deck {
  constructor({ name = '', cards = [] }) {
    this.name = name;
    this.cards = cards;
  }

  changeName(name) {
    this.name = name;
    updateDeck(this);
  }

  addCard(card) {
    this.cards.push(card);
    updateDeck(this);
  }

  removeCard(cardId) {
    this.cards = this.cards.filter(card => card.id !== cardId);
    updateDeck(this);
  }
}