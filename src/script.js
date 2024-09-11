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
    cards = Array(bombCount).fill("0").concat(Array(treasureCount).fill("1"));
    shuffle(cards);
    ensureWinningCondition();
  }

  function ensureWinningCondition() {
    const winningPattern =
      winPatterns[Math.floor(Math.random() * winPatterns.length)];
    winningPattern.forEach((index) => {
      cards[index] = "1";
    });
  }

  function readImage() {
    const uploadedImage = document.getElementById("image-upload").files[0];
    let image;
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onload = function (e) {
        console.log(e.target.result, "log");
        image = e.target.result; // 使用上传的图片填充宝藏卡片
      };
      reader.readAsDataURL(uploadedImage);
    }
    return image;
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

      // 读取上传的图片并设置为卡片背面的图片
      const uploadedImageBomb =
        document.getElementById("image-upload-bomb").files[0];
      const uploadedImageReward = document.getElementById("image-upload-reward")
        .files[0];

      if (card === "1" && uploadedImageReward) {
        const reader = new FileReader();
        reader.onload = function (e) {
          cardBack.style.backgroundImage = `url(${e.target.result})`;
          cardBack.style.backgroundSize = "cover";
        };
        reader.readAsDataURL(uploadedImage);
      } else if (card === "1" && uploadedImageBomb) {
        const reader = new FileReader();
        reader.onload = function (e) {
          cardBack.style.backgroundImage = `url(${e.target.result})`;
          cardBack.style.backgroundSize = "cover";
        };
        reader.readAsDataURL(uploadedImage);
      } else {
        cardBack.textContent = card === "1" ? "🎁" : "💣";
      }

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
    const cardBack = cardElement.querySelector(".card-back");

    if (cards[index] === "0") {
      cardBack.classList.add("bomb");
      const uploadedImage =
        document.getElementById("image-upload-bomb").files[0];
      if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
          cardBack.style.backgroundImage = `url(${e.target.result})`;
          cardBack.style.backgroundSize = "cover";
        };
        reader.readAsDataURL(uploadedImage);
      }
    } else if (cards[index] === "1") {
      flippedTreasureIndices.push(index);
      checkWinCondition();
      // 如果是宝藏卡片，显示上传的图片
      const uploadedImage = document.getElementById("image-upload-reward")
        .files[0];
      if (uploadedImage) {
        const reader = new FileReader();
        reader.onload = function (e) {
          cardBack.style.backgroundImage = `url(${e.target.result})`;
          cardBack.style.backgroundSize = "cover";
        };
        reader.readAsDataURL(uploadedImage);
      }
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
