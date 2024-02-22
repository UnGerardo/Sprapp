
export default class Deck {
  constructor({ name = '', cards = [] }) {
    this.name = name;
    this.cards = cards;
  }

  changeName(name) {
    this.name = name;
  }

  addCard(card) {
    this.cards.push(card);

    return card.id === this.cards[this.cards.length - 1].id;
  }

  removeCard(cardId) {
    console.log(this.cards);
    this.cards = this.cards.filter(card => card.id !== cardId);
    console.log(this.cards);
  }
}