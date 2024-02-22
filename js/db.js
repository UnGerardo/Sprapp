export let db = null;
export let decks = [];

import Deck from "../models/Deck";
import Card from "../models/Card";
import { renderDecks } from "./script";

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const open = indexedDB.open('DeckDatabase', 1);

open.onerror = function (event) {
  console.log("An error occurred with IndexedDB");
  console.error(event);
}

open.onupgradeneeded = function() {
  db = open.result;
  db.createObjectStore("DeckStore", {keyPath: "name"});
};

open.onsuccess = async function() {
  db = open.result;
  console.log("Database opened.");

  decks = await getDecks();
  renderDecks(decks);
}

export function addDeck(deck) {
  const t = db.transaction(['DeckStore'], 'readwrite');
  t.onerror = tErrorEvent => console.log(`Error: ${tErrorEvent.target.error}`);
  const deckStore = t.objectStore('DeckStore');

  deckStore.add(deck.forDatabase());

  t.oncomplete = function() {
    console.log(`Deck: ${deck.name} added!`);
  }
}

// to update, change deck through its methods, then call this to save to DB
export function updateDeck(deck) {
  const t = db.transaction(['DeckStore'], 'readwrite');
  const deckStore = t.objectStore('DeckStore');
  const getReq = deckStore.get(deck.name);

  getReq.onsuccess = function (event) {
    const updateReq = deckStore.put(deck);
    updateReq.onerror = (event) => console.error(`Error updating record: ${event.target.errorCode}`);
    updateReq.onsuccess = (event) => console.log('Deck updated successfully');
  }

  getReq.onerror = (getReqErrorEvent) => console.log(`getReq Error: ${getReqErrorEvent.target.error}`);
  t.oncomplete = () => console.log(`Deck: ${deck.name} updated!`);
}

export function deleteDeck(deckName) {
  const t = db.transaction(['DeckStore'], 'readwrite');
  const deckStore = t.objectStore('DeckStore');
  const delReq = deckStore.delete(deckName);

  delReq.onsuccess = () => console.log(`Deck: ${deckName} deleted!`);
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
        const currentDeck = {
          name: cursor.value['name'],
          cards: cursor.value['cards'].map(card => new Card(card)),
        }
        decks.push(new Deck(currentDeck));
        cursor.continue();
      } else {
        console.log("Retrieved all decks");
        resolve(decks);
      }
    }

    openCursor.onerror = openCursorErrorEvent => {
      console.log(`openCursor Error: ${openCursorErrorEvent.target.error}`);
      reject(openCursorErrorEvent.target.error);
    }

    transaction.onerror = transactionErrorEvent => {
      console.log(`Transaction Error: ${transactionErrorEvent.target.error}`);
      reject(transactionErrorEvent.target.error);
    }
  });
}