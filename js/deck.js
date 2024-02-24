import { decks } from "./db.js";
import Card from "../models/Card.js";

const params = new URLSearchParams(window.location.search);
const deckName = params.get('deckName');

document.getElementsByTagName('title')[0].innerText = deckName;

const cardFrontInput = document.getElementById('card-front-input');
const cardBackInput = document.getElementById('card-back-input');
const addCardBtn = document.getElementById('add-card-btn');
const cardListBody = document.getElementById('card-list-body');

if (addCardBtn) {
  addCardBtn.addEventListener('click', () => {
    // set date to tomorrow and zero out hours, mins, secs, and millisecs
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);

    const newCard = new Card({
      front: cardFrontInput.value,
      back: cardBackInput.value,
      date: tomorrow,
    });
    cardFrontInput.value = '';
    cardBackInput.value = '';

    const cardFrontDiv = document.createElement('div');
    cardFrontDiv.innerText = newCard.front;

    const cardBackDiv = document.createElement('div');
    cardBackDiv.innerText = newCard.back;
    cardBackDiv.hidden = true;
    cardFrontDiv.addEventListener('mouseover', () => {
      cardBackDiv.hidden = false;
    });
    cardFrontDiv.addEventListener('mouseleave', () => {
      cardBackDiv.hidden = true;
    });

    const dueDiv = document.createElement('div');

    const cardDelBtn = document.createElement('button');
    cardDelBtn.innerText = 'Delete';
    cardDelBtn.addEventListener('click', function () {
      for (let i = 0; i < decks.length; i++) {
        if (decks[i].name === deckName) {
          decks[i].removeCard(this.parentElement.getAttribute('data-name'));
        }
      }
      newCardElement.remove();
    });

    const newCardElement = document.createElement('div');
    newCardElement.classList.add('card');
    newCardElement.setAttribute('data-name', newCard.id);

    newCardElement.appendChild(cardFrontDiv);
    newCardElement.appendChild(cardBackDiv);
    newCardElement.appendChild(dueDiv);
    newCardElement.appendChild(cardDelBtn);

    cardListBody.appendChild(newCardElement);

    for (let i = 0; i < decks.length; i++) {
      if (decks[i].name === deckName) {
        decks[i].addCard(newCard);
        break;
      }
    }
  });
}

export function renderCards(cards) {
  cards.forEach(card => {
    const now = new Date();

    const cardFrontDiv = document.createElement('div');
    cardFrontDiv.innerText = card.front;

    const cardBackDiv = document.createElement('div');
    cardBackDiv.innerText = card.back;
    cardBackDiv.hidden = true;
    cardFrontDiv.addEventListener('mouseover', () => {
      cardBackDiv.hidden = false;
    });
    cardFrontDiv.addEventListener('mouseleave', () => {
      cardBackDiv.hidden = true;
    });

    const dueDiv = document.createElement('div');
    if (card.date < now) {
      dueDiv.innerText = 'Due';
    }

    const cardDelBtn = document.createElement('button');
    cardDelBtn.innerText = 'Delete';
    cardDelBtn.addEventListener('click', function () {
      for (let i = 0; i < decks.length; i++) {
        if (decks[i].name === deckName) {
          decks[i].removeCard(this.parentElement.getAttribute('data-name'));
        }
      }
      newCardElement.remove();
    });

    const newCardElement = document.createElement('div');
    newCardElement.classList.add('card');
    newCardElement.setAttribute('data-name', card.id);

    newCardElement.appendChild(cardFrontDiv);
    newCardElement.appendChild(cardBackDiv);
    newCardElement.appendChild(dueDiv);
    newCardElement.appendChild(cardDelBtn);

    cardListBody.appendChild(newCardElement);
  });
}