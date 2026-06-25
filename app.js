// ===== Data =====
const USERS = [
  { id:1, name:'生活美学家', avatar:'https://i.pravatar.cc/80?img=47' },
  { id:2, name:'穿搭日记本', avatar:'https://i.pravatar.cc/80?img=5' },
  { id:3, name:'美食探索家', avatar:'https://i.pravatar.cc/80?img=32' },
  { id:4, name:'旅行摄影师', avatar:'https://i.pravatar.cc/80?img=12' },
  { id:5, name:'彩妆研究所', avatar:'https://i.pravatar.cc/80?img=44' },
  { id:6, name:'健身打卡er', avatar:'https://i.pravatar.cc/80?img=15' },
  { id:7, name:'宠物日常',   avatar:'https://i.pravatar.cc/80?img=29' },
  { id:8, name:'手工创作坊', avatar:'https://i.pravatar.cc/80?img=9' },
];

const TOPICS = ['#穿搭灵感','#今日美食','#旅行日记','#彩妆教程','#生活美学','#健身打卡','#宠物日常','#手工DIY','#影视推荐','#好物分享'];

const TITLES = [
  '今天的穿搭超级好看，分享给大家！',
  '发现了一家超级好吃的隐藏小店',
  '周末去了这个地方，美到窒息',
  '这款口红真的绝了，显白又好看',
  '秋冬必备的几件单品，你有几件？',
  '自制抹茶拿铁，比咖啡店好喝多了',
  '巴黎旅行第三天，今天去了卢浮宫',
  '最近迷上了这部剧，强烈推荐！',
  '健身第30天，身材真的变了',
  '我家猫咪今天特别可爱',
  '手工皮革钱包制作全过程',
  '这个护肤步骤让我皮肤变好了',
  '深秋的银杏叶，太美了',
  '今天做了一道超简单的意大利面',
  '新买的相机，随手拍都好看',
  '分享我的书房改造计划',
  '这双鞋子真的百搭，已经穿了一周',
  '周末下午茶，治愈系时光',
  '学会了这个发型，每天都想出门',
  '云南旅行攻略，建议收藏！',
];

const BODIES = [
  '今天天气特别好，出门逛街顺便拍了几张照片。这套搭配是我最近最喜欢的，米色毛衣配牛仔裤，简单又好看。',
  '藏在小巷子里的宝藏餐厅，人均50元，味道超级棒！强烈推荐大家去打卡。',
  '这次旅行真的太值了，风景美到让人忘记烦恼。下次还要来！',
  '用了三个月终于找到了适合自己的护肤方案，皮肤状态越来越好了。',
];

const COMMENTS_DATA = [
  { user:'小仙女日记', avatar:'https://i.pravatar.cc/80?img=23', text:'太好看了！请问是哪个品牌的？', time:'2小时前', likes:24, verified:false,
    replies:[{ user:'博主回复', avatar:'https://i.pravatar.cc/80?img=47', text:'是XX品牌的，链接在主页哦～', time:'1小时前', likes:8 }]
  },
  { user:'时尚达人', avatar:'https://i.pravatar.cc/80?img=16', text:'这个搭配真的绝了，我也要去买！', time:'3小时前', likes:56, verified:true, replies:[] },
  { user:'生活记录者', avatar:'https://i.pravatar.cc/80?img=38', text:'每次看你的帖子都好有灵感，感谢分享！', time:'5小时前', likes:18, verified:false, replies:[] },
  { user:'美食爱好者', avatar:'https://i.pravatar.cc/80?img=52', text:'好想去！请问在哪个城市？', time:'6小时前', likes:12, verified:false,
    replies:[{ user:'博主回复', avatar:'https://i.pravatar.cc/80?img=47', text:'在上海，具体地址私信我哦！', time:'5小时前', likes:5 }]
  },
  { user:'旅行达人', avatar:'https://i.pravatar.cc/80?img=60', text:'风景真的太美了，已经加入愿望清单！', time:'8小时前', likes:34, verified:true, replies:[] },
];

// ===== State =====
let currentPage = 'home';
let carouselIndex = 0;
let carouselTotal = 0;
let currentCard = null;
let isLiked = false;
let isCollected = false;
let videoEl = null;
let isDraggingProgress = false;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  generateFeed();
  generateProfileGrid();
  generateDMList();
  generateNotifyList();
  setupNavigation();
  setupTabs();
  setupProfileTabs();
  setupMsgTabs();
  setupScrollLoad();
});

// ===== Navigation =====
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  currentPage = page;
}

// ===== Channel Tabs =====
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('waterfall-grid');
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      setTimeout(() => {
        grid.innerHTML = '';
        generateFeed(btn.dataset.tab);
        grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}

// ===== 按主题分类的 Unsplash 图片 ID 池 =====
const IMG_POOLS = {
  fashion:  [1536619,1536620,1536621,1536622,1536623,1536624,1536625,1536626,
             1536627,1536628,1536629,1536630,1536631,1536632,1536633,1536634],
  food:     [1640777,1640778,1640779,1640780,1640781,1640782,1640783,1640784,
             1640785,1640786,1640787,1640788,1640789,1640790,1640791,1640792],
  travel:   [1450353,1450354,1450355,1450356,1450357,1450358,1450359,1450360,
             1450361,1450362,1450363,1450364,1450365,1450366,1450367,1450368],
  beauty:   [1570807,1570808,1570809,1570810,1570811,1570812,1570813,1570814,
             1570815,1570816,1570817,1570818,1570819,1570820,1570821,1570822],
  fitness:  [1552242,1552243,1552244,1552245,1552246,1552247,1552248,1552249,
             1552250,1552251,1552252,1552253,1552254,1552255,1552256,1552257],
  pet:      [1560807,1560808,1560809,1560810,1560811,1560812,1560813,1560814,
             1560815,1560816,1560817,1560818,1560819,1560820,1560821,1560822],
  life:     [1500550,1500551,1500552,1500553,1500554,1500555,1500556,1500557,
             1500558,1500559,1500560,1500561,1500562,1500563,1500564,1500565],
};

// 主题关键词映射（用于 Unsplash source URL）
const TAB_KEYWORDS = {
  recommend: ['fashion','food','travel','beauty','fitness','pet','life','fashion','food','travel'],
  fashion:   ['fashion','outfit','style','clothing','dress','fashion','outfit','style','clothing','dress'],
  food:      ['food','meal','restaurant','cooking','dessert','food','meal','restaurant','cooking','dessert'],
  beauty:    ['makeup','cosmetics','beauty','skincare','lipstick','makeup','cosmetics','beauty','skincare','lipstick'],
  film:      ['cinema','movie','film','theater','popcorn','cinema','movie','film','theater','popcorn'],
  travel:    ['travel','landscape','mountain','beach','city','travel','landscape','mountain','beach','city'],
  fitness:   ['fitness','gym','workout','yoga','running','fitness','gym','workout','yoga','running'],
  pet:       ['cat','dog','pet','kitten','puppy','cat','dog','pet','kitten','puppy'],
  diy:       ['craft','handmade','art','diy','creative','craft','handmade','art','diy','creative'],
};

let _feedCounter = 0;

// ===== Feed Generation =====
function generateFeed(tab = 'recommend', count = 20) {
  const grid = document.getElementById('waterfall-grid');
  const keywords = TAB_KEYWORDS[tab] || TAB_KEYWORDS.recommend;
  for (let i = 0; i < count; i++) {
    const idx = _feedCounter++;
    const isVideo = Math.random() > 0.75;
    const user = USERS[idx % USERS.length];
    const title = TITLES[idx % TITLES.length];
    const likes = Math.floor(Math.random() * 50000) + 100;
    const heights = [180, 220, 260, 200, 240, 280, 190, 230, 210, 250];
    const h = heights[idx % heights.length];
    const kw = keywords[idx % keywords.length];
    // 用 picsum 固定 seed 保证图片稳定不闪烁，seed 按关键词+序号组合
    const seedStr = kw + (idx * 37 + 100);
    const card = createCard({ seedStr, isVideo, user, title, likes, h, index: idx, kw });
    grid.appendChild(card);
  }
}

function createCard({ seedStr, isVideo, user, title, likes, h, index, kw }) {
  const div = document.createElement('div');
  div.className = 'card';
  // 使用 picsum 的 seed 字符串，保证每张图稳定且各不相同
  const imgUrl = `https://picsum.photos/seed/${seedStr}/300/${h}`;
  div.innerHTML = `
    <div class="card-cover">
      <img src="${imgUrl}" alt="${title}" loading="lazy">
      ${isVideo ? `<div class="card-video-badge"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>` : ''}
    </div>
    <div class="card-body">
      <p class="card-title">${title}</p>
      <div class="card-footer">
        <div class="card-user">
          <img class="card-avatar" src="${user.avatar}" alt="${user.name}">
          <span class="card-username">${user.name}</span>
        </div>
        <div class="card-likes">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          ${formatNum(likes)}
        </div>
      </div>
    </div>
  `;
  div.addEventListener('click', () => openModal({ seedStr, isVideo, user, title, likes, index }));
  return div;
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

// ===== Scroll Load =====
function setupScrollLoad() {
  const page = document.getElementById('page-home');
  page.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = page;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMore();
    }
  });
}

let isLoading = false;
function loadMore() {
  if (isLoading) return;
  isLoading = true;
  setTimeout(() => {
    generateFeed('recommend', 8);
    isLoading = false;
  }, 800);
}

// ===== Modal =====
function openModal({ seedStr, isVideo, user, title, likes, index }) {
  currentCard = { seedStr, isVideo, user, title, likes, index };
  isLiked = false;
  isCollected = false;

  document.getElementById('modal-avatar').src = user.avatar;
  document.getElementById('modal-username').textContent = user.name;
  document.getElementById('modal-time').textContent = '2小时前';
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = BODIES[index % BODIES.length];
  document.getElementById('modal-like-count').textContent = formatNum(likes);

  // Topics
  const topicsEl = document.getElementById('modal-topics');
  topicsEl.innerHTML = '';
  const topicCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < topicCount; i++) {
    const t = document.createElement('span');
    t.className = 'topic-tag';
    t.textContent = TOPICS[(index + i) % TOPICS.length];
    topicsEl.appendChild(t);
  }

  // Reset action buttons
  document.getElementById('modal-like-btn').classList.remove('liked');
  document.getElementById('modal-collect-btn').classList.remove('collected');

  // Media
  const carousel = document.getElementById('media-carousel');
  const dots = document.getElementById('carousel-dots');
  carousel.innerHTML = '';
  dots.innerHTML = '';
  carouselIndex = 0;

  if (isVideo) {
    buildVideoPlayer(carousel, seedStr);
    carouselTotal = 1;
    document.getElementById('carousel-prev').style.display = 'none';
    document.getElementById('carousel-next').style.display = 'none';
  } else {
    const imgCount = Math.floor(Math.random() * 4) + 1;
    carouselTotal = imgCount;
    const heights = [600, 500, 550, 480];
    for (let i = 0; i < imgCount; i++) {
      const slide = document.createElement('div');
      slide.className = 'media-slide';
      slide.innerHTML = `<img src="https://picsum.photos/seed/${seedStr}x${i}/600/${heights[i % heights.length]}" alt="">`;
      carousel.appendChild(slide);
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dots.appendChild(dot);
    }
    document.getElementById('carousel-prev').style.display = imgCount > 1 ? 'flex' : 'none';
    document.getElementById('carousel-next').style.display = imgCount > 1 ? 'flex' : 'none';
    updateCarousel();
  }

  // Comments
  buildComments();

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildVideoPlayer(carousel, seedStr) {
  const slide = document.createElement('div');
  slide.className = 'media-slide';
  slide.style.position = 'relative';
  slide.innerHTML = `
    <div class="video-player-wrap" id="video-wrap">
      <video id="main-video" loop playsinline poster="https://picsum.photos/seed/${seedStr}/600/500">
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
      </video>
      <button class="mute-fab" id="mute-fab" onclick="toggleMute()">
        <svg id="mute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
      </button>
      <div class="video-controls" id="video-controls">
        <div class="progress-bar-wrap" id="progress-wrap">
          <div class="progress-bar-fill" id="progress-fill" style="width:0%"></div>
          <div class="progress-thumb" id="progress-thumb" style="left:0%"></div>
        </div>
        <div class="video-ctrl-row">
          <button class="ctrl-btn" id="play-btn" onclick="togglePlay()">
            <svg id="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21" fill="white" stroke="none"/></svg>
          </button>
          <span class="time-display" id="time-display">0:00 / 0:00</span>
          <div class="spacer"></div>
          <div class="volume-wrap">
            <button class="ctrl-btn" onclick="toggleMute()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
            </button>
            <input type="range" class="volume-slider" id="volume-slider" min="0" max="1" step="0.05" value="1" oninput="setVolume(this.value)">
          </div>
          <button class="ctrl-btn" onclick="toggleFullscreen()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;
  carousel.appendChild(slide);

  setTimeout(() => {
    videoEl = document.getElementById('main-video');
    if (!videoEl) return;
    videoEl.addEventListener('timeupdate', updateProgress);
    videoEl.addEventListener('loadedmetadata', updateProgress);
    videoEl.addEventListener('click', togglePlay);
    setupProgressDrag();
  }, 100);
}

function togglePlay() {
  if (!videoEl) return;
  const icon = document.getElementById('play-icon');
  if (videoEl.paused) {
    videoEl.play();
    icon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="white"/><rect x="14" y="4" width="4" height="16" fill="white"/>';
  } else {
    videoEl.pause();
    icon.innerHTML = '<polygon points="5,3 19,12 5,21" fill="white" stroke="none"/>';
  }
}

function toggleMute() {
  if (!videoEl) return;
  videoEl.muted = !videoEl.muted;
  const icon = document.getElementById('mute-icon');
  if (videoEl.muted) {
    icon.innerHTML = '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/><line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>';
  } else {
    icon.innerHTML = '<polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>';
  }
}

function setVolume(v) {
  if (!videoEl) return;
  videoEl.volume = parseFloat(v);
}

function toggleFullscreen() {
  const wrap = document.getElementById('video-wrap');
  if (!wrap) return;
  if (!document.fullscreenElement) {
    wrap.requestFullscreen && wrap.requestFullscreen();
  } else {
    document.exitFullscreen && document.exitFullscreen();
  }
}

function updateProgress() {
  if (!videoEl) return;
  const pct = videoEl.duration ? (videoEl.currentTime / videoEl.duration) * 100 : 0;
  const fill = document.getElementById('progress-fill');
  const thumb = document.getElementById('progress-thumb');
  const display = document.getElementById('time-display');
  if (fill) fill.style.width = pct + '%';
  if (thumb) thumb.style.left = pct + '%';
  if (display) display.textContent = `${fmtTime(videoEl.currentTime)} / ${fmtTime(videoEl.duration || 0)}`;
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function setupProgressDrag() {
  const wrap = document.getElementById('progress-wrap');
  if (!wrap) return;
  const seek = (e) => {
    const rect = wrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (videoEl && videoEl.duration) videoEl.currentTime = pct * videoEl.duration;
  };
  wrap.addEventListener('mousedown', (e) => { isDraggingProgress = true; seek(e); });
  document.addEventListener('mousemove', (e) => { if (isDraggingProgress) seek(e); });
  document.addEventListener('mouseup', () => { isDraggingProgress = false; });
}

// ===== Carousel =====
function updateCarousel() {
  const carousel = document.getElementById('media-carousel');
  carousel.style.transform = `translateX(-${carouselIndex * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === carouselIndex);
  });
}

function carouselPrev() {
  if (carouselIndex > 0) { carouselIndex--; updateCarousel(); }
}

function carouselNext() {
  if (carouselIndex < carouselTotal - 1) { carouselIndex++; updateCarousel(); }
}

function goToSlide(i) {
  carouselIndex = i;
  updateCarousel();
}

// ===== Comments =====
function buildComments() {
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comments-count');
  list.innerHTML = '';
  countEl.textContent = `评论 ${COMMENTS_DATA.length}`;
  COMMENTS_DATA.forEach(c => {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
      <img class="comment-avatar" src="${c.avatar}" alt="${c.user}">
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-name">${c.user}</span>
          ${c.verified ? `<span class="verified-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20,6 9,17 4,12"/></svg></span>` : ''}
        </div>
        <p class="comment-text">${c.text}</p>
        <div class="comment-meta">
          <span class="comment-time">${c.time}</span>
          <span class="comment-like">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            ${c.likes}
          </span>
          <span class="comment-reply">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            回复
          </span>
        </div>
        ${c.replies && c.replies.length ? `
          <div class="comment-replies">
            ${c.replies.map(r => `
              <div class="comment-item">
                <img class="comment-avatar" src="${r.avatar}" alt="${r.user}">
                <div class="comment-body">
                  <div class="comment-header"><span class="comment-name">${r.user}</span></div>
                  <p class="comment-text">${r.text}</p>
                  <div class="comment-meta">
                    <span class="comment-time">${r.time}</span>
                    <span class="comment-like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>${r.likes}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
    list.appendChild(item);
  });
}

function sendComment() {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) return;
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comments-count');
  const item = document.createElement('div');
  item.className = 'comment-item';
  item.style.animation = 'fadeIn 0.3s ease';
  item.innerHTML = `
    <img class="comment-avatar" src="https://i.pravatar.cc/80?img=33" alt="我">
    <div class="comment-body">
      <div class="comment-header"><span class="comment-name">我</span></div>
      <p class="comment-text">${text}</p>
      <div class="comment-meta">
        <span class="comment-time">刚刚</span>
        <span class="comment-like"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>0</span>
      </div>
    </div>
  `;
  list.insertBefore(item, list.firstChild);
  const cur = parseInt(countEl.textContent.replace('评论 ', '')) + 1;
  countEl.textContent = `评论 ${cur}`;
  input.value = '';
}

// ===== Like / Collect =====
function toggleLike() {
  isLiked = !isLiked;
  const btn = document.getElementById('modal-like-btn');
  const countEl = document.getElementById('modal-like-count');
  btn.classList.toggle('liked', isLiked);
  if (currentCard) {
    const base = currentCard.likes;
    countEl.textContent = formatNum(isLiked ? base + 1 : base);
  }
}

function toggleCollect() {
  isCollected = !isCollected;
  const btn = document.getElementById('modal-collect-btn');
  btn.classList.toggle('collected', isCollected);
}

// ===== Close Modal =====
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalDirect();
}

function closeModalDirect() {
  if (videoEl) { videoEl.pause(); videoEl = null; }
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== Publish =====
function showPublishStep(step) {
  document.querySelectorAll('.publish-step').forEach(s => s.classList.add('hidden'));
  if (step === 1) {
    document.getElementById('publish-step-1').classList.remove('hidden');
  }
}

document.querySelectorAll('.publish-type-card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;
    document.querySelectorAll('.publish-step').forEach(s => s.classList.add('hidden'));
    if (type === 'image') document.getElementById('publish-step-image').classList.remove('hidden');
    else if (type === 'video') document.getElementById('publish-step-video').classList.remove('hidden');
    else {
      document.getElementById('publish-step-image').classList.remove('hidden');
    }
  });
});

let imageCount = 0;
function addImageSlot() {
  if (imageCount >= 9) return;
  const grid = document.getElementById('image-grid');
  const addBtn = grid.querySelector('.image-add-btn');
  const slot = document.createElement('div');
  slot.className = 'image-slot';
  const seed = Math.floor(Math.random() * 1000);
  slot.innerHTML = `
    <img src="https://picsum.photos/seed/${seed}/200/200" alt="">
    <span class="image-slot-remove" onclick="removeImageSlot(this)">×</span>
  `;
  grid.insertBefore(slot, addBtn);
  imageCount++;
  if (imageCount >= 9) addBtn.style.display = 'none';
}

function removeImageSlot(el) {
  el.parentElement.remove();
  imageCount--;
  const addBtn = document.querySelector('.image-add-btn');
  if (addBtn) addBtn.style.display = '';
}

// ===== Profile =====
function generateProfileGrid() {
  const grid = document.getElementById('profile-grid');
  // 个人主页用生活/时尚/旅行主题图片
  const profileSeeds = [
    'fashion101','travel202','food303','beauty404','life505','fitness606',
    'fashion707','travel808','food909','beauty110','life211','fitness312',
    'fashion413','travel514','food615','beauty716','life817','fitness918',
  ];
  for (let i = 0; i < 18; i++) {
    const likes = Math.floor(Math.random() * 20000) + 200;
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
      <img src="https://picsum.photos/seed/${profileSeeds[i]}/300/300" alt="">
      <div class="profile-card-overlay">
        <p class="profile-card-title">${TITLES[i % TITLES.length]}</p>
      </div>
      <div class="profile-card-likes">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        ${formatNum(likes)}
      </div>
    `;
    grid.appendChild(card);
  }
}

function setupProfileTabs() {
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('profile-grid');
      if (btn.dataset.view === 'list') {
        grid.style.gridTemplateColumns = '1fr';
        grid.querySelectorAll('.profile-card').forEach(c => { c.style.aspectRatio = '3/1'; });
      } else {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.querySelectorAll('.profile-card').forEach(c => { c.style.aspectRatio = '1'; });
      }
    });
  });
}

// ===== Messages =====
function generateDMList() {
  const list = document.getElementById('dm-list');
  const dms = [
    { user:'穿搭日记本', avatar:'https://i.pravatar.cc/96?img=5',  preview:'你好，请问这件衣服在哪里买的？', time:'10:32', unread:2 },
    { user:'美食探索家', avatar:'https://i.pravatar.cc/96?img=32', preview:'那家餐厅真的超好吃！', time:'昨天', unread:0 },
    { user:'旅行摄影师', avatar:'https://i.pravatar.cc/96?img=12', preview:'下次一起去旅行吧！', time:'昨天', unread:1 },
    { user:'彩妆研究所', avatar:'https://i.pravatar.cc/96?img=44', preview:'这款口红色号是什么？', time:'周一', unread:0 },
    { user:'生活美学家', avatar:'https://i.pravatar.cc/96?img=47', preview:'谢谢你的推荐，已经买了！', time:'周日', unread:0 },
    { user:'健身打卡er', avatar:'https://i.pravatar.cc/96?img=15', preview:'一起打卡健身吧！', time:'上周', unread:0 },
  ];
  dms.forEach(dm => {
    const item = document.createElement('div');
    item.className = 'dm-item';
    item.innerHTML = `
      <div class="dm-avatar-wrap">
        <img class="dm-avatar" src="${dm.avatar}" alt="${dm.user}">
        ${dm.unread ? `<span class="unread-dot">${dm.unread}</span>` : ''}
      </div>
      <div class="dm-content">
        <p class="dm-name">${dm.user}</p>
        <p class="dm-preview">${dm.preview}</p>
      </div>
      <span class="dm-time">${dm.time}</span>
    `;
    list.appendChild(item);
  });
}

function generateNotifyList() {
  const list = document.getElementById('notify-list');
  const notifies = [
    { user:'穿搭日记本', avatar:'https://i.pravatar.cc/84?img=5',  action:'赞了你的笔记', thumb:'https://picsum.photos/seed/fashion101/48/48', comment:'', time:'5分钟前' },
    { user:'美食探索家', avatar:'https://i.pravatar.cc/84?img=32', action:'评论了你的笔记', thumb:'https://picsum.photos/seed/food303/48/48', comment:'"这个地方我也去过，真的很美！"', time:'20分钟前' },
    { user:'旅行摄影师', avatar:'https://i.pravatar.cc/84?img=12', action:'关注了你', thumb:'', comment:'', time:'1小时前' },
    { user:'彩妆研究所', avatar:'https://i.pravatar.cc/84?img=44', action:'收藏了你的笔记', thumb:'https://picsum.photos/seed/beauty404/48/48', comment:'', time:'2小时前' },
    { user:'生活美学家', avatar:'https://i.pravatar.cc/84?img=47', action:'@了你', thumb:'https://picsum.photos/seed/life505/48/48', comment:'"这个搭配真的很适合你！"', time:'昨天' },
    { user:'健身打卡er', avatar:'https://i.pravatar.cc/84?img=15', action:'赞了你的评论', thumb:'https://picsum.photos/seed/fitness606/48/48', comment:'', time:'昨天' },
  ];
  notifies.forEach(n => {
    const item = document.createElement('div');
    item.className = 'notify-item';
    item.innerHTML = `
      <img class="notify-avatar" src="${n.avatar}" alt="${n.user}">
      <div class="notify-content">
        <p class="notify-action"><strong>${n.user}</strong> ${n.action}</p>
        ${n.comment ? `<p class="notify-comment">${n.comment}</p>` : ''}
        <p class="notify-time">${n.time}</p>
      </div>
      ${n.thumb ? `<img class="notify-thumb" src="${n.thumb}" alt="">` : ''}
    `;
    list.appendChild(item);
  });
}

function setupMsgTabs() {
  document.querySelectorAll('.msg-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.msg-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.msg-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`msg-${tab.dataset.msgtab}`).classList.add('active');
    });
  });
}

// ===== Follow Button =====
document.querySelector('.follow-btn').addEventListener('click', function() {
  this.classList.toggle('following');
  this.textContent = this.classList.contains('following') ? '已关注' : '关注';
});

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModalDirect();
  if (e.key === 'ArrowLeft') carouselPrev();
  if (e.key === 'ArrowRight') carouselNext();
});
