// ===== CHIRAILA CRICKET - MAIN JAVASCRIPT =====

// ---- NAVBAR MOBILE TOGGLE ----
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// ---- SCROLL TO TOP ----
const scrollBtn = document.querySelector('.scroll-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- ACTIVE NAV ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
    if (!link) return;
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// ---- TOAST NOTIFICATIONS ----
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ---- TABS ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.closest('.tabs-wrapper');
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ---- REGISTRATION FORM ----
const regForm = document.getElementById('registrationForm');
if (regForm) {
  regForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    const entry = {};
    data.forEach((val, key) => { entry[key] = val; });
    entry.id = Date.now();
    entry.date = new Date().toLocaleDateString('hi-IN');

    const existing = JSON.parse(localStorage.getItem('registrations') || '[]');
    existing.push(entry);
    localStorage.setItem('registrations', JSON.stringify(existing));

    showToast('Registration successful! We will contact you soon. 🏏');
    document.getElementById('regSuccess').classList.add('show');
    this.reset();
    setTimeout(() => document.getElementById('regSuccess').classList.remove('show'), 5000);
    loadRegisteredPlayers();
  });
}

// ---- PARTICIPATION FORM ----
const partForm = document.getElementById('participationForm');
if (partForm) {
  partForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    const entry = {};
    data.forEach((val, key) => { entry[key] = val; });
    entry.id = Date.now();
    entry.date = new Date().toLocaleDateString('hi-IN');

    const existing = JSON.parse(localStorage.getItem('participants') || '[]');
    existing.push(entry);
    localStorage.setItem('participants', JSON.stringify(existing));

    showToast('Participation form submitted! 🏏');
    document.getElementById('partSuccess').classList.add('show');
    this.reset();
    setTimeout(() => document.getElementById('partSuccess').classList.remove('show'), 5000);
  });
}

// ---- LOAD REGISTERED PLAYERS ----
function loadRegisteredPlayers() {
  const container = document.getElementById('playersGrid');
  if (!container) return;
  const players = JSON.parse(localStorage.getItem('registrations') || '[]');
  if (players.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1;padding:30px">Abhi koi registration nahi hua hai.</p>';
    return;
  }
  container.innerHTML = players.map(p => `
    <div class="player-card">
      <div class="player-avatar">${(p.playerName || p.captainName || 'P')[0].toUpperCase()}</div>
      <div class="player-name">${p.playerName || p.captainName || 'Player'}</div>
      <div class="player-role" style="margin-bottom:5px">${p.role || p.teamName || ''}</div>
      <div style="font-size:11px;color:#aaa">${p.date}</div>
    </div>
  `).join('');
}
loadRegisteredPlayers();

// ---- VIDEO UPLOAD ----
const videoInput = document.getElementById('videoInput');
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleVideoFiles(e.dataTransfer.files);
  });
}
if (videoInput) {
  videoInput.addEventListener('change', () => handleVideoFiles(videoInput.files));
}

function handleVideoFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('video/')) {
      showToast('Sirf video files upload kar sakte hain.', 'error');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      showToast('File size 500MB se kam honi chahiye.', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    const titleInput = document.getElementById('videoTitle');
    const title = (titleInput && titleInput.value) ? titleInput.value : file.name;
    const videos = JSON.parse(localStorage.getItem('videos') || '[]');
    const matchInput = document.getElementById('videoMatch');
    videos.push({
      id: Date.now(),
      title,
      match: matchInput ? matchInput.value : '',
      date: new Date().toLocaleDateString('hi-IN'),
      url,
      type: file.type
    });
    localStorage.setItem('videos', JSON.stringify(videos));
    showToast(`"${title}" upload ho gaya! 🎥`);
    loadVideoGallery();
    if (titleInput) titleInput.value = '';
  });
}

function loadVideoGallery() {
  const container = document.getElementById('videoGallery');
  if (!container) return;
  const videos = JSON.parse(localStorage.getItem('videos') || '[]');
  if (videos.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1;padding:40px">Abhi koi video nahi hai. Upload karein!</p>';
    return;
  }
  container.innerHTML = videos.map(v => `
    <div class="video-card">
      <div class="video-thumb" onclick="playVideo('${v.url}','${v.title}')">
        <video src="${v.url}" preload="metadata" muted style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover"></video>
        <div class="play-btn">▶</div>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">
          <span>${v.match || 'Match Highlight'}</span>
          <span>${v.date}</span>
        </div>
      </div>
    </div>
  `).join('');
}
loadVideoGallery();

function playVideo(url, title) {
  const modal = document.getElementById('videoModal');
  if (!modal) return;
  modal.querySelector('h3').textContent = title;
  const player = document.getElementById('modalVideo');
  player.src = url;
  player.play();
  modal.closest('.modal-overlay').classList.add('open');
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('open');
    const video = btn.closest('.modal-overlay').querySelector('video');
    if (video) video.pause();
  });
});

// ---- LIVE SCORE UPDATE (Live poll from localStorage, admin updates) ----
function loadLiveScores() {
  const container = document.getElementById('liveScores');
  if (!container) return;
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  const live = matches.filter(m => m.status === 'live');
  if (live.length === 0) {
    container.innerHTML = `
      <div class="scorecard">
        <div class="scorecard-header">
          <div class="match-info"><strong>Koi live match nahi chal raha</strong><br>Jab match shuru hoga tab yahan score dikhega</div>
          <span class="match-status status-upcoming">Upcoming</span>
        </div>
        <div class="scorecard-body" style="text-align:center;padding:30px;color:#888">
          Matches ka schedule neeche dekh sakte hain 👇
        </div>
      </div>`;
    return;
  }
  container.innerHTML = live.map(m => `
    <div class="scorecard">
      <div class="scorecard-header">
        <div class="match-info">
          <strong>${m.matchName || 'Match'}</strong>
          ${m.venue ? `📍 ${m.venue}` : ''}
        </div>
        <span class="match-status status-live">🔴 LIVE</span>
      </div>
      <div class="scorecard-body">
        <div class="teams-score">
          <div class="team-score">
            <div class="team-name">${m.team1}</div>
            <div class="team-runs">${m.score1 || '0/0'}</div>
            <div class="team-overs">${m.overs1 || '0.0'} overs</div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="team-score">
            <div class="team-name">${m.team2}</div>
            <div class="team-runs">${m.score2 || 'Yet to bat'}</div>
            <div class="team-overs">${m.overs2 || ''}</div>
          </div>
        </div>
        ${m.commentary ? `<div class="match-result">${m.commentary}</div>` : ''}
        <div class="crr-info">
          ${m.crr ? `<div class="crr-item"><strong>${m.crr}</strong>CRR</div>` : ''}
          ${m.rrr ? `<div class="crr-item"><strong>${m.rrr}</strong>RRR</div>` : ''}
          ${m.lastWicket ? `<div class="crr-item"><strong>${m.lastWicket}</strong>Last Wicket</div>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function loadAllMatches() {
  const container = document.getElementById('allMatches');
  if (!container) return;
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  const completed = matches.filter(m => m.status === 'completed');
  if (completed.length === 0) {
    container.innerHTML = '<p style="color:#888;text-align:center;padding:30px">Abhi koi completed match nahi hai.</p>';
    return;
  }
  container.innerHTML = completed.map(m => `
    <div class="scorecard" style="margin-bottom:15px">
      <div class="scorecard-header">
        <div class="match-info">
          <strong>${m.matchName || 'Match'}</strong>
          ${m.date ? `📅 ${m.date}` : ''}
        </div>
        <span class="match-status status-completed">Completed</span>
      </div>
      <div class="scorecard-body">
        <div class="teams-score">
          <div class="team-score">
            <div class="team-name">${m.team1}</div>
            <div class="team-runs">${m.score1 || '0/0'}</div>
            <div class="team-overs">${m.overs1 || ''} overs</div>
          </div>
          <div class="vs-badge">VS</div>
          <div class="team-score">
            <div class="team-name">${m.team2}</div>
            <div class="team-runs">${m.score2 || '0/0'}</div>
            <div class="team-overs">${m.overs2 || ''} overs</div>
          </div>
        </div>
        ${m.result ? `<div class="match-result">🏆 ${m.result}</div>` : ''}
      </div>
    </div>
  `).join('');
}

loadLiveScores();
loadAllMatches();

// Auto-refresh live scores every 15 seconds
setInterval(() => {
  loadLiveScores();
}, 15000);

// ---- POINTS TABLE ----
function loadPointsTable() {
  const tbody = document.getElementById('pointsTableBody');
  if (!tbody) return;
  const teams = JSON.parse(localStorage.getItem('teams') || '[]');
  if (teams.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#888;padding:20px">Teams abhi register nahi hui hain.</td></tr>';
    return;
  }
  const sorted = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));
  tbody.innerHTML = sorted.map((t, i) => `
    <tr class="${i < 4 ? 'qualified' : ''} rank-${i+1}">
      <td><strong>${i + 1}</strong></td>
      <td>
        <div class="team-logo-cell">
          <div class="team-avatar">${t.name.substring(0, 2).toUpperCase()}</div>
          ${t.name}
        </div>
      </td>
      <td>${t.played || 0}</td>
      <td>${t.won || 0}</td>
      <td>${t.lost || 0}</td>
      <td>${t.nr || 0}</td>
      <td>${t.nrr || '+0.000'}</td>
      <td><strong>${t.points || 0}</strong></td>
      <td>${i < 4 ? '<span style="color:#27ae60;font-weight:600">✓ Qualified</span>' : '-'}</td>
    </tr>
  `).join('');
}
loadPointsTable();

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  });
}

const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
  });
  observer.observe(statsSection);
}

// ---- LOAD SCHEDULE ----
function loadSchedule() {
  const container = document.getElementById('scheduleList');
  if (!container) return;
  const matches = JSON.parse(localStorage.getItem('matches') || '[]');
  const upcoming = matches.filter(m => m.status === 'upcoming');
  if (upcoming.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:#888;padding:30px">Schedule jald announce kiya jaayega.</div>';
    return;
  }
  container.innerHTML = upcoming.map(m => {
    const d = m.date ? new Date(m.date) : null;
    return `
      <div class="schedule-item">
        <div class="schedule-date">
          <div class="day">${d ? d.getDate() : '?'}</div>
          <div class="month">${d ? d.toLocaleDateString('en-US', {month:'short'}) : ''}</div>
        </div>
        <div class="schedule-match">
          <h4>${m.team1} vs ${m.team2}</h4>
          <p>🕐 ${m.time || 'TBD'} &nbsp; 📍 ${m.venue || 'Chiraila Ground'}</p>
        </div>
        <span class="match-status status-upcoming">Upcoming</span>
      </div>
    `;
  }).join('');
}
loadSchedule();
