// Config
const CONFIG = {
    actionDuration:    3000,  // ms per action (base, before speed multiplier)
    pulseOutDuration:   500,  // ms: send-pulse class removal delay
    pulseInDuration:    700,  // ms: receive-pulse class removal delay
    flowFinishDelay:    500,  // ms: wait after emoji arrives before receivePulse
    emojiFadeDuration:  300,  // ms: emoji fade-out after arrival
    scheduleBuffer:    1500,  // ms: extra buffer added to auto-play interval
    scheduleBase:      4000,  // ms: minimum auto-play interval
};

// State — single source of truth for mutable runtime values
const state = { phase: 0, playing: false, speed: 2 };
const activeTimers = new Set();
const activeAnimations = new Set();

// DOM (stable nodes — cached once at script parse time)
const circleScene      = document.getElementById('circleScene');
const connectionLines  = document.querySelector('.connection-lines');
const phaseBadge       = document.getElementById('phaseBadge');
const phaseTitle       = document.getElementById('phaseTitle');
const phaseNumber      = document.getElementById('phaseNumber');
const phaseDesc        = document.getElementById('phaseDesc');
const phaseTTag        = document.getElementById('phaseTTag');
const actionList       = document.getElementById('actionList');
const timeline         = document.getElementById('timeline');
const phaseProgress    = document.getElementById('phaseProgress');
const playBtn          = document.getElementById('playBtn');
const playIcon         = document.getElementById('playIcon');
const pauseIcon        = document.getElementById('pauseIcon');
const prevBtn          = document.getElementById('prevBtn');
const nextBtn          = document.getElementById('nextBtn');
const resetBtn         = document.getElementById('resetBtn');
const speedBtns        = document.querySelectorAll('.speed-btn');

function safeTimeout(fn, delay) {
    const id = setTimeout(() => {
        activeTimers.delete(id);
        fn();
    }, delay);
    activeTimers.add(id);
    return id;
}

function clearAllTimers() {
    activeTimers.forEach(clearTimeout);
    activeTimers.clear();
}

function cleanupAnimations() {
    clearAllTimers();
    activeAnimations.forEach(a => { try { a.cancel(); } catch(e) {} });
    activeAnimations.clear();
    document.querySelectorAll('.flying-emoji').forEach(e => e.remove());
    connectionLines.innerHTML = '';
}

// DOM (dynamic nodes — populated after DOM is built in init)
let entityMap    = new Map();  // entityKey → .entity element
let timelineDots = [];         // ordered array of .timeline-dot elements

function init() {
    createTimeline();
    createPhaseProgress();

    // Cache entity elements by key for O(1) lookup
    document.querySelectorAll('.entity').forEach(e => {
        entityMap.set(e.dataset.entity, e);
    });
    // Cache timeline dots (created by createTimeline above)
    timelineDots = [...timeline.querySelectorAll('.timeline-dot')];

    updatePhase(false);
    setupEvents();
}

function createTimeline() {
    timeline.innerHTML = '';
    phases.forEach((p, i) => {
        const dot = document.createElement('div');
        dot.className = 'timeline-dot';
        dot.textContent = i + 1;
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `第 ${i + 1} 阶段: ${p.title}`);
        dot.onclick = () => goToPhase(i);
        dot.addEventListener('keydown', e => {
            if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); goToPhase(i); }
        });
        timeline.appendChild(dot);
        if (i < phases.length - 1) {
            const line = document.createElement('div');
            line.className = 'timeline-line';
            line.setAttribute('aria-hidden', 'true');
            timeline.appendChild(line);
        }
    });
}

function createPhaseProgress() {
    phaseProgress.innerHTML = '';
    phases.forEach((p, i) => {
        const dot = document.createElement('div');
        dot.className = 'phase-progress-dot';
        dot.id = `progress-${i}`;
        phaseProgress.appendChild(dot);
    });
}

function updatePhaseProgress() {
    phases.forEach((p, i) => {
        const dot = document.getElementById(`progress-${i}`);
        dot.classList.remove('active', 'past');
        if (i < state.phase) dot.classList.add('past');
        if (i === state.phase) dot.classList.add('active');
    });
}

function updatePhase(runAnimation = true) {
    cleanupAnimations();
    const phase = phases[state.phase];

    // Update info
    phaseBadge.textContent = phase.id;
    phaseTitle.textContent = phase.title + '阶段';
    phaseNumber.textContent = String(phase.id).padStart(2, '0');
    phaseDesc.textContent = phase.desc;
    phaseTTag.textContent = phase.tTag || '';

    // Update progress
    updatePhaseProgress();

    // Update actions
    const hasGroups = phase.actions.some(a => a.group);
    if (hasGroups) {
        const groups = { buyer: [], seller: [], all: [] };
        phase.actions.forEach(a => {
            const g = a.group || 'all';
            if (groups[g]) groups[g].push(a);
        });

        let html = '';
        if (groups.buyer.length > 0) {
            html += '<li class="action-group"><span class="group-label">买方</span></li>';
            html += groups.buyer.map(a => `
                <li class="action-item">
                    <span class="action-dot ${a.type}"></span>
                    <span>${a.text}</span>
                </li>
            `).join('');
        }
        if (groups.seller.length > 0) {
            html += '<li class="action-group"><span class="group-label">卖方</span></li>';
            html += groups.seller.map(a => `
                <li class="action-item">
                    <span class="action-dot ${a.type}"></span>
                    <span>${a.text}</span>
                </li>
            `).join('');
        }
        if (groups.all.length > 0) {
            html += groups.all.map(a => `
                <li class="action-item">
                    <span class="action-dot ${a.type}"></span>
                    <span>${a.text}</span>
                </li>
            `).join('');
        }
        actionList.innerHTML = html;
    } else {
        actionList.innerHTML = phase.actions.map(a => `
            <li class="action-item">
                <span class="action-dot ${a.type}"></span>
                <span>${a.text}</span>
            </li>
        `).join('');
    }

    // Update entities
    entityMap.forEach((el, key) => {
        el.classList.toggle('active', phase.active.includes(key));
    });

    // Update timeline
    timelineDots.forEach((dot, i) => {
        dot.classList.remove('active', 'past');
        if (i < state.phase) dot.classList.add('past');
        if (i === state.phase) dot.classList.add('active');
    });

    // Animate flows
    if (runAnimation) {
        animateFlows(phase.flows, phase.actions);
    }
}

function animateFlows(flows, actions) {
    if (flows.length === 0 && actions.length === 0) return;

    const actionDuration = CONFIG.actionDuration / state.speed;
    const flowCount = flows.length || 1;
    const duration = (actionDuration * actions.length) / flowCount;

    flows.forEach((flow, index) => {
        safeTimeout(() => {
            createFlyingEmoji(flow, duration);
        }, index * duration);
    });
}

function sendPulse(entityKey) {
    const entity = entityMap.get(entityKey);
    if (entity) {
        entity.classList.remove('sending');
        void entity.offsetWidth;
        entity.classList.add('sending');
        safeTimeout(() => entity.classList.remove('sending'), CONFIG.pulseOutDuration);
    }
}

function receivePulse(entityKey) {
    const entity = entityMap.get(entityKey);
    if (entity) {
        entity.classList.remove('receiving');
        void entity.offsetWidth;
        entity.classList.add('receiving');
        safeTimeout(() => entity.classList.remove('receiving'), CONFIG.pulseInDuration);
    }
}

function getFlowType(emoji) {
    if (emoji === '📈' || emoji === '📋' || emoji === '📉') return 'stock';
    if (emoji === '💰' || emoji === '💳') return 'money';
    return 'default';
}

function getEntityCenterPixels(entityKey) {
    const entity = entityMap.get(entityKey);
    const sceneRect = circleScene.getBoundingClientRect();
    const entityRect = entity.getBoundingClientRect();

    return {
        x: entityRect.left + entityRect.width / 2 - sceneRect.left,
        y: entityRect.top + entityRect.height / 2 - sceneRect.top
    };
}

function getEntityCenter(entityKey) {
    const entity = entityMap.get(entityKey);
    const sceneRect = circleScene.getBoundingClientRect();
    const entityRect = entity.getBoundingClientRect();

    return {
        x: entityRect.left + entityRect.width / 2 - sceneRect.left,
        y: entityRect.top + entityRect.height / 2 - sceneRect.top
    };
}

function createFlyingEmoji(flow, duration) {
    const fromPos = getEntityCenterPixels(flow.from);
    const toPos = getEntityCenterPixels(flow.to);
    const flowType = getFlowType(flow.emoji);

    sendPulse(flow.from);
    highlightConnectionLine(flow.from, flow.to, flowType);

    const emoji = document.createElement('div');
    emoji.className = 'flying-emoji emerge';
    emoji.textContent = flow.emoji;
    emoji.setAttribute('aria-hidden', 'true');
    emoji.style.setProperty('--duration', `${duration}ms`);

    if (flow.label) {
        const label = document.createElement('div');
        label.className = 'flow-label';
        label.textContent = flow.label;
        emoji.appendChild(label);
    }

    if (flowType === 'stock') {
        emoji.style.filter = 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.7))';
    } else if (flowType === 'money') {
        emoji.style.filter = 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.7))';
    } else {
        emoji.style.filter = 'drop-shadow(0 0 12px rgba(212, 168, 83, 0.7))';
    }

    emoji.style.left = fromPos.x + 'px';
    emoji.style.top = fromPos.y + 'px';

    const animation = emoji.animate([
        { left: fromPos.x + 'px', top: fromPos.y + 'px', offset: 0 },
        { left: toPos.x + 'px', top: toPos.y + 'px', offset: 1 }
    ], {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
    });
    activeAnimations.add(animation);

    circleScene.appendChild(emoji);

    animation.onfinish = () => {
        activeAnimations.delete(animation);
        safeTimeout(() => {
            receivePulse(flow.to);
            emoji.style.transition = 'opacity 0.3s ease';
            emoji.style.opacity = '0';
            safeTimeout(() => {
                emoji.remove();
                connectionLines.innerHTML = '';
            }, CONFIG.emojiFadeDuration);
        }, CONFIG.flowFinishDelay);
    };
}

function highlightConnectionLine(from, to, flowType) {
    connectionLines.innerHTML = '';

    const fromPos = getEntityCenter(from);
    const toPos = getEntityCenter(to);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', 'connection-line active');
    line.setAttribute('x1', fromPos.x);
    line.setAttribute('y1', fromPos.y);
    line.setAttribute('x2', toPos.x);
    line.setAttribute('y2', toPos.y);

    if (flowType === 'stock') line.classList.add('stock-flow');
    else if (flowType === 'money') line.classList.add('money-flow');

    connectionLines.appendChild(line);
}

function goToPhase(index) {
    state.phase = Math.max(0, Math.min(index, phases.length - 1));
    updatePhase();
}

function nextPhase() {
    if (state.phase < phases.length - 1) {
        state.phase++;
        updatePhase();
    } else {
        pause();
    }
}

function prevPhase() {
    if (state.phase > 0) {
        state.phase--;
        updatePhase();
    }
}

function play() {
    if (state.phase >= phases.length - 1) {
        state.phase = 0;
        updatePhase();
    }
    state.playing = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    playBtn.setAttribute('aria-label', '暂停');
    scheduleNextPhase();
}

function scheduleNextPhase() {
    if (!state.playing) return;

    if (state.phase >= phases.length - 1) {
        pause();
        return;
    }

    const nextPhaseData = phases[state.phase + 1];
    const actionCount = nextPhaseData.actions.length || 1;
    const minInterval = actionCount * CONFIG.actionDuration + CONFIG.scheduleBuffer;
    const interval = Math.max(minInterval, CONFIG.scheduleBase) / state.speed;

    safeTimeout(() => {
        if (state.playing) {
            state.phase++;
            updatePhase();
            scheduleNextPhase();
        }
    }, interval);
}

function pause() {
    state.playing = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playBtn.setAttribute('aria-label', '播放');
    clearAllTimers();
}

function togglePlay() {
    state.playing ? pause() : play();
}

function reset() {
    pause();
    state.phase = 0;
    updatePhase();
}

function setSpeed(s) {
    state.speed = s;
    speedBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.speed) === state.speed));
    if (state.playing) {
        pause();
        play();
    }
}

function setupEvents() {
    playBtn.onclick = togglePlay;
    prevBtn.onclick = prevPhase;
    nextBtn.onclick = nextPhase;
    resetBtn.onclick = reset;
    speedBtns.forEach(b => b.onclick = () => setSpeed(parseInt(b.dataset.speed)));

    document.addEventListener('keydown', e => {
        if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
        else if (e.code === 'ArrowRight') nextPhase();
        else if (e.code === 'ArrowLeft') prevPhase();
    });
}

init();
