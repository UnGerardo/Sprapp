import { addDeck, decks, deleteDeck } from "./db.js";
import Deck from "../models/Deck.js";

const addDeckInput = document.getElementById('add-deck-input');
const addDeckBtn = document.getElementById('add-deck-btn');
const deckListBody = document.getElementById('deck-list-body');
const deckErrorSpan = document.getElementById('deck-error');

if (window.location.href.includes('index.html')) {
  addDeckBtn.addEventListener('click', () => {
    for (let i = 0; i < decks.length; i++) {
      if (decks[i].name === addDeckInput.value) {
        deckErrorSpan.hidden = false;
        return;
      }
    }
    deckErrorSpan.hidden = true;

    const newDeck = new Deck({ name: addDeckInput.value });
    addDeckInput.value = '';

    const newDeckElement = document.createElement('div');
    newDeckElement.classList.add('deck');
    newDeckElement.setAttribute('data-name', newDeck.name);

    const deckNameDiv = document.createElement('a');
    deckNameDiv.setAttribute('href', `deck.html?deckName=${newDeck.name}`);
    deckNameDiv.innerText = newDeck.name;
    const deckCardsDueDiv = document.createElement('div');
    deckCardsDueDiv.innerText = '0';
    const deckTotalCardsDiv = document.createElement('div');
    deckTotalCardsDiv.innerText = '0';
    const deckDelBtn = document.createElement('button');
    deckDelBtn.innerText = 'Delete';
    deckDelBtn.addEventListener('click', function () {
      deleteDeck(this.parentElement.getAttribute('data-name'));
      newDeckElement.remove();
    });

    newDeckElement.appendChild(deckNameDiv);
    newDeckElement.appendChild(deckCardsDueDiv);
    newDeckElement.appendChild(deckTotalCardsDiv);
    newDeckElement.appendChild(deckDelBtn);
    deckListBody.appendChild(newDeckElement);

    addDeck(newDeck);
  });
}

// called in db.js after decks are retrieved, just need to render
export function renderDecks(decks, cards) {
  decks.forEach(deck => {
    const associatedCards = cards.filter(card => card.deck === deck.name);

    const newDeckElement = document.createElement('div');
    newDeckElement.classList.add('deck');
    newDeckElement.setAttribute('data-name', deck.name);

    const deckNameDiv = document.createElement('a');
    deckNameDiv.setAttribute('href', `deck.html?deckName=${deck.name}`);
    deckNameDiv.innerText = deck.name;

    const deckCardsDueDiv = document.createElement('div');
    deckCardsDueDiv.innerText = `${associatedCards.reduce((sum, card) => sum += card.date < new Date() ? 1 : 0, 0)}`;

    const deckTotalCardsDiv = document.createElement('div');
    deckTotalCardsDiv.innerText = associatedCards.length;

    const deckDelBtn = document.createElement('button');
    deckDelBtn.innerText = 'Delete';
    deckDelBtn.addEventListener('click', function () {
      deleteDeck(this.parentElement.getAttribute('data-name'));
      newDeckElement.remove();
    });

    newDeckElement.appendChild(deckNameDiv);
    newDeckElement.appendChild(deckCardsDueDiv);
    newDeckElement.appendChild(deckTotalCardsDiv);
    newDeckElement.appendChild(deckDelBtn);
    deckListBody.appendChild(newDeckElement);
  });
}