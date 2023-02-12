<!-- Chess game-->
<template>
    <h2 v-if="turn==0">White Move</h2>
    <h2 v-else>Black Move</h2>
    <div class="chess">
        <table>
            <tr v-for="(row, i) in board" :key="row" :class="{ 'evenRow': i % 2 == 0, 'oddRow': i % 2 != 0 }">
                <td v-for="(cell, j) in row" :key="cell" :class="{ 'evenTile': j % 2 == 0, 'oddTile': j % 2 != 0 , 'move': cell == '*'}" @click="squareSelected(i, j)">
                    <Piece :piece="cell" v-if="cell != '' && cell !='*'"/>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { ref } from 'vue'
import Piece from './components/Piece.vue'

export default {
  name: 'App',
  components: {
    Piece
  },
  data() {
    return {
      turn: 0,
      // turn 0 is white, 1 is black
      movePiece: null,
      startMove: null,
      // create an array of all the valid pieces
      validPieces: ['wP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'bP', 'bR', 'bN', 'bB', 'bQ', 'bK'],
      board: [['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'], ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'], ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR']]
    }
  },
  methods: {
    // basic checking functions
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
    // select piece
    squareSelected(row, col) {
      if (this.movePiece == null) {
        if (this.isPiece(this.board[row][col]) && this.isSameTeam(this.board[row][col])) {
          this.movePiece = this.board[row][col]
          this.startMove = [row, col]
        }
      } else {
        if (this.isPiece(this.board[row][col]) && this.isSameTeam(this.board[row][col])) {
          this.movePiece = this.board[row][col]
          this.startMove = [row, col]
        } else {
          this.board[row][col] = ''
          this.board[row][col] = this.movePiece
          //clear target square even if there is an enemy piece there
          this.board[this.startMove[0]][this.startMove[1]] = ''
          this.movePiece = null
          this.startMove = null
          this.turn = (this.turn + 1) % 2
        }
      }
      this.$forceUpdate();
    },
  }
}


</script>