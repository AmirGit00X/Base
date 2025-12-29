// تنظیمات فایربیس شما
const firebaseConfig = {
    apiKey: "AIzaSyDTZ68yTUyrpoKJdVRQzY7ZJ2mUUrWv-PM",
    databaseURL: "https://my-online-game-91998-default-rtdb.europe-west1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let user = "";
let currentGame = "";
let currentMode = "";
let roomId = null;
let myRole = ""; // p1 or p2
let timerVal = 60;
let timerInt;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function login() {
    user = document.getElementById('username-in').value;
    if(!user) return alert("نام را وارد کنید");
    document.getElementById('user-tag').innerText = "سلام " + user;
    showScreen('menu-screen');
}

function openSubMenu(game) {
    currentGame = game;
    document.getElementById('game-title').innerText = "بازی " + (game==='tictactoe' ? 'دوز ۳ تایی' : 'دوز ۴ تایی');
    showScreen('mode-screen');
}

function startMode(mode) {
    currentMode = mode;
    if(mode === 'online') {
        showScreen('lobby-screen');
        listenRooms();
    } else {
        initLocalGame();
    }
}

// --- مدیریت بخش آنلاین ---
function listenRooms() {
    db.ref('rooms').on('value', snap => {
        const list = document.getElementById('rooms-list');
        list.innerHTML = "";
        snap.forEach(child => {
            const room = child.val();
            if(room.status === 'open') {
                const b = document.createElement('button');
                b.innerText = `میز ${room.creator} (کد:${child.key.slice(-4)})`;
                b.onclick = () => joinRoom(child.key);
                list.appendChild(b);
            }
        });
    });
}

function createRoom() {
    const newRoomRef = db.ref('rooms').push();
    roomId = newRoomRef.key;
    myRole = "p1";
    newRoomRef.set({
        creator: user,
        status: 'open',
        board: Array(currentGame === 'tictactoe' ? 9 : 16).fill(""),
        turn: 'p1',
        gameType: currentGame,
        p1_online: true
    });
    waitForPlayer();
}

function joinRoom(id) {
    roomId = id;
    myRole = "p2";
    db.ref(`rooms/${id}`).update({
        status: 'playing',
        p2_online: true,
        p2_name: user
    });
    startGame();
}

function waitForPlayer() {
    alert("منتظر حریف بمانید...");
    db.ref(`rooms/${roomId}/status`).on('value', snap => {
        if(snap.val() === 'playing') startGame();
    });
}

function startGame() {
    showScreen('game-screen');
    renderBoard();
    startTimer();
    // مانیتور کردن حرکات حریف
    db.ref(`rooms/${roomId}`).on('value', snap => {
        const data = snap.val();
        if(!data) return;
        updateUI(data);
    });
}

function startTimer() {
    clearInterval(timerInt);
    timerVal = 60;
    timerInt = setInterval(() => {
        timerVal--;
        document.getElementById('timer').innerText = timerVal;
        if(timerVal <= 0) {
            alert("زمان شما تمام شد! باختید.");
            leaveGame();
        }
    }, 1000);
}

function leaveGame() {
    if(roomId) db.ref(`rooms/${roomId}`).remove();
    clearInterval(timerInt);
    location.reload();
}
