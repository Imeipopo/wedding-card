// ==================== 全局變數 ====================
let currentLayer = 1;
const layers = document.querySelectorAll('.layer');
const envelope = document.getElementById('envelope');
const rsvpBtn = document.getElementById('rsvp-btn');
const transitionLayer = document.getElementById('transition-writing');
const rsvpForm = document.getElementById('rsvp-form');

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    console.log('婚禮請帖網頁已初始化');
});

// ==================== 事件監聽器設置 ====================
function initializeEventListeners() {
    // 信封點擊事件
    envelope.addEventListener('click', handleEnvelopeClick);
    
    // RSVP 按鈕點擊事件
    rsvpBtn.addEventListener('click', handleRsvpButtonClick);
    
    // 表單提交事件
    rsvpForm.addEventListener('submit', handleFormSubmit);
}

// ==================== 第一層：信封互動 ====================
function handleEnvelopeClick() {
    console.log('信封被點擊');
    
    // 停止悸動愛心動畫
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.style.animation = 'none';
    });
    
    // 信封打開動畫
    envelope.classList.add('opening');
    
    // 生成飛出的照片
    setTimeout(() => {
        generatePhotosAnimation();
    }, 400);
    
    // 淡出到第二層
    setTimeout(() => {
        transitionToLayer(2);
    }, 2500);
}

// 生成照片飛出動畫
function generatePhotosAnimation() {
    const container = document.querySelector('.envelope-container');
    
    // 建立 6 張照片卡片
    const photoCount = 6;
    for (let i = 0; i < photoCount; i++) {
        const photo = document.createElement('div');
        photo.className = 'flying-photo';
        photo.innerHTML = '📷';
        photo.style.position = 'absolute';
        photo.style.fontSize = '48px';
        photo.style.left = '50%';
        photo.style.top = '50%';
        photo.style.transform = 'translate(-50%, -50%)';
        photo.style.opacity = '0.8';
        photo.style.zIndex = '15';
        
        container.appendChild(photo);
        
        // 觸發動畫
        const angle = (i / photoCount) * Math.PI * 2;
        const distance = 400;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        setTimeout(() => {
            photo.style.transition = 'all 1.5s ease-out';
            photo.style.opacity = '0';
            photo.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.5)`;
        }, 50);
        
        // 動畫結束後移除
        setTimeout(() => {
            photo.remove();
        }, 1600);
    }
}

// ==================== 層級轉換函數 ====================
function transitionToLayer(layerNum) {
    console.log(`轉換到第 ${layerNum} 層`);
    
    // 移除所有層的 active 類
    layers.forEach(layer => {
        layer.classList.remove('active');
    });
    
    // 添加新層的 active 類
    const nextLayer = document.querySelector(`.layer-${layerNum}`);
    if (nextLayer) {
        nextLayer.classList.add('active');
        currentLayer = layerNum;
    }
}

// ==================== 第二層：RSVP 按鈕點擊 ====================
function handleRsvpButtonClick() {
    console.log('RSVP 按鈕被點擊');
    
    // 顯示過場動畫層
    transitionLayer.classList.add('active');
    
    // 設定延遲後轉換到第三層
    setTimeout(() => {
        transitionLayer.classList.remove('active');
        transitionToLayer(3);
    }, 3000);
}

// ==================== 第三層：表單提交 ====================
function handleFormSubmit(event) {
    event.preventDefault();
    
    // 收集表單數據
    const formData = {
        name: document.getElementById('name').value,
        guests: document.getElementById('guests').value,
        attend: document.querySelector('input[name="attend"]:checked').value,
        notes: document.getElementById('notes').value
    };
    
    console.log('表單提交:', formData);
    
    // 驗證表單
    if (!formData.name || !formData.guests || !formData.attend) {
        alert('請完成所有必填欄位');
        return;
    }
    
    // 顯示成功訊息
    showSuccessMessage(formData);
    
    // 重置表單
    rsvpForm.reset();
}

// 顯示成功訊息
function showSuccessMessage(formData) {
    // 建立成功訊息模態框
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h2>感謝您的回覆！</h2>
            <p>親愛的 ${formData.name}，</p>
            <p>我們已經收到您的出席確認，${formData.attend === 'yes' ? '期待在婚禮當天與您相聚！' : '希望下次有機會與您同慶。'}</p>
            <button onclick="this.parentElement.parentElement.remove()">返回</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加樣式
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
            animation: fadeIn 0.3s ease;
        }
        
        .success-content {
            background: white;
            padding: 50px 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: popIn 0.4s ease;
        }
        
        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            margin: 0 auto 20px;
            animation: scaleIn 0.5s ease;
        }
        
        .success-content h2 {
            font-size: 28px;
            color: #333;
            margin: 20px 0;
        }
        
        .success-content p {
            font-size: 16px;
            color: #666;
            line-height: 1.6;
            margin: 15px 0;
        }
        
        .success-content button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 40px;
            font-size: 16px;
            border-radius: 50px;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        
        .success-content button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes popIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0);
            }
            to {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== 附加功能 ====================

// 鍵盤導航支持 (可選)
document.addEventListener('keydown', function(event) {
    // 按 ESC 鍵返回第一層
    if (event.key === 'Escape' && currentLayer !== 1) {
        transitionToLayer(1);
    }
});

// 平滑滾動支持
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 禁用右鍵複製（可選保護內容）
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     return false;
// });

console.log('JavaScript 已載入完成');
