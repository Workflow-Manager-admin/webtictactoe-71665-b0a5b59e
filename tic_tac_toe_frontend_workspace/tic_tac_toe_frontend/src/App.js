import React, { useState, useCallback } from "react";
import "./App.css";

/**
 * Main App component that contains the Tic Tac Toe board, header, game status, and restart button.
 * UI is modern, minimal, responsive, uses a light theme, and prescribed color palette.
 */
// PUBLIC_INTERFACE
function App() {
  // Board is 9 cells (string: "", "X" or "O")
  const [board, setBoard] = useState(Array(9).fill(""));
  // X always starts
  const [xIsNext, setXIsNext] = useState(true);
  // "X", "O" or "tie" when concluded, null when ongoing
  const [winner, setWinner] = useState(null);
  // A toggle for minimal visual animation feedback
  const [lastMove, setLastMove] = useState(null);

  // Winning line indices for animation highlight
  const [winningLine, setWinningLine] = useState([]);

  // Board reset logic
  // PUBLIC_INTERFACE
  const handleRestart = useCallback(() => {
    setBoard(Array(9).fill(""));
    setXIsNext(true);
    setWinner(null);
    setWinningLine([]);
    setLastMove(null);
  }, []);

  // Handles cell click
  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    if (board[idx] !== "" || winner) return;
    // Place current player's symbol
    const updated = board.slice();
    updated[idx] = xIsNext ? "X" : "O";
    setBoard(updated);
    setLastMove(idx);

    // Check win or tie
    const winCheck = calculateWinner(updated);
    if (winCheck) {
      setWinner(winCheck.winner);
      setWinningLine(winCheck.line);
    } else if (updated.every((cell) => cell)) {
      setWinner("tie");
    } else {
      setXIsNext((x) => !x);
    }
  };

  // Compute the displayed game status
  let statusMsg;
  if (winner === "X") {
    statusMsg = "X wins!";
  } else if (winner === "O") {
    statusMsg = "O wins!";
  } else if (winner === "tie") {
    statusMsg = "It's a tie!";
  } else {
    statusMsg = `Turn: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="ttt-bg">
      <div className="ttt-center-area">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {board.map((cell, idx) => {
            const highlight =
              winningLine.includes(idx)
                ? "ttt-cell-win"
                : (lastMove === idx && !winner) ? "ttt-cell-last" : "";
            // Minimal 'pop' animation on play, shimmer highlight on win
            return (
              <button
                key={idx}
                className={`ttt-cell ${highlight}`}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== "" || !!winner}
                aria-label={
                  cell
                    ? `Cell ${idx + 1}, occupied by ${cell}`
                    : `Cell ${idx + 1}: Empty`
                }
                tabIndex={cell !== "" ? -1 : 0}
              >
                <span className={`ttt-mark${cell ? " ttt-mark-pop" : ""}`}>
                  {cell}
                </span>
              </button>
            );
          })}
        </div>
        <div className="ttt-status" aria-live="polite">
          {statusMsg}
        </div>
        <button
          className="ttt-reset-btn"
          onClick={handleRestart}
          aria-label="Restart or start a new game"
        >
          {winner ? "New Game" : "Restart"}
        </button>
        <footer className="ttt-footer">
          <span>
            Minimal Tic Tac Toe &mdash;{" "}
            <strong>
              <span style={{ color: "#1976d2" }}>#1976d2</span>{" "}
              <span style={{ color: "#ff9800" }}>#ff9800</span>{" "}
              <span style={{ color: "#424242" }}>#424242</span>
            </strong>
          </span>
        </footer>
      </div>
    </div>
  );
}

/**
 * Calculates game winner/tie and winning line (for highlight).
 * @param {string[]} squares - current board
 * @returns {null|{winner: 'X'|'O', line: number[]}}
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let l of lines) {
    const [a, b, c] = l;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: l };
    }
  }
  return null;
}

export default App;
