// تنظیمات فایربیس شما
const firebaseConfig = {
    apiKey: "AIzaSyDTZ68yTUyrpoKJdVRQzY7ZJ2mUUrWv-PM",
    databaseURL: "https://my-online-game-91998-default-rtdb.europe-west1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUser = localStorage.getItem('chat_user');

// بررسی وجود نام کاربر از قبل
if (currentUser) {
    document.getElementById('login-overlay').classList.add('hidden');
    loadMessages();
}

function startChat() {
    const name = document.getElementById('username-input').value.trim();
    if (name) {
        currentUser = name;
        localStorage.setItem('chat_user', name);
        document.getElementById('login-overlay').classList.add('hidden');
        loadMessages();
    }
}

function sendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('msg-input');
    const text = input.value.trim();

    if (text) {
        db.ref('global_messages').push({
            sender: currentUser,
            message: text,
            timestamp: Date.now()
        });
        input.value = '';
    }
}

function loadMessages() {
    // گوش دادن به تغییرات دیتابیس (آنی)
    db.ref('global_messages').limitToLast(50).on('value', (snapshot) => {
        const msgArea = document.getElementById('chat-messages');
        msgArea.innerHTML = '';
        
        snapshot.forEach((child) => {
            const data = child.val();
            const div = document.createElement('div');
            const isMe = data.sender === currentUser;
            
            div.className = `msg ${isMe ? 'sent' : 'received'}`;
            div.innerHTML = `
                <span class="sender">${isMe ? 'شما' : data.sender}</span>
                <div class="text">${data.message}</div>
            `;
            msgArea.appendChild(div);
        });
        
        // اسکرول به آخرین پیام
        msgArea.scrollTop = msgArea.scrollHeight;
    });
}

function logout() {
    localStorage.removeItem('chat_user');
    location.reload();
}

