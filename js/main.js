/*----- constants -----*/
const suits = ["s", "c", "d", "h"];
const ranks = [
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// Build an 'original' deck of 'card' objects used to create shuffled decks
const originalDeck = buildOriginalDeck();

/*----- app's state (variables) -----*/
let shuffledDeck = getNewShuffledDeck();

/*----- event listeners -----*/

/*----- functions -----*/
function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}

function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function dealTableauCards() {
  const tableauPiles = document.querySelectorAll(".tableau .pile");

  // Deal cards to tableau piles
  let cardsToDeal = 1;

  for (pile of tableauPiles) {
    // Initialize card's top position to 0
    let topPosition = 0;

    for (let cardIdx = 0; cardIdx < cardsToDeal; cardIdx++) {
      let card = shuffledDeck.pop();
      if (cardIdx !== cardsToDeal - 1) {
        card.face = "back";
      }
      renderCardInPile(card, pile, topPosition);

      topPosition += 20;
    }
    cardsToDeal++;
  }
}

function renderCardInPile(card, pile, topPosition) {
  const cardHtml = `<div class="card absolute ${card.face}" style="top: ${topPosition}px; z-index: ${topPosition};"></div>`;
  pile.innerHTML += cardHtml;
}

function renderStockPile(deck) {
  let stockPile = document.querySelector(".stock-pile");

  // Render remaining shuffled deck to stock pile
  shuffledDeck.forEach((card) => {
    card.face = "back";

    const cardHtml = `<div class="card absolute ${card.face}"></div>`;

    stockPile.innerHTML += cardHtml;
  });
}

function initializeGame() {
  dealTableauCards();
  renderStockPile();
}

// Initialize Game
initializeGame();
