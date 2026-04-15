const track = document.getElementById('track');
const handle = document.getElementById('handle');
const arrowIcon = document.getElementById('arrowIcon');

let isDragging = false;
let startPointerX = 0;
let startProgress = 0;
let startTime = 0;

// 二次ベジェ曲線の3点
const P0 = { x: 30,  y: 95 }; // 左下
const P1 = { x: 120, y: -45 }; // 上中央（制御点）
const P2 = { x: 210, y: 95 }; // 右下

const handleRadius = 25;
let progress = 0; // 0 ~ 1

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
    startProgress = progress;
}

function onDrag(e) {
    if (!isDragging) return;

    const dx = e.clientX - startPointerX;

    // 横移動量を progress に変換
    let nextProgress = startProgress + dx / (P2.x - P0.x);
    nextProgress = Math.max(0, Math.min(nextProgress, 1));

    progress = nextProgress;

    updateHandlePosition();
    updateArrowDirection();

    if (progress >= 0.98) {
        progress = 1;
        updateHandlePosition();
        updateArrowDirection();
        completeSwipe();
    }
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    handle.style.transition = "left 0.3s ease, top 0.3s ease";

    progress = 0;
    updateHandlePosition();
    updateArrowDirection();

    setTimeout(() => {
        handle.style.transition = "none";
    }, 300);
}

function getBezierPoint(t) {
    const x =
        (1 - t) * (1 - t) * P0.x +
        2 * (1 - t) * t * P1.x +
        t * t * P2.x;

    const y =
        (1 - t) * (1 - t) * P0.y +
        2 * (1 - t) * t * P1.y +
        t * t * P2.y;

    return { x, y };
}

function getBezierTangent(t) {
    const dx =
        2 * (1 - t) * (P1.x - P0.x) +
        2 * t * (P2.x - P1.x);

    const dy =
        2 * (1 - t) * (P1.y - P0.y) +
        2 * t * (P2.y - P1.y);

    return { dx, dy };
}

function updateHandlePosition() {
    const point = getBezierPoint(progress);
    handle.style.left = `${point.x - handleRadius}px`;
    handle.style.top = `${point.y - handleRadius}px`;
}

function updateArrowDirection() {
    const tangent = getBezierTangent(progress);
    const angleDeg = Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI;
    arrowIcon.style.transform = `rotate(${angleDeg}deg)`;
}

function completeSwipe() {
    if (!isDragging) return;
    isDragging = false;

    const duration = Date.now() - startTime;
    sessionStorage.setItem('swipe3_duration', duration);

    handle.style.backgroundColor = "#4CD964";
    window.onbeforeunload = null;

    setTimeout(() => {
        window.location.replace('../Display/Display.html');
    }, 500);
}