const cardContainer = document.querySelector(".card-container");
const prizeInput = document.getElementById("prizeInput");
const addCardBtn = document.getElementById("addCardBtn");
const shuffleCardBtn = document.getElementById("shuffleCardBtn");
const resetGameBtn = document.getElementById("resetGameBtn");

let prizes = [
  "奖品1",
  "奖品2",
  "奖品3",
  "奖品4",
  "奖品5",
  "奖品6",
  "奖品1",
  "奖品2",
  "奖品3",
  "奖品4",
  "奖品5",
  "奖品6",
  "奖品1",
  "奖品2",
  "奖品3",
  "奖品4",
  "奖品5",
  "奖品6",
  "奖品1",
  "奖品2",
  "奖品3",
  "奖品4",
  "奖品5",
  "奖品6",
];

function createCard(prize, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  // 添加标号
  const serialNumber = document.createElement("div");
  serialNumber.classList.add("serial-number");
  serialNumber.textContent = `标号: ${index + 1}`;

  // 添加图片
  const cardImage = document.createElement("img");
  cardImage.classList.add("card-image");
  cardImage.src = "./images/card.jpg"; // 替换为你的图片路径

  cardFront.appendChild(serialNumber);
  cardFront.appendChild(cardImage);

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");
  const prizeText = document.createElement("div");
  prizeText.classList.add("prize-text");
  prizeText.textContent = prize;
  cardBack.appendChild(prizeText);

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  return card;
}

function addCard() {
  const prizeInputValue = prizeInput.value.trim();
  if (prizeInputValue) {
    prizes.push(prizeInputValue);
    const newCard = createCard(prizeInputValue, prizes.length - 1);
    cardContainer.appendChild(newCard);
    prizeInput.value = "";
  } else {
    alert("请输入奖品名称");
  }
}

function shuffleCards() {
  prizes = prizes.sort(() => Math.random() - 0.5);
  cardContainer.innerHTML = "";
  prizes.forEach((prize, index) => {
    const card = createCard(prize, index);
    cardContainer.appendChild(card);
  });
}

addCardBtn.addEventListener("click", addCard);
shuffleCardBtn.addEventListener("click", shuffleCards);

// 初始化卡片
prizes.forEach((prize, index) => {
  const card = createCard(prize, index);
  cardContainer.appendChild(card);
});
