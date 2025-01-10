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
            
            // Add fade-in animation when placing mark
            cell.classList.add('animate-fade-in');
            
            if (this.checkWin()) {
                this.handleWin();
            } else if (this.checkDraw()) {
                this.handleDraw();
            } else {
                // Add wiggle animation on player switch
                cell.classList.add('animate-wiggle');
                setTimeout(() => {
                    cell.classList.remove('animate-wiggle');
                }, 500);
                
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
        this.statusMessage.classList.add('animate-celebrate', 'text-green-600', 'font-bold');
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.celebrateWin();
    }

    celebrateWin() {
        // Trigger confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Add celebration animation to winning cells
        this.winPatterns.forEach(pattern => {
            const line = pattern.map(index => this.board[index]);
            if (line.every(mark => mark === this.currentPlayer)) {
                pattern.forEach((index, i) => {
                    setTimeout(() => {
                        this.cells[index].classList.add('animate-celebrate', 'bg-green-100', 'text-green-800');
                    }, i * 100); // Stagger the animations
                });
            }
        });

        // Animate score update
        const scoreElement = document.getElementById(`score-${this.currentPlayer.toLowerCase()}`);
        scoreElement.classList.add('animate-wiggle', 'text-green-600');
        setTimeout(() => {
            scoreElement.classList.remove('animate-wiggle', 'text-green-600');
        }, 1000);
    }

    handleDraw() {
        this.gameActive = false;
        this.statusMessage.textContent = "It's a Draw!";
        this.statusMessage.classList.add('animate-wiggle', 'text-blue-600');
        
        // Add subtle animation to all cells
        this.cells.forEach(cell => {
            cell.classList.add('animate-pulse-scale', 'bg-blue-50');
        });
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
        
        // Reset all animations and classes
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove(
                'animate-pulse-scale', 
                'animate-celebrate', 
                'animate-wiggle',
                'animate-fade-in',
                'bg-green-100', 
                'text-green-800'
            );
        });
        
        // Reset status message styling
        this.statusMessage.classList.remove('animate-celebrate', 'text-green-600', 'font-bold');
        this.updateStatus();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 
