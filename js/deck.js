const params = new URLSearchParams(window.location.search);
const deckName = params.get('deckName');

document.getElementsByTagName('title')[0].innerText = deckName;

const cardFrontInput = document.getElementById('card-front-input');
const cardBackInput = document.getElementById('card-back-input');
const addCardBtn = document.getElementById('add-card-btn');
const cardListBody = document.getElementById('card-list-body');

addCardBtn.addEventListener('click', () => {
  const cardFrontText = cardFrontInput.value;
  const cardBackText = cardBackInput.value;
  cardFrontInput.value = '';
  cardBackInput.value = '';

  const cardFrontDiv = document.createElement('div');
  cardFrontDiv.innerText = cardFrontText;
  const dueDiv = document.createElement('div');
  dueDiv.innerText = 'Due';

  const newCardElement = document.createElement('div');
  newCardElement.classList.add('card');
  newCardElement.setAttribute('data-name', cardFrontText);

  newCardElement.appendChild(cardFrontDiv);
  newCardElement.appendChild(dueDiv);

  cardListBody.appendChild(newCardElement);

  // const tomorrow = new Date();
  // // get PST time
  // tomorrow.setHours(tomorrow.getHours() - 8);
  // // set date to tomorrow and zero out hours, mins, secs, and millisecs
  // tomorrow.setDate(tomorrow.getDate() + 1);
  // tomorrow.setHours(0);
  // tomorrow.setMinutes(0);
  // tomorrow.setSeconds(0);
  // tomorrow.setMilliseconds(0);
});
