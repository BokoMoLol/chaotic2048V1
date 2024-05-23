document.addEventListener('DOMContentLoaded', () => {
    let boardSize = 5;
    let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    const gameBoard = document.getElementById('game-board');

    // Initialize game board
    function initializeBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                createTile(i, j);
            }
        }
        addRandomTile();
        addRandomTile();
        updateBoard();
    }

    // Create a tile element
    function createTile(row, col) {
        const tile = document.createElement('div');
        tile.id = `tile-${row}-${col}`;
        tile.className = 'tile';
        gameBoard.appendChild(tile);
    }

    // Add a random tile
    function addRandomTile() {
        let emptyTiles = [];
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (board[i][j] === 0) {
                    emptyTiles.push({ row: i, col: j });
                }
            }
        }

        if (emptyTiles.length > 0) {
            const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Update the game board UI
    function updateBoard() {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const tile = document.getElementById(`tile-${i}-${j}`);
                if (board[i][j] === -1) {
                    tile.textContent = 'X';
                    tile.style.backgroundColor = '#8b0000';
                } else {
                    tile.textContent = board[i][j] === 0 ? '' : board[i][j];
                    tile.style.backgroundColor = board[i][j] === 0 ? '#cdc1b4' : '#eee4da';
                }
            }
        }
    }

    // Modify the merge result based on the specified probabilities
    function modifyMergeResult(value) {
        const randomValue = Math.random();
        if (randomValue < 0.01) {
            return 69420; // 1% chance to change to 69420
        } else if (randomValue < 0.06) {
            return value; // 5% chance to stay the same
        } else if (randomValue < 0.16) {
            return value + 1; // 10% chance to add 1
        } else if (randomValue < 0.26) {
            return value - 1; // 10% chance to subtract 1
        } else if (randomValue < 0.31) {
            return -value; // 5% chance to multiply by -1
        }
        return value * 2; // Default merge behavior
    }

    // Handle grid expansion
    function expandGrid(direction) {
        if (direction === 'right' || direction === 'left') {
            boardSize++;
            for (let i = 0; i < board.length; i++) {
                board[i].push(0);
                createTile(i, boardSize - 1);
            }
            gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        } else {
            boardSize++;
            const newRow = Array(boardSize).fill(0);
            board.push(newRow);
            for (let j = 0; j < boardSize; j++) {
                createTile(boardSize - 1, j);
            }
            gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
        }
        updateBoard();
    }

    // Handle grid explosion
    function handleExplosion(row, col) {
        board[row][col] = -1;
    }

    // Move and merge tiles in the specified direction
    function move(direction) {
        let moved = false;

        for (let i = 0; i < boardSize; i++) {
            let row = board[i];
            if (direction === 'right' || direction === 'left') {
                row = board[i].slice();
            } else {
                row = board.map(r => r[i]);
            }

            if (direction === 'right' || direction === 'down') {
                row = row.reverse();
            }

            const filteredRow = row.filter(val => val !== 0 && val !== -1);
            for (let j = 0; j < filteredRow.length - 1; j++) {
                if (filteredRow[j] === filteredRow[j + 1]) {
                    const randomValue = Math.random();
                    if (randomValue < 0.02) {
                        handleExplosion(i, j); // 2% chance of explosion
                    } else {
                        filteredRow[j] = modifyMergeResult(filteredRow[j] * 2);
                    }
                    filteredRow.splice(j + 1, 1);
                    filteredRow.push(0);

                    if (randomValue >= 0.02 && randomValue < 0.07) {
                        expandGrid(direction); // 5% chance to expand grid
                    }
                }
            }

            while (filteredRow.length < boardSize) {
                filteredRow.push(0);
            }

            if (direction === 'right' || direction === 'down') {
                filteredRow.reverse();
            }

            for (let j = 0; j < boardSize; j++) {
                if (direction === 'right' || direction === 'left') {
                    if (board[i][j] !== filteredRow[j]) {
                        moved = true;
                    }
                    board[i][j] = filteredRow[j];
                } else {
                    if (board[j][i] !== filteredRow[j]) {
                        moved = true;
                    }
                    board[j][i] = filteredRow[j];
                }
            }
        }

        if (moved) {
            addRandomTile();
            updateBoard();
        }
    }

    // Handle key events for moving tiles
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    });

    // Initialize the game
    initializeBoard();
});
