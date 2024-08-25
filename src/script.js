// script.js
document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector(".grid-container");
    const resetButton = document.getElementById("reset-button");
    const stepCounter = document.getElementById("step-counter");
    const gridSize = 4;
    const totalCards = gridSize * gridSize;
    const bombCount = 8;
    const treasureCount = 8;
    let cards = [];
    let flippedTreasureIndices = [];
    let steps = 0;
  
    const winPatterns = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15], // 横排
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15], // 竖排
      [0, 5, 10, 15],
      [3, 6, 9, 12], // 斜排
    ];
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    function generateCards() {
      cards = Array(bombCount).fill("💣").concat(Array(treasureCount).fill("💎"));
      shuffle(cards);
      ensureWinningCondition();
    }
  
    function ensureWinningCondition() {
      const winningPattern =
        winPatterns[Math.floor(Math.random() * winPatterns.length)];
      winningPattern.forEach((index) => {
        cards[index] = "💎";
      });
    }
  
    function createGrid() {
      gridContainer.innerHTML = "";
      cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.dataset.index = index;
  
        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");
  
        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
  
        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");
        cardBack.textContent = card;
  
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
  
        cardElement.addEventListener("click", () => flipCard(cardElement, index));
        gridContainer.appendChild(cardElement);
      });
    }
  
    function flipCard(cardElement, index) {
      if (cardElement.classList.contains("flipped")) return;
  
      cardElement.classList.add("flipped");
      cardElement.querySelector(".card-back").textContent = cards[index];
  
      // 记录步数
      steps++;
      stepCounter.textContent = `步数: ${steps}`;
  
      if (cards[index] === "💣") {
        cardElement.classList.add("bomb");
      } else if (cards[index] === "💎") {
        flippedTreasureIndices.push(index);
        checkWinCondition();
      }
    }
  
    function checkWinCondition() {
      for (let pattern of winPatterns) {
        if (pattern.every((index) => flippedTreasureIndices.includes(index))) {
          setTimeout(() => alert(`恭喜你通关了！总步数: ${steps}`), 100);
          return;
        }
      }
    }
  
    function resetGame() {
      flippedTreasureIndices = [];
      steps = 0;
      stepCounter.textContent = `步数: ${steps}`;
      generateCards();
      createGrid();
    }
  
    resetButton.addEventListener("click", resetGame);
  
    // 初始化游戏
    resetGame();
  });
  