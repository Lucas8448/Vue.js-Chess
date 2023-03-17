<template>
  <h2 v-if="turn == 0">White Move</h2>
  <h2 v-else>Black Move</h2>
  <div class="chess">
    <table>
      <tr v-for="(row, i) in board" :key="row" :class="{ 'evenRow': i % 2 == 0, 'oddRow': i % 2 != 0 }">
        <td v-for="(cell, j) in row" :key="cell"
          :class="{ 'evenTile': j % 2 == 0, 'oddTile': j % 2 != 0, 'move': cell == '*' }" @click="squareSelected(i, j)">
          <Piece :piece="cell" v-if="cell != '' && cell != '*'" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { createChessModel } from './chessModel';
import { predictMove } from './bestMove';
import { trainModel } from './trainModel'; // Import the trainModel function
import { ref, onUnmounted } from 'vue';
import Piece from './components/Piece.vue';
import { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import * as d3 from 'd3';
import { loadGraphModel } from '@tensorflow/tfjs-converter';


export default {
  name: 'App',
  components: {
    Piece
  },
  data() {
    return {
      tensorsToDispose: [],
      model: null,
      turn: 0,
      movePiece: null,
      startMove: null,
      validPieces: ['wP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'bP', 'bR', 'bN', 'bB', 'bQ', 'bK'],
      board: [['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'], ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'], ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR']]
    }
  },
  setup() {
    console.log('Entering setup');
    const tensorsToDispose = []; // Create an array to store tensors
    tf.setBackend('webgl');
    // Make sure to dispose of tensors when the component is unmounted
    onUnmounted(() => {
      tensorsToDispose.forEach(tensor => tensor.dispose());
      trainingDataTensor.dispose();
      labelsTensor.dispose();
    });
  },
  mounted() {
    console.log('Entering mounted');
    this.model = loadGraphModel('model.json');
    // Load the training data and labels here
    const { trainingData, labels } = this.loadTrainingData();
    const trainingDataTensor = tf.tensor2d(trainingData, [trainingData.length, 64]);
    const labelsTensor = tf.tensor2d(labels, [labels.length, 64]);
    const epochs = 10;

    // Train the model and make predictions
    trainModel(this.model, trainingData, labels, epochs).then(() => {
      console.log('Training complete');
      // Make predictions after training
    });
  },
  methods: {
    async loadTrainingData() {
      const trainingData = [];
      const labels = [];
      const data = await d3.csv('trainingData.csv');
    
      data.forEach(row => {
        const boardState = [];
        const nextMove = [];
    
        for (let i = 0; i < 64; i++) {
          boardState.push(row[`board_${i}`]);
          nextMove.push(row[`move_${i}`]);
        }
    
        trainingData.push(boardState);
        labels.push(nextMove);
        
        console.log(boardState)
        console.log(nextMove)
      });
    
      return { trainingData, labels };
    },
    isPiece(piece) {
      return this.validPieces.includes(piece)
    },
    isWhite(piece) {
      return piece[0] == 'w'
    },
    isBlack(piece) {
      return piece[0] == 'b'
    },
    isPawn(piece) {
      return piece[1] == 'P'
    },
    isRook(piece) {
      return piece[1] == 'R'
    },
    isKnight(piece) {
      return piece[1] == 'N'
    },
    isBishop(piece) {
      return piece[1] == 'B'
    },
    isKing(piece) {
      return piece[1] == 'K'
    },
    isQueen(piece) {
      return piece[1] == 'Q'
    },
    pieceType(row, col) {
      return this.board[row][col][1]
    },
    // check if the piece is in the same team as the turn
    isSameTeam(piece) {
      if (this.turn == 0) {
        return this.isWhite(piece)
      } else {
        return this.isBlack(piece)
      }
    },
    handleCastling(startRow, startCol, endRow, endCol) {
      const rookCol = endCol < startCol ? 0 : 7;
      const newRookCol = endCol < startCol ? 3 : 5;
      this.board[startRow][rookCol] = '';
      this.board[startRow][newRookCol] = this.turn === 0 ? 'wR' : 'bR';
    },
    handlePawnPromotion(row, col) {
      const piece = this.turn === 0 ? 'wQ' : 'bQ';
      this.board[row][col] = piece;
    },
    isLegalMove(startRow, startCol, endRow, endCol, pieceTypeOverride = null) {
      const startPiece = pieceTypeOverride ? pieceTypeOverride : this.board[startRow][startCol];
      if (!startPiece || (startRow === endRow && startCol === endCol)) {
        return false;
      }
      const pieceType = pieceTypeOverride ? pieceTypeOverride[1] : startPiece[1];
      const rowDiff = Math.abs(endRow - startRow);
      const colDiff = Math.abs(endCol - startCol);
      switch (pieceType) {
        case 'P': // Pawn
          if (this.isWhite(startPiece)) {
            if (
              (startCol === endCol && endRow === startRow + 1 && !this.board[endRow][endCol]) ||
              (startRow === 1 && startCol === endCol && endRow === startRow + 2 && !this.board[endRow][endCol] && !this.board[startRow + 1][startCol]) ||
              (rowDiff === 1 && colDiff === 1 && this.isBlack(this.board[endRow][endCol]))
            ) {
              return true;
            }
          } else {
            if (
              (startCol === endCol && endRow === startRow - 1 && !this.board[endRow][endCol]) ||
              (startRow === 6 && startCol === endCol && endRow === startRow - 2 && !this.board[endRow][endCol] && !this.board[startRow - 1][startCol]) ||
              (rowDiff === 1 && colDiff === 1 && this.isWhite(this.board[endRow][endCol]))
            ) {
              return true;
            }
          }
          if (this.isPawn(startPiece) && colDiff === 1 && rowDiff === 1 && !this.board[endRow][endCol]) {
            const lastMoveStartRow = this.lastMove ? this.lastMove.start.row : -1;
            const lastMoveStartCol = this.lastMove ? this.lastMove.start.col : -1;
            const lastMoveEndRow = this.lastMove ? this.lastMove.end.row : -1;
            const lastMoveEndCol = this.lastMove ? this.lastMove.end.col : -1;
            if (this.turn === 0 && startRow === 4 && endRow === 5 && this.board[startRow][endCol] === 'bP' && lastMoveStartRow === 6 && lastMoveEndRow === 4 && lastMoveStartCol === endCol && lastMoveEndCol === endCol) {
              return true;
            } else if (this.turn === 1 && startRow === 3 && endRow === 2 && this.board[startRow][endCol] === 'wP' && lastMoveStartRow === 1 && lastMoveEndRow === 3 && lastMoveStartCol === endCol && lastMoveEndCol === endCol) {
              return true;
            }
          }
          return false;
        case 'R': // Rook
          if (startRow === endRow || startCol === endCol) {
            const rowStep = startRow === endRow ? 0 : (endRow - startRow) / Math.abs(endRow - startRow);
            const colStep = startCol === endCol ? 0 : (endCol - startCol) / Math.abs(endCol - startCol);
            let currentRow = startRow + rowStep;
            let currentCol = startCol + colStep;

            while (currentRow !== endRow || currentCol !== endCol) {
              if (this.board[currentRow][currentCol]) {
                return false;
              }
              currentRow += rowStep;
              currentCol += colStep;
            }

            return true;
          }
          return false;
        case 'N': // Knight
          if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
            return true;
          }
          return false;

        case 'B': // Bishop
          if (rowDiff === colDiff) {
            const rowStep = (endRow - startRow) / rowDiff;
            const colStep = (endCol - startCol) / colDiff;
            let currentRow = startRow + rowStep;
            let currentCol = startCol + colStep;

            while (currentRow !== endRow || currentCol !== endCol) {
              if (this.board[currentRow][currentCol]) {
                return false;
              }
              currentRow += rowStep;
              currentCol += colStep;
            }

            return true;
          }
          return false;

        case 'K': // King
          if ((rowDiff === 1 && colDiff <= 1) || (colDiff === 1 && rowDiff <= 1)) {
            return true;
          }
          return false;

        case 'Q': // Queen
          if (startRow === endRow || startCol === endCol || rowDiff === colDiff) {
            const rowStep = startRow === endRow ? 0 : (endRow - startRow) / Math.abs(endRow - startRow);
            const colStep = startCol === endCol ? 0 : (endCol - startCol) / Math.abs(endCol - startCol);
            let currentRow = startRow + rowStep;
            let currentCol = startCol + colStep;

            while (currentRow !== endRow || currentCol !== endCol) {
              if (this.board[currentRow][currentCol]) {
                return false;
              }
              currentRow += rowStep;
              currentCol += colStep;
            }

            return true;
          }
          return false;

      }
      return false;
    },
    squareSelected(row, col) {
      if (!this.startMove && this.isSameTeam(this.board[row][col])) {
        this.startMove = [row, col];
        this.movePiece = this.board[row][col];
        return;
      }

      if (this.startMove && this.isLegalMove(this.startMove[0], this.startMove[1], row, col)) {
        const startRow = this.startMove[0];
        const startCol = this.startMove[1];
        const endRow = row;
        const endCol = col;
        const rowDiff = Math.abs(endRow - startRow);
        const colDiff = Math.abs(endCol - startCol);

        // Handle en passant
        if (this.isPawn(this.movePiece) && colDiff === 1 && rowDiff === 1 && !this.board[endRow][endCol]) {
          this.board[startRow][endCol] = '';
        }

        // Handle castling
        if (this.isKing(this.movePiece) && colDiff === 2 && rowDiff === 0) {
          this.handleCastling(startRow, startCol, endRow, endCol);
        }

        this.board[endRow][endCol] = this.movePiece;
        this.board[startRow][startCol] = '';

        // Handle pawn promotion
        if (this.isPawn(this.movePiece) && (endRow === 0 || endRow === 7)) {
          this.handlePawnPromotion(endRow, endCol);
        }

        this.movePiece = null;
        this.startMove = null;
        this.lastMove = {
          start: { row: startRow, col: startCol },
          end: { row: endRow, col: endCol }
        };
        this.turn = (this.turn + 1) % 2;

        // Make AI move if it's black's turn
        if (this.turn === 1) {
          this.makeAiMove();
        }
      }
      this.$forceUpdate();
    },
    async makeAiMove() {
      const boardState = this.boardToTensor(this.board);
      this.tensorsToDispose.push(boardState);
      const aiMove = await predictMove(this.model, boardState);
      if (aiMove) {
        this.squareSelected(aiMove.startRow, aiMove.startCol);
        this.squareSelected(aiMove.endRow, aiMove.endCol);
      }
    },
    boardToTensor(board) {
      const tensor = tf.tensor2d(board.map(row => row.map(square => square ? square.piece : 0)), [8, 8]);
      // Remove this line
      return tensor;
    },
  }
}
</script>