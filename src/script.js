const cardContainer = document.querySelector(".card-container");
const prizeInput = document.getElementById("prizeInput");
const addCardBtn = document.getElementById("addCardBtn");
const shuffleCardBtn = document.getElementById("shuffleCardBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");

let prizes = JSON.parse(localStorage.getItem("prizes")) || [];

function createCard(prize, index) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.index = index;

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const serialNumber = document.createElement("div");
  serialNumber.classList.add("serial-number");
  serialNumber.textContent = `标号: ${index + 1}`;

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

  const editButton = document.createElement("button");
  editButton.textContent = "编辑";
  editButton.classList.add("edit-button");
  editButton.onclick = function () {
    toggleEditMode(card, index);
  };
  cardBack.appendChild(editButton);

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  card.addEventListener("click", () => {
    if (!card.hasAttribute("editing")) {
      card.classList.toggle("flipped");
    }
  });

  return card;
}

function addCard() {
  const prizeInputValue = prizeInput.value.trim();
  const cardIndex = prizeInput.dataset.cardIndex;
  console.log(cardIndex, "loh");
  if (prizeInputValue) {
    if (cardIndex) {
      // 更新现有卡片
      const card = cardContainer.children[cardIndex];
      prizes[cardIndex] = prizeInputValue;
      card.querySelector(".prize-text").textContent = prizeInputValue;
      card.removeAttribute("editing");
      addCardBtn.textContent = "添加";
    } else {
      // 添加新卡片
      prizes.push(prizeInputValue);
      const newCard = createCard(prizeInputValue, prizes.length - 1);
      cardContainer.appendChild(newCard);
    }
    prizeInput.value = ""; // 清空输入框
    prizeInput.dataset.cardIndex = ""; // 清除索引
    localStorage.setItem("prizes", JSON.stringify(prizes)); // 更新本地存储
  } else {
    alert("请输入奖品名称");
  }
}

function toggleEditMode(card, index) {
  if (card.hasAttribute("editing")) {
    card.removeAttribute("editing");
    prizeInput.value = ""; // 清空输入框
    prizeInput.dataset.cardIndex = ""; // 清除索引
    addCardBtn.textContent = "添加奖品";
  } else {
    card.setAttribute("editing", true);
    prizeInput.value = card.querySelector(".prize-text").textContent;
    prizeInput.dataset.cardIndex = index;
    prizeInput.style.display = "block"; // 显示输入框
    prizeInput.focus();
    addCardBtn.textContent = "更新奖品";
  }
}

function shuffleCards() {
  cardContainer.querySelectorAll(".card").forEach((card) => {
    card.classList.add("shuffling");
  });

  setTimeout(() => {
    prizes = prizes.sort(() => Math.random() - 0.5);
    cardContainer.innerHTML = "";
    prizes.forEach((prize, index) => {
      const card = createCard(prize, index);
      cardContainer.appendChild(card);
    });
    localStorage.setItem("prizes", JSON.stringify(prizes)); // 更新本地存储
  }, 800);
}

function exportPrizes() {
  const prizesString = JSON.stringify(prizes);
  const blob = new Blob([prizesString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prizes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importPrizes() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedPrizes = JSON.parse(reader.result);
          prizes = importedPrizes;
          cardContainer.innerHTML = "";
          prizes.forEach((prize, index) => {
            const card = createCard(prize, index);
            cardContainer.appendChild(card);
          });
          localStorage.setItem("prizes", JSON.stringify(prizes)); // 更新本地存储
        } catch (error) {
          console.error("导入失败：", error);
          alert("导入失败，请检查文件格式。");
        }
      };
      reader.readAsText(file);
    } else {
      alert("请选择一个文件。");
    }
  });

  input.click();
}

function resetGame() {
  cardContainer.innerHTML = "";
  prizes = [];
  localStorage.removeItem("prizes");
  prizeInput.value = "";
}

// 初始化惩罚列表
const punishmentsContainer = document.getElementById("punishments");
const initialPunishments =
  JSON.parse(localStorage.getItem("punishments")) || [];

function addPunishments() {
  punishmentsContainer.innerHTML = ""; // 清空现有的惩罚列表
  initialPunishments.forEach((punishment) => {
    const punishmentItem = document.createElement("div");
    punishmentItem.className = "punishment-item";
    punishmentItem.textContent = punishment;
    punishmentsContainer.appendChild(punishmentItem);
  });
}

// 添加自定义惩罚
function addCustomPunishment() {
  const customPunishmentInput = document.getElementById(
    "custom-punishment-input"
  );
  const customPunishment = customPunishmentInput.value.trim();
  if (customPunishment) {
    const punishmentItem = document.createElement("div");
    punishmentItem.className = "punishment-item";
    punishmentItem.textContent = customPunishment;
    punishmentsContainer.appendChild(punishmentItem);
    initialPunishments.push(customPunishment); // 将新惩罚添加到数组中
    localStorage.setItem("punishments", JSON.stringify(initialPunishments)); // 更新本地存储
    customPunishmentInput.value = ""; // 清空输入框
  } else {
    alert("请输入惩罚内容");
  }
}

function selectRandomPunishment() {
  var punishments = document.querySelectorAll(".punishment-item");
  var randomIndex = Math.floor(Math.random() * punishments.length);
  var selectedPunishment = punishments[randomIndex].textContent;

  // 将选中的惩罚显示在DOM上
  document.getElementById("selected-punishment").textContent =
    "选中的惩罚是: " + selectedPunishment;
}

function clearPunishment() {
  document.getElementById("selected-punishment").textContent = "";
  punishmentsContainer.innerHTML = "";
  initialPunishments = [];
  localStorage.removeItem("punishments");
}

// 页面加载时初始化惩罚列表
addPunishments();

// 绑定按钮事件
addCardBtn.addEventListener("click", addCard);
shuffleCardBtn.addEventListener("click", shuffleCards);
resetGameBtn.addEventListener("click", resetGame);
loadBtn.addEventListener("click", importPrizes);
saveBtn.addEventListener("click", exportPrizes);
randomBtn.addEventListener("click", selectRandomPunishment);
clearBtn.addEventListener("click", clearPunishment);

// 初始化惩罚
addPunishments();
// 初始化卡片
if (prizes.length > 0) {
  prizes.forEach((prize, index) => {
    const card = createCard(prize, index);
    cardContainer.appendChild(card);
  });
}
