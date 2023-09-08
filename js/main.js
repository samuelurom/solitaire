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

/*----- event handlers -----*/
function handleCardDragging(e) {
  draggedCard = e.target;
  sourcePile = draggedCard.parentElement;
}

function handleTableauCardDropping(e) {
  if (draggedCard && draggedCard !== e.target) {
    let destinationPile = e.target.parentElement;
    emptyPileCheck(destinationPile);

    // remove card from source pile
    sourcePile.removeChild(draggedCard);

    const topPosition = calculateTopPosition(destinationPile);

    draggedCard.style.top = `${topPosition}px`;
    draggedCard.style.zIndex = "9999";

    destinationPile.appendChild(draggedCard);

    // reveal top card in source pile
    revealTopCard(sourcePile);
    emptyPileCheck(sourcePile);
  }
}

function handleFoundationCardDropping(e) {
  if (draggedCard) {
    let destinationPile = e.target;

    if (destinationPile.parentElement.className !== "foundation") {
      destinationPile = e.target.parentElement;
    }

    // Reset dragged card positions
    draggedCard.style.top = "0"; // Set top position to 0
    draggedCard.style.zIndex = "1"; // Set zIndex to 1 (or any appropriate value)

    destinationPile.appendChild(draggedCard);

    destinationPile.lastChild.addEventListener("mousedown", handleCardDragging);

    // reveal top card in source pile and check for empty piles
    revealTopCard(sourcePile);
    sourcePile.parentElement.className !== "foundation" &&
      emptyPileCheck(sourcePile);
  }
}

function handleStockDeal(e) {
  sourcePile = e.target.parentElement;
  const topCard = e.target;
  renderWastePile(topCard);

  // delay checking if stockpile is empty
  setTimeout(() => isStockPileEmpty(), 0);
}

function handleRestockWastePile() {
  const stockPile = document.querySelector(".stock-pile");
  const wastePile = document.querySelector(".waste-pile");

  if (stockPile.childNodes.length === 0 && wastePile.childNodes.length !== 0) {
    const wastePileCards = Array.from(wastePile.childNodes);

    wastePileCards.forEach((card) => {
      card.classList.add("back");
      stockPile.appendChild(card);
    });
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
  tableauPiles.forEach((card) =>
    card.addEventListener("mousedown", handleCardDragging)
  );

  tableauPiles.forEach((card) =>
    card.addEventListener("mouseup", handleTableauCardDropping)
  );
}

function renderStockPile(deck) {
  const stockPile = document.querySelector(".stock-pile");

  // Render remaining shuffled deck to stock pile
  shuffledDeck.forEach((card) => {
    const cardHtml = `<div class="card absolute back ${card.face}"></div>`;

    stockPile.innerHTML += cardHtml;
  });
}

function setupFoundationPiles() {
  const foundationPiles = document.querySelectorAll(".foundation .pile");

  // Add event listeners
  foundationPiles.forEach((pile) =>
    pile.addEventListener("mouseup", handleFoundationCardDropping)
  );
}

function renderWastePile(card) {
  // reset card position
  card.style.top = "0";

  const wastePile = document.querySelector(".waste-pile");

  wastePile.appendChild(card);
  revealTopCard(wastePile);

  // add event listener to the top card
  wastePile.lastChild.addEventListener("mousedown", handleCardDragging);
}

function isStockPileEmpty() {
  const stockPile = document.querySelector(".stock-pile");

  if (stockPile.childNodes.length === 0) {
    stockPile.addEventListener("click", handleRestockWastePile);
  }
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

function emptyPileCheck(pile) {
  const cardsInPile = pile.childNodes;
  const cardPlaceholder = pile.querySelector(".card-placeholder");

  if (cardsInPile.length === 0) {
    const cardPlaceholderHtml = '<div class="card-placeholder"></div>';
    pile.innerHTML += cardPlaceholderHtml;
  }

  if (cardsInPile.length === 1 && cardPlaceholder) {
    // confirm that cardPlaceholder exists within the pile then remove it
    pile.removeChild(cardPlaceholder);
  }
}

function initializeGame() {
  dealTableauCards();
  renderStockPile();
  setupFoundationPiles();

  const stockPile = document.querySelectorAll(".stock-pile .card");

  stockPile.forEach((card) => card.addEventListener("click", handleStockDeal));
}

function runTimer() {
  // cimer in ISO format
  const time = new Date(seconds * 1000).toISOString().substring(11, 19);
  seconds++;
  timerPara.innerText = time;
}

/*----- Initialize game -----*/
initializeGame();

/*----- Start timer -----*/
setInterval(runTimer, 1000);
