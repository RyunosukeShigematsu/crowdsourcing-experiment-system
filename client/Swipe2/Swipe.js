const track = document.getElementById('track');
const handle = document.getElementById('handle');
const arrowIcon = document.getElementById('arrowIcon');

let isDragging = false;
let startPointerX = 0;
let startPointerY = 0;
let startTime = 0;

// 初期位置：右上
let knobX = 149;
let knobY = 1;

let phase = 0; // 0: 下へ, 1: 左へ
let phaseStartX = 149;
let phaseStartY = 1;

// 右上 → 下 → 左
const segments = [
    { axis: 'y', direction: 1, length: 68, angle: 90 },
    { axis: 'x', direction: -1, length: 148, angle: 180 }
];

window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    window.onbeforeunload = () => "データが失われますがよろしいですか？";

    startTime = Date.now();
    updateHandlePosition();
    updateArrowDirection();
});

handle.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('mouseup', endDrag);

handle.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('touchmove', (e) => onDrag(e.touches[0]));
window.addEventListener('touchend', endDrag);

function startDrag(e) {
    isDragging = true;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
}

function onDrag(e) {
    if (!isDragging) return;

    const seg = segments[phase];
    if (!seg) return;

    const dx = e.clientX - startPointerX;
    const dy = e.clientY - startPointerY;

    if (seg.axis === 'x') {
        let progress = dx * seg.direction;
        progress = Math.max(0, Math.min(progress, seg.length));

        knobX = phaseStartX + progress * seg.direction;
        knobY = phaseStartY;

        updateHandlePosition();

        if (progress >= seg.length) {
            goNextPhase(e);
        }
    } else if (seg.axis === 'y') {
        let progress = dy * seg.direction;
        progress = Math.max(0, Math.min(progress, seg.length));

        knobX = phaseStartX;
        knobY = phaseStartY + progress * seg.direction;

        updateHandlePosition();

        if (progress >= seg.length) {
            goNextPhase(e);
        }
    }
}

function goNextPhase(e) {
    phase++;

    if (phase >= segments.length) {
        completeSwipe();
        return;
    }

    phaseStartX = knobX;
    phaseStartY = knobY;
    startPointerX = e.clientX;
    startPointerY = e.clientY;

    updateArrowDirection();
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    handle.style.transition = "left 0.3s ease, top 0.3s ease";

    // 初期位置に戻す
    knobX = 149;
    knobY = 1;
    phase = 0;
    phaseStartX = 149;
    phaseStartY = 1;

    updateHandlePosition();
    updateArrowDirection();

    setTimeout(() => {
        handle.style.transition = "none";
    }, 300);
}

function updateHandlePosition() {
    handle.style.left = `${knobX}px`;
    handle.style.top = `${knobY}px`;
}

function updateArrowDirection() {
    const seg = segments[phase];
    if (!seg) return;
    arrowIcon.style.transform = `rotate(${seg.angle}deg)`;
}

function completeSwipe() {
    if (!isDragging) return;
    isDragging = false;

    const duration = Date.now() - startTime;
    sessionStorage.setItem('swipe2_duration', duration);

    handle.style.backgroundColor = "#4CD964";
    window.onbeforeunload = null;

    setTimeout(() => {
        window.location.replace('../Display/Display.html');
    }, 500);
}