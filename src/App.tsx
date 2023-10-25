// IMPORTS
import React, { useState, useEffect } from 'react';
import './App.css';

// POSSÍVEIS JOGADORES
type SquareValue = 'X' | 'O' | null;

// COMBINAÇÕES DE VITÓRIA
const winningCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// 9 QUADRADOS PREENCHIDOS INICIALMENTE EM BRANCO(null)
const initialState: SquareValue[] = Array(9).fill(null);


// VERIFICA CADA QUADRADO E RETORNA O VERCEDOR 
const calculateWinner = (squares: SquareValue[]): SquareValue | null => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

// VERIFICA OS QUADRADOS VAZIOS E ADICIONA UM MOVIMENTO NO TABULEIRO
const getAvailableMoves = (squares: SquareValue[]): number[] => {
  const moves: number[] = [];
  squares.forEach((square, index) => {
    if (square === null) {
      moves.push(index);
    }
  });
  return moves;
};

// NÍVEIS DE DIFICULDE
const MINIMAX_DEPTH = 5;

// FUNÇÃO MINIMAX
const minMax = (squares: SquareValue[], depth: number, maximizingPlayer: boolean): number => {
  const winner = calculateWinner(squares);
  if (winner) {
    return winner === 'X' ? depth - 10 : 10 - depth;
  }

  if (depth >= MINIMAX_DEPTH) {
    return 0;
  }

  const availableMoves = getAvailableMoves(squares);

  if (maximizingPlayer) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      squares[move] = 'O';
      const score = minMax(squares, depth + 1, false);
      squares[move] = null;
      bestScore = Math.max(bestScore, score);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      squares[move] = 'X';
      const score = minMax(squares, depth + 1, true);
      squares[move] = null;
      bestScore = Math.min(bestScore, score);
    }
    return bestScore;
  }
};

// INDICA SE É A VEZ DO JOGADOR OU DA IA
const App: React.FC = () => {
  const [squares, setSquares] = useState<SquareValue[]>(initialState);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

// FAZ COM QUE A IA CONTINUE JOGANDO ATE QUE TENHA UM VENCEDOR
  useEffect(() => {
    if (!isPlayerTurn && !calculateWinner(squares)) {
      const availableMoves = getAvailableMoves(squares);
      setTimeout(() => {
        const bestMove = minimaxMove(squares, availableMoves);
        makeMove(bestMove);
      }, 1000);  // ATRASO DE 1 SEGUNDO
    }
  }, [isPlayerTurn, squares]);

// VALIDA A JOGADA DO JOGADOR HUMANO
  const handleSquareClick = (index: number) => {
    if (squares[index] || calculateWinner(squares)) return;
    if (!isPlayerTurn) return;

    const newSquares = [...squares];
    newSquares[index] = 'X';
    setSquares(newSquares);
    setIsPlayerTurn(false);
  };

// VALIDA A JOGADA DA IA
  const makeMove = (index: number) => {
    const newSquares = [...squares];
    newSquares[index] = 'O';
    setSquares(newSquares);
    setIsPlayerTurn(true);
  };

// DETERMINA O MELHOR MOVIMENTO PARA A IA COM MINIMAX
  const minimaxMove = (currentSquares: SquareValue[], availableMoves: number[]): number => {
    let bestMove = -1;
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const newSquares = [...currentSquares];
      newSquares[move] = 'O';
      const score = minMax(newSquares, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  };

// RENDERIZA OS QUADRADOS DO TABULEIRO
  const renderSquare = (index: number) => (
    <button className="square" onClick={() => handleSquareClick(index)}>
      {squares[index]}
    </button>
  );

// VERIFICA SE HÁ UM VENCEDOR
  const winner = calculateWinner(squares);

// ESTRUTURA DO JOGO
  return (
    <div className="game">
      <div className="board">
        {squares.map((_, index) => (
          <div key={index}>{renderSquare(index)}</div>
        ))}
      </div>
      <div className="status">
        {winner ? `VENCEDOR: ${winner}` : squares.every(square => square !== null) ? 'EMPATE' : isPlayerTurn ? 'Seu turno' : 'IA está pensando...'}
      </div>
      <button className="reiniciar" onClick={() => setSquares(initialState)}>
        REINICIAR
      </button>
    </div>
  );
};

export default App;

