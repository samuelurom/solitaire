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
const timerPara = document.querySelector(".timer-p");
let seconds = 0;
let draggedCard = null; // hold dragged card
let sourcePile = null; // hold source pile

/*----- event listener functions -----*/
function dragCardOnMouseDown(pile) {
  pile.forEach((card) =>
    card.addEventListener("mousedown", handleCardDragging)
  );
}

function dropCardOnMouseUp(pile) {
  pile.forEach((card) => card.addEventListener("mouseup", handleCardDropping));
}

/*----- event handlers -----*/
function handleCardDragging(e) {
  draggedCard = e.target;
  sourcePile = draggedCard.parentElement;
}

function handleCardDropping(e) {
  if (draggedCard) {
    let destinationPile = e.target.parentElement;

    // remove card from source pile
    sourcePile.removeChild(draggedCard);

    const topPosition = calculateTopPosition(destinationPile);

    draggedCard.style.top = `${topPosition}px`;
    draggedCard.style.zIndex = "9999";

    destinationPile.appendChild(draggedCard);

    // reveal top card in source pile
    revealTopCard(sourcePile);
  }
}

/*----- game functions -----*/
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

      pile.innerHTML += `<div class="card absolute back ${card.face}" style="top: ${topPosition}px; z-index: ${topPosition}"></div>`;

      topPosition += 20;
    }

    // show the topmost card in pile
    revealTopCard(pile);

    cardsToDeal++;
  }

  // Add event listeners
  dragCardOnMouseDown(tableauPiles);
  dropCardOnMouseUp(tableauPiles);
}

function renderStockPile(deck) {
  const stockPile = document.querySelector(".stock-pile");

  // Render remaining shuffled deck to stock pile
  shuffledDeck.forEach((card) => {
    const cardHtml = `<div class="card absolute back ${card.face}"></div>`;

    stockPile.innerHTML += cardHtml;
  });
}

/*----- Helper functions -----*/
function calculateTopPosition(destinationPile) {
  const cardsInPile = destinationPile.childNodes;

  // Set top offset and calculate top position
  const cardTopOffset = 20;
  const topPosition = cardsInPile.length * cardTopOffset;

  return topPosition;
}

function revealTopCard(pile) {
  const topCard = pile.lastChild;
  if (pile.childNodes.length > 0) {
    topCard.classList.contains("back") && topCard.classList.remove("back");
  }
}

function initializeGame() {
  dealTableauCards();
  renderStockPile();
}

function runTimer() {
  const time = new Date(seconds * 1000).toISOString().substring(11, 19);
  seconds++;
  timerPara.innerText = time;
}

/*----- Initialize game -----*/
initializeGame();

/*----- Start timer -----*/
setInterval(runTimer, 1000);
