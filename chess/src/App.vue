<!-- Chess game-->
<template>
    <h2 v-if="turn==0">White Move</h2>
    <h2 v-else>Black Move</h2>
    <div class="chess">
        <table>
            <tr v-for="(row, i) in board" :key="i" :class="{ 'evenRow': i % 2 == 0, 'oddRow': i % 2 != 0 }">
                <td v-for="(cell, j) in row" :key="j" :class="{ 'evenTile': j % 2 == 0, 'oddTile': j % 2 != 0 }" @mousedown="startPieceMove(i, j)" @mouseup="leavePiecemove(i, j)">
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
      validPieces: ['wP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'bP', 'bR', 'bN', 'bB', 'bQ', 'bK'],
      board: [['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'], ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'], ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR']]
    }
  },
  methods: {
    // move piece from startPieceMove to endPieceMove
    getPieceColour(x, y) {
      if (this.board[x][y] == '') {
        return ''
      } else {
        return this.board[x][y].charAt(0)
      }
    },
    getPieceType(x, y) {
      if (this.board[x][y] == '') {
        return ''
      } else {
        return this.board[x][y].charAt(1)
      }
    },
    startPieceMove(i, j) {
      if ((this.turn == 0 && this.getPieceColour(i, j) == 'w') || (this.turn == 1 && this.getPieceColour(i, j) == 'b')) {
        console.log(this.getPieceColour(i,j))
        this.movePiece = this.board[i][j]
        this.startMove = [i, j]
      }
    },
    leavePiecemove(i, j) {
      this.pieceMove(this.startMove[0], this.startMove[1], i, j)
      if (this.turn == 0) {
        this.turn = 1
      } else {
        this.turn = 0
      }
    },
    pieceMove(sourceX, sourceY, targetX, targetY) {
      var piece = this.board[sourceX][sourceY]
      this.board[sourceX][sourceY] = ''
      this.board[targetX][targetY] = piece
    }
  }
}


</script>