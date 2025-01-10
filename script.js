class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.playerNames = { X: 'Player X', O: 'Player O' };
        
        this.winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        this.cells = document.querySelectorAll('.cell');
        this.statusMessage = document.getElementById('status-message');
        this.resetButton = document.getElementById('reset-button');
        this.playerModal = document.getElementById('player-modal');
        
        this.initializeGame();
    }

    initializeGame() {
        // Set up the player name modal
        document.getElementById('start-game').addEventListener('click', () => {
            const playerXName = document.getElementById('player-x').value.trim() || 'Player X';
            const playerOName = document.getElementById('player-o').value.trim() || 'Player O';
            
            this.playerNames.X = playerXName;
            this.playerNames.O = playerOName;
            
            // Update display names
            document.getElementById('player-x-name').textContent = playerXName;
            document.getElementById('player-o-name').textContent = playerOName;
            
            // Hide the modal
            this.playerModal.classList.add('hidden');
            
            // Update initial status message
            this.updateStatus();
        });

        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;

        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.classList.add('animate-bounce-once');
            
            if (this.checkWin()) {
                this.handleWin();
            } else if (this.checkDraw()) {
                this.handleDraw();
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateStatus();
            }
        }
    }

    checkWin() {
        return this.winPatterns.some(pattern => {
            const line = pattern.map(index => this.board[index]);
            const win = line.every(mark => mark === this.currentPlayer);
            
            if (win) {
                pattern.forEach(index => {
                    this.cells[index].classList.add('animate-pulse-scale', 'bg-green-100', 'text-green-800');
                });
            }
            
            return win;
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    handleWin() {
        this.gameActive = false;
        this.statusMessage.textContent = `${this.playerNames[this.currentPlayer]} Wins!`;
        this.scores[this.currentPlayer]++;
        this.updateScores();
    }

    handleDraw() {
        this.gameActive = false;
        this.statusMessage.textContent = "It's a Draw!";
    }

    updateStatus() {
        this.statusMessage.textContent = `${this.playerNames[this.currentPlayer]}'s Turn`;
    }

    updateScores() {
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('animate-pulse-scale', 'bg-green-100', 'text-green-800', 'animate-bounce-once');
        });
        
        this.updateStatus();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 