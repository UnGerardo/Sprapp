export let db = null;
export let decks = [];
export let cards = [];

import Deck from '../models/Deck.js';
import Card from '../models/Card.js';
import { renderDecks } from './script.js';
import { renderCards } from './deck.js';
import { renderStudyPage } from './study.js';

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const open = indexedDB.open('DeckDatabase', 1);

open.onerror = function (event) {
  console.log('An error occurred with IndexedDB');
  console.error(event);
}

open.onupgradeneeded = function() {
  db = open.result;
  db.createObjectStore('DeckStore', {keyPath: 'name'});
  const cardStore = db.createObjectStore('CardStore', {keyPath: 'id'});
  cardStore.createIndex('DeckNameIndex', 'deck', {unique: false});
};

open.onsuccess = async function() {
  db = open.result;
  console.log('Database opened.');

  if (window.location.href.includes('index.html')) {
    decks = await getDecks();
    cards = await getAllCards();
    renderDecks(decks, cards);
  }
  else if (window.location.href.includes('deck.html')) {
    const params = new URLSearchParams(window.location.search);
    const deckName = params.get('deckName');

    cards = await getCardsByDeck(deckName);
    renderCards(cards);
  }
  else if (window.location.href.includes('study.html')) {
    const params = new URLSearchParams(window.location.search);
    const deckName = params.get('deckName');

    cards = await getCardsByDeck(deckName);
    renderStudyPage(cards);
  }
}

// Deck Database Functions
export function addDeck(deck) {
  const t = db.transaction(['DeckStore'], 'readwrite');
  const deckStore = t.objectStore('DeckStore');

  deckStore.add(deck);

  t.oncomplete = function() {
    console.log(`Deck: ${deck.name} added!`);
    decks.push(deck);
  }
}

// export function putDeck(deck) {
//   const t = db.transaction(['DeckStore'], 'readwrite');
//   const deckStore = t.objectStore('DeckStore');
//   const getReq = deckStore.get(deck.name);

//   getReq.onsuccess = function (event) {
//     const updateReq = deckStore.put(deck);
//     console.log(decks);
//     updateReq.onerror = (event) => console.error(`Error updating record: ${event.target.errorCode}`);
//     updateReq.onsuccess = (event) => console.log('Deck updated successfully');
//   }

//   getReq.onerror = (getReqErrorEvent) => console.log(`getReq Error: ${getReqErrorEvent.target.error}`);
//   t.oncomplete = () => console.log(`Deck: ${deck.name} updated!`);
// }

export function deleteDeck(deckName) {
  const t = db.transaction(['DeckStore'], 'readwrite');
  const deckStore = t.objectStore('DeckStore');
  const delReq = deckStore.delete(deckName);

  delReq.onsuccess = () => {
    console.log(`Deck: ${deckName} deleted!`);
    deleteCardsByDeck(deckName);
    decks = decks.filter(deck => deck.name !== deckName); // TODO: See note in deleteCard()
  }
  delReq.onerror = (errorEvent) => console.log(`Error in deletion: ${errorEvent.target.errorCode}`);
}

export async function getDecks() {
  return new Promise((resolve, reject) => {
    const t = db.transaction('DeckStore', 'readonly');
    const deckStore = t.objectStore('DeckStore');

    const decks = [];

    const openCursor = deckStore.openCursor();
    openCursor.onsuccess = function (openCursorEvent) {
      const cursor = openCursorEvent.target.result;
      if (cursor) {
        decks.push(new Deck(cursor.value));
        cursor.continue();
      } else {
        console.log('Retrieved all decks');
        resolve(decks);
      }
    }

    openCursor.onerror = openCursorErrorEvent => {
      console.log(`openCursor Error: ${openCursorErrorEvent.target.error}`);
      reject(openCursorErrorEvent.target.error);
    }

    t.onerror = transactionErrorEvent => {
      console.log(`Transaction Error: ${transactionErrorEvent.target.error}`);
      reject(transactionErrorEvent.target.error);
    }
  });
}

// Card Database Functions
export function addCard(card) {
  const t = db.transaction(['CardStore'], 'readwrite');
  const cardStore = t.objectStore('CardStore');

  cardStore.add(card);

  t.oncomplete = function() {
    console.log(`Card: ${card.id} added!`);
    cards.push(card); // TODO: Again, is this necessary? Not like you can do anything with this
  }
}

export function deleteCard(cardId) {
  const t = db.transaction(['CardStore'], 'readwrite');
  const cardStore = t.objectStore('CardStore');
  const delReq = cardStore.delete(cardId);

  delReq.onsuccess = () => {
    console.log(`Card: ${cardId} deleted!`);
    cards = cards.filter(card => card.id !== cardId); // TODO: Is this necessary? On navigation to another page it gets reset anyways, can't really do anything with them on current page
  }
  delReq.onerror = (errorEvent) => console.log(`Error in deletion: ${errorEvent.target.errorCode}`);
}

export function putCard(card) {
  const t = db.transaction(['CardStore'], 'readwrite');
  const cardStore = t.objectStore('CardStore');
  const getReq = cardStore.get(card.id);

  getReq.onsuccess = function (event) {
    const updateReq = cardStore.put(card);
    updateReq.onerror = (event) => console.error(`Error updating record: ${event.target.errorCode}`);
    updateReq.onsuccess = (event) => console.log('Card updated successfully');
  }

  getReq.onerror = (getReqErrorEvent) => console.log(`getReq Error: ${getReqErrorEvent.target.error}`);
  t.oncomplete = () => console.log(`Card: ${card.id} updated!`);
}

export async function getAllCards() {
  return new Promise((resolve, reject) => {
    const t = db.transaction('CardStore', 'readonly');
    const cardStore = t.objectStore('CardStore');

    const cards = [];

    const openCursor = cardStore.openCursor();
    openCursor.onsuccess = function (openCursorEvent) {
      const cursor = openCursorEvent.target.result;
      if (cursor) {
        cards.push(new Card(cursor.value));
        cursor.continue();
      } else {
        console.log('Retrieved all cards');
        resolve(cards);
      }
    }

    openCursor.onerror = openCursorErrorEvent => {
      console.log(`openCursor Error: ${openCursorErrorEvent.target.error}`);
      reject(openCursorErrorEvent.target.error);
    }

    t.onerror = transactionErrorEvent => {
      console.log(`Transaction Error: ${transactionErrorEvent.target.error}`);
      reject(transactionErrorEvent.target.error);
    }
  });
}

export async function getCardsByDeck(deckName) {
  return new Promise((resolve, reject) => {
    const t = db.transaction('CardStore', 'readonly');
    const cardStore = t.objectStore('CardStore');
    const deckNameIndex = cardStore.index('DeckNameIndex');
    const request = deckNameIndex.getAll(deckName);

    request.onsuccess = function() {
      const cards = request.result.map(card => (new Card({...card})));
      resolve(cards);
    };

    request.onerror = event => console.error("Cards not found:", event.target.errorCode);

    t.onerror = transactionErrorEvent => reject(transactionErrorEvent.target.error);
  });
}

export function deleteCardsByDeck(deckName) {
  const t = db.transaction('CardStore', 'readwrite');
  const cardStore = t.objectStore('CardStore');
  const deckNameIndex = cardStore.index('DeckNameIndex');
  const request = deckNameIndex.getAll(deckName);

  request.onsuccess = function() {
    const cards = request.result;
    console.log("Cards retrieved:", cards);

    cards.forEach(card => deleteCard(card.id));
  };

  request.onerror = event => console.error("Cards not found:", event.target.errorCode);
}