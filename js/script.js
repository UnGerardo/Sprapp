const addDeckInput = document.getElementById('add-deck-input');
const addDeckBtn = document.getElementById('add-deck-btn');
const deckListBody = document.getElementById('deck-list-body');

addDeckBtn.addEventListener('click', () => {
  const newDeckName = addDeckInput.value;
  addDeckInput.value = '';

  const newDeckElement = document.createElement('a');
  newDeckElement.classList.add('deck');
  newDeckElement.setAttribute('data-name', newDeckName);
  newDeckElement.setAttribute('href', `deck.html?deckName=${newDeckName}`);

  const deckNameDiv = document.createElement('div');
  deckNameDiv.innerText = newDeckName;
  const deckCardsDueDiv = document.createElement('div');
  deckCardsDueDiv.innerText = '0';
  const deckTotalCardsDiv = document.createElement('div');
  deckTotalCardsDiv.innerText = '0';

  newDeckElement.appendChild(deckNameDiv);
  newDeckElement.appendChild(deckCardsDueDiv);
  newDeckElement.appendChild(deckTotalCardsDiv);
  deckListBody.appendChild(newDeckElement);
});