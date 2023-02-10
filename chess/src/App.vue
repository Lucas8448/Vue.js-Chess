<!-- Chess game-->
<template>
    <div class="chess">
        <table>
            <tr v-for="(row, i) in board" :key="i" :class="{ 'evenRow': i % 2 == 0, 'oddRow': i % 2 != 0 }">
                <td v-for="(cell, j) in row" :key="j" :class="{ 'evenTile': j % 2 == 0, 'oddTile': j % 2 != 0 }" @click="selectPiece(i, j)">
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
      validPieces: ['wP', 'wR', 'wN', 'wB', 'wQ', 'wK', 'bP', 'bR', 'bN', 'bB', 'bQ', 'bK'],
      activeMove: null,
      selectedPiece: null,
      selectedPieceType: null,
      board: [['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'], ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'], ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR']]
    }
  },
  methods: {
    selectPiece(x, y) {
      console.log(x, y)
      this.selectedPieceType = this.board[x][y]
      // move piece if there is one already selected, and if not select this piece
      if (this.selectedPiece) {
        this.activeMove = [x, y]
        this.movePiece()
      } else {
        this.selectedPiece = [x, y]
      }
    },
    movePiece() {
      console.log("moving piece")
      this.board[this.activeMove[0]][this.activeMove[1]] = this.board[this.selectedPiece[0]][this.selectedPiece[1]]
      this.board[this.selectedPiece[0]][this.selectedPiece[1]] = ''
      this.selectedPiece = null
      this.activeMove = null
    }
  }
}
</script>