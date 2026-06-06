/* Display.js */

// ==========================================
// 表示タイプ
// ==========================================
const currentDisplayType = 'flag';

// 表示タスクの種類を保存
sessionStorage.setItem('display_type', currentDisplayType);

console.log(`今回の表示タスク -> Type: ${currentDisplayType}`);

// ==========================================
// 要素の取得
// ==========================================
const showBtn = document.getElementById('showBtn');
const flagContainer = document.getElementById('flagContainer');
const instructionText = document.getElementById('instructionText');

// ==========================================
// ページ読み込み時の初期設定
// ==========================================
window.addEventListener('DOMContentLoaded', () => {

    // 戻るボタン対策
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => history.go(1));
    window.onbeforeunload = () => "データが失われますがよろしいですか？";

    // 説明文
    instructionText.innerHTML = `日本の国旗が表示されます。<br>表示を見てください。`;

    // ページに入った時刻を保存
    sessionStorage.setItem('display2_page_load_time', Date.now());
});

// ==========================================
// ボタンクリック時の動作
// ==========================================
showBtn.addEventListener('click', () => {
    // リロード警告を解除
    window.onbeforeunload = null;

    // ボタンを押した時刻を保存
    const displayStartTime = Date.now();
    sessionStorage.setItem('display2_start_time', displayStartTime);

    // 国旗を表示
    flagContainer.classList.remove('hidden');

    // ボタンを無効化
    showBtn.disabled = true;

    // 1秒後に次の画面へ遷移
    setTimeout(() => {
        const displayEndTime = Date.now();

        sessionStorage.setItem('display2_end_time', displayEndTime);
        sessionStorage.setItem('display2_stay_time_ms', displayEndTime - displayStartTime);

        window.location.replace('../Swipe2/Swipe.html');
    }, 1000);
});