function renderBoard() {
    const boardDiv = document.getElementById('board');
    const size = currentGame === 'tictactoe' ? 3 : 4;
    boardDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardDiv.innerHTML = "";
    
    for(let i=0; i < size*size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.onclick = () => handleMove(i);
        boardDiv.appendChild(cell);
    }
}

function handleMove(index) {
    if(currentMode === 'online') {
        db.ref(`rooms/${roomId}`).once('value', snap => {
            const data = snap.val();
            if(data.turn === myRole && data.board[index] === "") {
                const newBoard = [...data.board];
                newBoard[index] = myRole === 'p1' ? 'X' : 'O';
                db.ref(`rooms/${roomId}`).update({
                    board: newBoard,
                    turn: myRole === 'p1' ? 'p2' : 'p1'
                });
                startTimer(); // ریست تایمر بعد حرکت
            }
        });
    } else {
        // منطق آفلاین و ربات اینجا قرار می‌گیرد
        alert("در حال توسعه بخش آفلاین...");
    }
}

function updateUI(data) {
    const cells = document.querySelectorAll('.cell');
    data.board.forEach((val, i) => {
        cells[i].innerText = val;
    });
    document.getElementById('turn-info').innerText = (data.turn === myRole) ? "نوبت شماست" : "نوبت حریف";
}
