import { decks, addDeck } from "./db";
import Deck from "../models/Deck";

const addDeckInput = document.getElementById('add-deck-input');
const addDeckBtn = document.getElementById('add-deck-btn');
const deckListBody = document.getElementById('deck-list-body');

addDeckBtn.addEventListener('click', () => {
  const newDeck = { name: addDeckInput.value };
  addDeckInput.value = '';

  const newDeckElement = document.createElement('a');
  newDeckElement.classList.add('deck');
  newDeckElement.setAttribute('data-name', newDeck.name);
  newDeckElement.setAttribute('href', `deck.html?deckName=${newDeck.name}`);

  const deckNameDiv = document.createElement('div');
  deckNameDiv.innerText = newDeck.name;
  const deckCardsDueDiv = document.createElement('div');
  deckCardsDueDiv.innerText = '0';
  const deckTotalCardsDiv = document.createElement('div');
  deckTotalCardsDiv.innerText = '0';

  newDeckElement.appendChild(deckNameDiv);
  newDeckElement.appendChild(deckCardsDueDiv);
  newDeckElement.appendChild(deckTotalCardsDiv);
  deckListBody.appendChild(newDeckElement);

  addDeck(newDeck);
});

// called in db.js after decks are retrieved, just need to render
export function renderDecks(decks) {
  decks.forEach(deck => {
    const newDeckElement = document.createElement('a');
    newDeckElement.classList.add('deck');
    newDeckElement.setAttribute('data-name', deck.name);
    newDeckElement.setAttribute('href', `deck.html?deckName=${deck.name}`);

    const deckNameDiv = document.createElement('div');
    deckNameDiv.innerText = deck.name;
    const deckCardsDueDiv = document.createElement('div');
    deckCardsDueDiv.innerText = '0';
    const deckTotalCardsDiv = document.createElement('div');
    deckTotalCardsDiv.innerText = deck.cards.length;

    newDeckElement.appendChild(deckNameDiv);
    newDeckElement.appendChild(deckCardsDueDiv);
    newDeckElement.appendChild(deckTotalCardsDiv);
    deckListBody.appendChild(newDeckElement);
  });
}