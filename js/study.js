const params = new URLSearchParams(window.location.search);
const DECK_NAME = params.get('deckName');

const cardsLeftSpan = document.getElementById('cards-left');
const cardFront = document.getElementById('card-front');
const revealBack = document.getElementById('reveal-back');
const cardBack = document.getElementById('card-back');
const ratingBtns = document.getElementsByClassName('rating-btn');

if (window.location.href.includes('study.html')) {
  document.getElementsByTagName('title')[0].innerText = `Study ${DECK_NAME}`;
}

export function renderStudyPage(cards) {
  const cardsDue = cards.filter(card => card.date < new Date());
  cardsLeftSpan.innerText = cardsDue.length;

  cardFront.innerText = cardsDue[0].front;

  revealBack.addEventListener('click', () => {
    cardBack.innerText = cardsDue[0].back;
  });

  for (const ratingBtn of ratingBtns) {
    ratingBtn.addEventListener('click', function () {
      const rating = this.getAttribute('data-rating');
      const card = cardsDue[0];
      card.updateCard(rating);

      cardsDue.shift();
      if (cardsDue.length === 0) {
        window.location.assign('index.html');
        return;
      }

      cardFront.innerText = cardsDue[0].front;
      cardBack.innerText = '';
      cardsLeftSpan.innerText = parseInt(cardsLeftSpan.innerText) - 1;
    });
  }
}
