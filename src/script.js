const cardContainer = document.querySelector(".card-container");
const prizeInput = document.getElementById("prizeInput");
const addCardBtn = document.getElementById("addCardBtn");
const shuffleCardBtn = document.getElementById("shuffleCardBtn");
const resetGameBtn = document.getElementById("resetGameBtn");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");
const savePunishmentBtn = document.getElementById("savePunishmentBtn");
const loadPunishmentBtn = document.getElementById("loadPunishmentBtn");

// Tab 切换功能
document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // 移除所有活动状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 添加活动状态到当前tab
      this.classList.add('active');
      document.getElementById(`${targetTab}-section`).classList.add('active');
    });
  });
});

// 刮刮乐模态框功能
let currentScratchPrize = '';

// 获取模态框元素
let modal, closeBtn, canvas, ctx, modalPrizeName, modalPrizeImage, prizePlaceholder;

// 初始化刮刮乐元素
function initScratchElements() {
  modal = document.getElementById('scratchModal');
  closeBtn = document.querySelector('.close');
  canvas = document.getElementById('scratchCanvas');
  ctx = canvas.getContext('2d');
  modalPrizeName = document.getElementById('modalPrizeName');
  modalPrizeImage = document.getElementById('prizeImg');
  prizePlaceholder = document.querySelector('.prize-placeholder');
}

// 刮刮乐功能
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function openScratchModal(prize, cardElement) {
  initScratchElements();
  currentScratchPrize = prize;
  currentCard = cardElement; // 保存当前卡片引用
  modal.style.display = 'block';
  modalPrizeName.textContent = '刮开查看奖品';
  modalPrizeImage.style.display = 'none';
  prizePlaceholder.style.display = 'block';
  
  // 设置canvas尺寸
  canvas.width = 300;
  canvas.height = 200;
  
  // 绘制刮刮乐涂层
  drawScratchLayer();
  
  // 添加事件监听器
  addCanvasEventListeners();
}

function closeScratchModal() {
  if (modal) {
    modal.style.display = 'none';
    removeCanvasEventListeners();
    
    // 重置canvas显示
    if (canvas) {
      canvas.style.display = 'block';
    }
    
    // 标记当前卡片为已刮过并刷新显示
    if (currentCard && !currentCard.classList.contains('scratched')) {
      currentCard.classList.add('scratched');
      
      // 保存刮奖状态
      const index = parseInt(currentCard.dataset.index);
      let scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
      if (!scratchedCards.includes(index)) {
        scratchedCards.push(index);
        localStorage.setItem('scratchedCards', JSON.stringify(scratchedCards));
      }
      
      // 刷新卡片显示
      const prizeImageUrl = prizeImages[index];
      const cardFront = currentCard.querySelector('.card-front');
      if (cardFront) {
        cardFront.innerHTML = '';
        
        // 创建奖品展示容器
        const prizeContainer = document.createElement('div');
        prizeContainer.style.display = 'flex';
        prizeContainer.style.flexDirection = 'column';
        prizeContainer.style.alignItems = 'center';
        prizeContainer.style.justifyContent = 'center';
        prizeContainer.style.height = '100%';
        prizeContainer.style.padding = '5px';
        prizeContainer.style.textAlign = 'center';
        prizeContainer.style.gap = '5px';

        // 图片区域
        const imageContainer = document.createElement('div');
        imageContainer.style.width = '100%';
        imageContainer.style.height = '80px';
        imageContainer.style.display = 'flex';
        imageContainer.style.alignItems = 'center';
        imageContainer.style.justifyContent = 'center';

        if (prizeImageUrl) {
          const img = document.createElement('img');
          img.src = prizeImageUrl;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '70px';
          img.style.borderRadius = '8px';
          img.style.objectFit = 'cover';
          imageContainer.appendChild(img);
        } else {
          const iconContainer = document.createElement('div');
          iconContainer.style.fontSize = '35px';
          iconContainer.style.color = '#f789b7';
          iconContainer.textContent = '🎁';
          imageContainer.appendChild(iconContainer);
        }

        // 奖品文字
        const textContainer = document.createElement('div');
        textContainer.style.width = '100%';
        textContainer.style.padding = '0 5px';

        const prizeText = document.createElement('div');
        prizeText.textContent = prizes[index];
        prizeText.style.fontSize = '12px';
        prizeText.style.fontWeight = 'bold';
        prizeText.style.color = '#f789b7';
        prizeText.style.textAlign = 'center';
        prizeText.style.lineHeight = '1.2';
        prizeText.style.wordBreak = 'break-word';
        textContainer.appendChild(prizeText);

        prizeContainer.appendChild(imageContainer);
        prizeContainer.appendChild(textContainer);
        cardFront.appendChild(prizeContainer);
      }
    }
    
    currentCard = null;
  }
}

function drawScratchLayer() {
  if (!ctx) return;
  
  // 绘制金色涂层背景
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 添加金属质感纹理
  ctx.fillStyle = '#FFA500';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 3, 3);
  }
  
  // 添加刮刮乐边框
  ctx.strokeStyle = '#FF8C00';
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  
  // 仅显示刮奖提示，奖品文字将在下方显示
  ctx.fillStyle = '#8B4513';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 添加阴影效果
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillText('刮开有奖', canvas.width/2, canvas.height/2 - 20);
  ctx.font = '14px Arial';
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 重置阴影
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function scratch(x, y) {
  if (!ctx) return;
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2); // 增大笔刷半径到25px
  ctx.fill();
  
  // 检查刮开的百分比
  checkScratchPercentage();
}

function checkScratchPercentage() {
  if (!ctx) return;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;
  const totalPixels = pixels.length / 4;
  
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparentPixels++;
    }
  }
  
  const percentage = (transparentPixels / totalPixels) * 100;
  
  if (percentage > 30) { // 调整为30%阈值
    revealPrize();
  }
}

function revealPrize() {
  if (!modalPrizeName || !currentCard) return;
  
  // 标记为已刮过，正面显示奖品内容
  currentCard.classList.add('scratched');
  
  // 更新卡片正面显示奖品内容
  const cardFront = currentCard.querySelector('.card-front');
  const prizeText = currentCard.querySelector('.prize-text');
  
  if (cardFront && prizeText) {
    // 清除卡片正面的内容
    cardFront.innerHTML = '';
    
    // 创建奖品展示元素
    const prizeDisplay = document.createElement('div');
    prizeDisplay.style.display = 'flex';
    prizeDisplay.style.flexDirection = 'column';
    prizeDisplay.style.alignItems = 'center';
    prizeDisplay.style.justifyContent = 'center';
    prizeDisplay.style.height = '100%';
    prizeDisplay.style.padding = '10px';
    prizeDisplay.style.textAlign = 'center';
    
    const prizeContent = document.createElement('div');
    prizeContent.textContent = currentScratchPrize;
    prizeContent.style.fontSize = '16px';
    prizeContent.style.fontWeight = 'bold';
    prizeContent.style.color = '#f789b7';
    prizeContent.style.marginTop = '10px';
    
    // 添加奖品图标
    const prizeIcon = document.createElement('div');
    prizeIcon.textContent = '🎁';
    prizeIcon.style.fontSize = '40px';
    prizeIcon.style.marginBottom = '10px';
    
    prizeDisplay.appendChild(prizeIcon);
    prizeDisplay.appendChild(prizeContent);
    cardFront.appendChild(prizeDisplay);
  }
  
  // 保存刮奖状态到本地存储
  const index = parseInt(currentCard.dataset.index);
  let scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
  if (!scratchedCards.includes(index)) {
    scratchedCards.push(index);
    localStorage.setItem('scratchedCards', JSON.stringify(scratchedCards));
  }
  
  // 在模态框中显示奖品
  modalPrizeName.textContent = currentScratchPrize;
  modalPrizeName.style.fontSize = '28px';
  modalPrizeName.style.color = '#f789b7';
  modalPrizeName.style.fontWeight = 'bold';
  modalPrizeName.style.textShadow = '2px 2px 4px rgba(247, 137, 183, 0.3)';
  
  // 隐藏刮刮乐区域，显示奖品
  if (canvas) canvas.style.display = 'none';
  
  // 显示奖品图片（如果有的话）
  const cardIndex = parseInt(currentCard.dataset.index);
  const prizeImageUrl = prizeImages[cardIndex];
  if (prizeImageUrl && modalPrizeImage) {
    modalPrizeImage.src = prizeImageUrl;
    modalPrizeImage.style.display = 'block';
    modalPrizeImage.style.animation = 'prizeReveal 0.5s ease';
    if (prizePlaceholder) prizePlaceholder.style.display = 'none';
  } else {
    if (modalPrizeImage) modalPrizeImage.style.display = 'none';
    if (prizePlaceholder) {
      prizePlaceholder.style.display = 'block';
      prizePlaceholder.style.fontSize = '80px';
      prizePlaceholder.style.animation = 'prizeReveal 0.5s ease';
    }
  }
  
  // 添加庆祝动画并更新显示
  setTimeout(() => {
    if (modalPrizeName) {
      modalPrizeName.textContent = currentScratchPrize;
      modalPrizeName.style.transform = 'scale(1.1)';
      setTimeout(() => {
        if (modalPrizeName) modalPrizeName.style.transform = 'scale(1)';
      }, 200);
    }
  }, 100);

  // 标记为已刮过并刷新卡片显示
  if (currentCard) {
    currentCard.classList.add('scratched');

    // 保存刮奖状态
    const index = parseInt(currentCard.dataset.index);
    let scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
    if (!scratchedCards.includes(index)) {
      scratchedCards.push(index);
      localStorage.setItem('scratchedCards', JSON.stringify(scratchedCards));
    }

    // 刷新卡片显示
    const prizeImageUrl = prizeImages[index];
    const cardFront = currentCard.querySelector('.card-front');
    if (cardFront) {
      cardFront.innerHTML = '';

      // 创建奖品展示容器
      const prizeContainer = document.createElement('div');
      prizeContainer.style.display = 'flex';
      prizeContainer.style.flexDirection = 'column';
      prizeContainer.style.alignItems = 'center';
      prizeContainer.style.justifyContent = 'center';
      prizeContainer.style.height = '100%';
      prizeContainer.style.padding = '5px';
      prizeContainer.style.textAlign = 'center';
      prizeContainer.style.gap = '5px';

      // 图片区域
      const imageContainer = document.createElement('div');
      imageContainer.style.width = '100%';
      imageContainer.style.height = '80px';
      imageContainer.style.display = 'flex';
      imageContainer.style.alignItems = 'center';
      imageContainer.style.justifyContent = 'center';

      if (prizeImageUrl) {
        const img = document.createElement('img');
        img.src = prizeImageUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70px';
        img.style.borderRadius = '8px';
        img.style.objectFit = 'cover';
        imageContainer.appendChild(img);
      } else {
        const iconContainer = document.createElement('div');
        iconContainer.style.fontSize = '35px';
        iconContainer.style.color = '#f789b7';
        iconContainer.textContent = '🎁';
        imageContainer.appendChild(iconContainer);
      }

      // 奖品文字
      const textContainer = document.createElement('div');
      textContainer.style.width = '100%';
      textContainer.style.padding = '0 5px';

      const prizeText = document.createElement('div');
      prizeText.textContent = prizes[index];
      prizeText.style.fontSize = '12px';
      prizeText.style.fontWeight = 'bold';
      prizeText.style.color = '#f789b7';
      prizeText.style.textAlign = 'center';
      prizeText.style.lineHeight = '1.2';
      prizeText.style.wordBreak = 'break-word';
      textContainer.appendChild(prizeText);

      prizeContainer.appendChild(imageContainer);
      prizeContainer.appendChild(textContainer);
      cardFront.appendChild(prizeContainer);
    }
  }
}

function getPrizeImage(prize) {
  // 这里可以根据奖品名称返回对应的图片URL
  // 暂时返回默认图片
  return './images/card.jpg';
}

function addCanvasEventListeners() {
  if (!canvas) return;
  
  // 鼠标事件
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  
  // 触摸事件
  canvas.addEventListener('touchstart', handleTouch);
  canvas.addEventListener('touchmove', handleTouch);
  canvas.addEventListener('touchend', stopDrawing);
}

function removeCanvasEventListeners() {
  if (!canvas) return;
  
  canvas.removeEventListener('mousedown', startDrawing);
  canvas.removeEventListener('mousemove', draw);
  canvas.removeEventListener('mouseup', stopDrawing);
  canvas.removeEventListener('mouseleave', stopDrawing);
  canvas.removeEventListener('touchstart', handleTouch);
  canvas.removeEventListener('touchmove', handleTouch);
  canvas.removeEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
  if (!canvas) return;
  
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
}

function draw(e) {
  if (!isDrawing || !canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  scratch(x, y);
  
  lastX = x;
  lastY = y;
}

function handleTouch(e) {
  if (!canvas) return;
  
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  if (e.type === 'touchstart') {
    isDrawing = true;
    lastX = x;
    lastY = y;
  } else if (e.type === 'touchmove' && isDrawing) {
    scratch(x, y);
    lastX = x;
    lastY = y;
  }
}

function stopDrawing() {
  isDrawing = false;
}

// 修改卡片点击事件
function createCard(prize, index) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.index = index;

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  // 检查是否已刮过
  const scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
  const isScratched = scratchedCards.includes(index);
  const prizeImageUrl = prizeImages[index];

  if (isScratched) {
    // 已刮过的卡片显示奖品内容
    card.classList.add('scratched');
    
    // 创建奖品展示容器
    const prizeContainer = document.createElement('div');
    prizeContainer.style.display = 'flex';
    prizeContainer.style.flexDirection = 'column';
    prizeContainer.style.alignItems = 'center';
    prizeContainer.style.justifyContent = 'center';
    prizeContainer.style.height = '100%';
    prizeContainer.style.padding = '5px';
    prizeContainer.style.textAlign = 'center';
    prizeContainer.style.gap = '5px';

    // 图片区域
    const imageContainer = document.createElement('div');
    imageContainer.style.width = '100%';
    imageContainer.style.height = '80px';
    imageContainer.style.display = 'flex';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';

    if (prizeImageUrl) {
      const img = document.createElement('img');
      img.src = prizeImageUrl;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '70px';
      img.style.borderRadius = '8px';
      img.style.objectFit = 'cover';
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      imageContainer.appendChild(img);
    } else {
      const iconContainer = document.createElement('div');
      iconContainer.style.fontSize = '35px';
      iconContainer.style.color = '#f789b7';
      iconContainer.textContent = '🎁';
      imageContainer.appendChild(iconContainer);
    }

    // 奖品文字
    const textContainer = document.createElement('div');
    textContainer.style.width = '100%';
    textContainer.style.padding = '0 5px';

    const prizeText = document.createElement('div');
    prizeText.textContent = prize;
    prizeText.style.fontSize = '12px';
    prizeText.style.fontWeight = 'bold';
    prizeText.style.color = '#f789b7';
    prizeText.style.textAlign = 'center';
    prizeText.style.lineHeight = '1.2';
    prizeText.style.wordBreak = 'break-word';
    prizeText.style.maxHeight = '40px';
    prizeText.style.overflow = 'hidden';

    textContainer.appendChild(prizeText);

    prizeContainer.appendChild(imageContainer);
    prizeContainer.appendChild(textContainer);
    cardFront.appendChild(prizeContainer);
  } else {
    // 未刮过的卡片显示默认内容
    const serialNumber = document.createElement("div");
    serialNumber.classList.add("serial-number");
    serialNumber.textContent = `标号: ${index + 1}`;

    const cardImage = document.createElement("img");
    cardImage.classList.add("card-image");
    cardImage.src = "./images/card.jpg";

    cardFront.appendChild(serialNumber);
    cardFront.appendChild(cardImage);
  }

  // 卡片背面（用于编辑模式）
  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  const prizeText = document.createElement("div");
  prizeText.classList.add("prize-text");
  prizeText.textContent = prize;
  cardBack.appendChild(prizeText);

  const editButton = document.createElement("button");
  editButton.textContent = "编辑";
  editButton.classList.add("edit-button");
  editButton.onclick = function (e) {
    e.stopPropagation();
    toggleEditMode(card, index);
  };
  cardBack.appendChild(editButton);

  card.appendChild(cardFront);
  card.appendChild(cardBack);

  // 修改点击事件，支持编辑模式
  card.addEventListener("click", () => {
    if (isEditMode) {
      // 编辑模式下直接翻转显示奖品
      if (!card.classList.contains('scratched')) {
        card.classList.add('scratched');
        
        // 保存刮奖状态
        const index = parseInt(card.dataset.index);
        let scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
        if (!scratchedCards.includes(index)) {
          scratchedCards.push(index);
          localStorage.setItem('scratchedCards', JSON.stringify(scratchedCards));
        }
        
        // 刷新卡片显示
        const prizeImageUrl = prizeImages[index];
        const cardFront = card.querySelector('.card-front');
        if (cardFront) {
          cardFront.innerHTML = '';
          
          // 创建奖品展示容器
          const prizeContainer = document.createElement('div');
          prizeContainer.style.display = 'flex';
          prizeContainer.style.flexDirection = 'column';
          prizeContainer.style.alignItems = 'center';
          prizeContainer.style.justifyContent = 'center';
          prizeContainer.style.height = '100%';
          prizeContainer.style.padding = '5px';
          prizeContainer.style.textAlign = 'center';
          prizeContainer.style.gap = '5px';

          // 图片区域
          const imageContainer = document.createElement('div');
          imageContainer.style.width = '100%';
          imageContainer.style.height = '80px';
          imageContainer.style.display = 'flex';
          imageContainer.style.alignItems = 'center';
          imageContainer.style.justifyContent = 'center';

          if (prizeImageUrl) {
            const img = document.createElement('img');
            img.src = prizeImageUrl;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '70px';
            img.style.borderRadius = '8px';
            img.style.objectFit = 'cover';
            imageContainer.appendChild(img);
          } else {
            const iconContainer = document.createElement('div');
            iconContainer.style.fontSize = '35px';
            iconContainer.style.color = '#f789b7';
            iconContainer.textContent = '🎁';
            imageContainer.appendChild(iconContainer);
          }

          // 奖品文字
          const textContainer = document.createElement('div');
          textContainer.style.width = '100%';
          textContainer.style.padding = '0 5px';

          const prizeText = document.createElement('div');
          prizeText.textContent = prize;
          prizeText.style.fontSize = '12px';
          prizeText.style.fontWeight = 'bold';
          prizeText.style.color = '#f789b7';
          prizeText.style.textAlign = 'center';
          prizeText.style.lineHeight = '1.2';
          prizeText.style.wordBreak = 'break-word';
          textContainer.appendChild(prizeText);

          prizeContainer.appendChild(imageContainer);
          prizeContainer.appendChild(textContainer);
          cardFront.appendChild(prizeContainer);
        }
      } else {
        // 已刮过的卡片可以编辑
        toggleEditMode(card, parseInt(card.dataset.index));
      }
    } else {
      // 非编辑模式：正常刮奖
      if (!card.classList.contains('scratched')) {
        openScratchModal(prize, card);
      }
    }
  });

  return card;
}

// 模态框事件监听
document.addEventListener('DOMContentLoaded', function() {
  // 初始化刮刮乐元素
  initScratchElements();
  
  // 关闭按钮事件（仅支持点击关闭按钮关闭）
  if (closeBtn) {
    closeBtn.addEventListener('click', closeScratchModal);
  }
  
  // 移除点击模态框外部关闭的功能
  // 不再监听外部点击事件
  
  // ESC键关闭（可选，保持支持）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      closeScratchModal();
    }
  });
  
  // 初始化页面
  loadInitialData();
});

// 加载初始数据
function loadInitialData() {
  // 加载保存的奖品
  prizes = JSON.parse(localStorage.getItem("prizes")) || [];
  const scratchedCards = JSON.parse(localStorage.getItem('scratchedCards')) || [];
  
  // 渲染卡片
  cardContainer.innerHTML = "";
  prizes.forEach((prize, index) => {
    const card = createCard(prize, index);
    if (scratchedCards.includes(index)) {
      card.classList.add('scratched');
      // 更新已刮过的卡片显示奖品内容
  const cardFront = card.querySelector('.card-front');
  const prizeImageUrl = prizeImages[index];
  
  if (cardFront) {
    cardFront.innerHTML = '';
    
    // 创建奖品展示容器
    const prizeContainer = document.createElement('div');
    prizeContainer.className = 'prize-container';
    prizeContainer.style.display = 'flex';
    prizeContainer.style.flexDirection = 'column';
    prizeContainer.style.alignItems = 'center';
    prizeContainer.style.justifyContent = 'center';
    prizeContainer.style.height = '100%';
    prizeContainer.style.padding = '5px';
    prizeContainer.style.textAlign = 'center';
    prizeContainer.style.gap = '5px';
    
    // 图片区域
    const imageContainer = document.createElement('div');
    imageContainer.style.width = '100%';
    imageContainer.style.height = '80px';
    imageContainer.style.display = 'flex';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';
    
    if (prizeImageUrl) {
      // 显示用户上传的图片
      const img = document.createElement('img');
      img.src = prizeImageUrl;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '70px';
      img.style.borderRadius = '8px';
      img.style.objectFit = 'cover';
      img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      imageContainer.appendChild(img);
    } else {
      // 显示兜底图标
      const iconContainer = document.createElement('div');
      iconContainer.style.fontSize = '35px';
      iconContainer.style.color = '#f789b7';
      iconContainer.textContent = '🎁';
      imageContainer.appendChild(iconContainer);
    }
    
    // 奖品文字区域
    const textContainer = document.createElement('div');
    textContainer.style.width = '100%';
    textContainer.style.padding = '0 5px';
    
    const prizeText = document.createElement('div');
    prizeText.textContent = prize;
    prizeText.style.fontSize = '12px';
    prizeText.style.fontWeight = 'bold';
    prizeText.style.color = '#f789b7';
    prizeText.style.textAlign = 'center';
    prizeText.style.lineHeight = '1.2';
    prizeText.style.wordBreak = 'break-word';
    prizeText.style.maxHeight = '40px';
    prizeText.style.overflow = 'hidden';
    prizeText.style.textOverflow = 'ellipsis';
    prizeText.style.display = '-webkit-box';
    prizeText.style.webkitLineClamp = '2';
    prizeText.style.webkitBoxOrient = 'vertical';
    
    textContainer.appendChild(prizeText);
    
    prizeContainer.appendChild(imageContainer);
    prizeContainer.appendChild(textContainer);
    cardFront.appendChild(prizeContainer);
  }
    }
    cardContainer.appendChild(card);
  });
  
  // 初始化惩罚列表
  addPunishments();
}

function addCard() {
  const prizeInputValue = prizeInput.value.trim();
  const cardIndex = prizeInput.dataset.cardIndex;
  
  if (prizeInputValue) {
    let imageUrl = null;
    
    // 处理图片上传
    if (currentImageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl = e.target.result;
        completeAddCard(prizeInputValue, cardIndex, imageUrl);
      };
      reader.readAsDataURL(currentImageFile);
    } else {
      completeAddCard(prizeInputValue, cardIndex, null);
    }
  } else {
    alert("请输入奖品名称");
  }
}

function completeAddCard(prizeInputValue, cardIndex, imageUrl) {
  if (cardIndex) {
    // 更新现有卡片
    const card = cardContainer.children[cardIndex];
    prizes[cardIndex] = prizeInputValue;
    
    // 更新奖品图片
    if (imageUrl) {
      prizeImages[cardIndex] = imageUrl;
    }
    
    // 立即刷新卡片显示
    if (parseInt(cardIndex) < cardContainer.children.length) {
      const newCard = createCard(prizeInputValue, parseInt(cardIndex));
      cardContainer.replaceChild(newCard, cardContainer.children[parseInt(cardIndex)]);
    } else {
      // 如果卡片不存在，重新创建
      const newCard = createCard(prizeInputValue, parseInt(cardIndex));
      cardContainer.appendChild(newCard);
    }
    
    card.removeAttribute("editing");
    addCardBtn.textContent = "添加奖品";
  } else {
    // 添加新卡片
    prizes.push(prizeInputValue);
    if (imageUrl) {
      prizeImages[prizes.length - 1] = imageUrl;
    }
    
    const newCard = createCard(prizeInputValue, prizes.length - 1);
    cardContainer.appendChild(newCard);
  }
  
  // 重置输入
  prizeInput.value = "";
  prizeInput.dataset.cardIndex = "";
  currentImageFile = null;
  previewImg.src = '';
  imagePreview.style.display = 'none';
  
  // 保存到本地存储
  localStorage.setItem("prizes", JSON.stringify(prizes));
  localStorage.setItem("prizeImages", JSON.stringify(prizeImages));
}

function toggleEditMode(card, index) {
  if (card.hasAttribute("editing")) {
    card.removeAttribute("editing");
    prizeInput.value = "";
    prizeInput.dataset.cardIndex = "";
    addCardBtn.textContent = "添加奖品";
  } else {
    // 获取当前奖品内容
    const currentPrize = prizes[index] || '';
    
    card.setAttribute("editing", true);
    prizeInput.value = currentPrize;
    prizeInput.dataset.cardIndex = index;
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
    
    // 洗牌后重置所有刮奖状态
    localStorage.removeItem('scratchedCards');
    
    prizes.forEach((prize, index) => {
      const card = createCard(prize, index);
      cardContainer.appendChild(card);
    });
    
    localStorage.setItem("prizes", JSON.stringify(prizes));
  }, 800);
}

function exportPrizes() {
  const exportData = {
    prizes: prizes,
    prizeImages: prizeImages,
    scratchedCards: JSON.parse(localStorage.getItem('scratchedCards')) || []
  };
  const dataString = JSON.stringify(exportData);
  const blob = new Blob([dataString], { type: "application/json" });
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
  prizeImages = {};
  localStorage.removeItem("prizes");
  localStorage.removeItem("prizeImages");
  localStorage.removeItem("scratchedCards");
  prizeInput.value = "";
  prizeInput.dataset.cardIndex = "";
  addCardBtn.textContent = "添加奖品";
}

function removeCard() {
  const cardIndex = prizeInput.dataset.cardIndex;
  
  if (cardIndex && confirm("确定要移除这个奖品吗？")) {
    // 移除奖品和对应图片
    prizes.splice(parseInt(cardIndex), 1);
    delete prizeImages[cardIndex];
    
    // 重新索引图片
    const newPrizeImages = {};
    prizes.forEach((_, index) => {
      if (prizeImages[index] !== undefined) {
        newPrizeImages[index] = prizeImages[index];
      }
    });
    prizeImages = newPrizeImages;
    
    // 更新本地存储
    localStorage.setItem("prizes", JSON.stringify(prizes));
    localStorage.setItem("prizeImages", JSON.stringify(prizeImages));
    
    // 重新渲染卡片
    cardContainer.innerHTML = "";
    prizes.forEach((prize, index) => {
      const card = createCard(prize, index);
      cardContainer.appendChild(card);
    });
    
    // 重置输入
    prizeInput.value = "";
    prizeInput.dataset.cardIndex = "";
    addCardBtn.textContent = "添加奖品";
    prizeImageInput.value = '';
    previewImg.src = '';
    imagePreview.style.display = 'none';
    currentImageFile = null;
  } else {
    alert("请先选择要移除的卡片");
  }
}

// 初始化惩罚列表
const punishmentsContainer = document.getElementById("punishments");

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
    localStorage.setItem(
      "punishments",
      JSON.stringify(initialPunishments) || []
    ); // 更新本地存储
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

// 从文件读取
function importPunishments() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedPunishments = JSON.parse(reader.result);
          punishmentsContainer.innerHTML = "";
          importedPunishments.forEach((punishment) => {
            const punishmentItem = document.createElement("div");
            punishmentItem.className = "punishment-item";
            punishmentItem.textContent = punishment;
            punishmentsContainer.appendChild(punishmentItem);
          });
          localStorage.setItem(
            "punishments",
            JSON.stringify(importedPunishments)
          ); // 更新本地存储
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

function exportPunishments() {
  const punishments = localStorage.getItem("punishments") || "[]";
  const blob = new Blob([punishments], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "punishments.json";
  a.click();
  URL.revokeObjectURL(url);
}

// 编辑模式控制
let isEditMode = false;
const editModeToggle = document.getElementById('editModeToggle');
const editOnlyElements = document.querySelectorAll('.edit-only');

// 编辑模式切换
editModeToggle.addEventListener('change', function() {
  isEditMode = this.checked;
  
  const editPanel = document.querySelector('.edit-panel');
  const normalControls = document.querySelector('.normal-controls');
  
  if (editPanel) {
    editPanel.style.display = isEditMode ? 'block' : 'none';
  }
  
  if (normalControls) {
    normalControls.style.display = isEditMode ? 'none' : 'block';
  }
  
  // 重置输入状态
  if (!isEditMode) {
    prizeInput.value = '';
    prizeInput.dataset.cardIndex = '';
    addCardBtn.textContent = '添加奖品';
    prizeImageInput.value = '';
    previewImg.src = '';
    imagePreview.style.display = 'none';
    currentImageFile = null;
  }
  
  // 重置所有卡片编辑状态
  document.querySelectorAll('.card').forEach(card => {
    card.removeAttribute('editing');
  });
});

// 绑定按钮事件（带编辑模式检查）
document.addEventListener('DOMContentLoaded', function() {
  const addCardBtn = document.getElementById('addCardBtn');
  const removeCardBtn = document.getElementById('removeCardBtn');
  const shuffleCardBtn = document.getElementById('shuffleCardBtn');
  const resetGameBtn = document.getElementById('resetGameBtn');
  const loadBtn = document.getElementById('loadBtn');
  const saveBtn = document.getElementById('saveBtn');
  
  if (addCardBtn) {
    addCardBtn.addEventListener('click', () => {
      if (isEditMode) addCard();
    });
  }
  
  if (removeCardBtn) {
    removeCardBtn.addEventListener('click', () => {
      if (isEditMode) removeCard();
    });
  }
  
  if (shuffleCardBtn) {
    shuffleCardBtn.addEventListener('click', shuffleCards);
  }
  
  if (resetGameBtn) {
    resetGameBtn.addEventListener('click', () => {
      if (isEditMode) resetGame();
    });
  }
  
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      if (isEditMode) importPrizes();
    });
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      if (isEditMode) exportPrizes();
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  const randomBtn = document.getElementById('randomBtn');
  const clearBtn = document.getElementById('clearBtn');
  const savePunishmentBtn = document.getElementById('savePunishmentBtn');
  const loadPunishmentBtn = document.getElementById('loadPunishmentBtn');
  
  if (randomBtn) {
    randomBtn.addEventListener('click', selectRandomPunishment);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener('click', clearPunishment);
  }
  
  if (savePunishmentBtn) {
    savePunishmentBtn.addEventListener('click', exportPunishments);
  }
  
  if (loadPunishmentBtn) {
    loadPunishmentBtn.addEventListener('click', importPunishments);
  }
});

// 图片上传功能
const uploadImageBtn = document.getElementById('uploadImageBtn');
const prizeImageInput = document.getElementById('prizeImageInput');
const previewImg = document.getElementById('previewImg');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');

uploadImageBtn.addEventListener('click', () => {
  if (isEditMode) prizeImageInput.click();
});

prizeImageInput.addEventListener('change', (e) => {
  if (isEditMode) {
    const file = e.target.files[0];
    if (file) {
      currentImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }
});

removeImageBtn.addEventListener('click', () => {
  if (isEditMode) {
    prizeImageInput.value = '';
    previewImg.src = '';
    imagePreview.style.display = 'none';
    currentImageFile = null;
  }
});

// 定义全局变量
let prizes = JSON.parse(localStorage.getItem("prizes")) || [];
let prizeImages = JSON.parse(localStorage.getItem("prizeImages")) || {};
let initialPunishments = JSON.parse(localStorage.getItem("punishments")) || [];
let currentCard = null; // 保存当前刮刮乐卡片
let currentImageFile = null;

// 初始化页面
loadInitialData();

// 确保所有按钮正确绑定
document.addEventListener('DOMContentLoaded', function() {
  console.log('所有按钮已绑定');
});
