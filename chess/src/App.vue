<!-- Chess game-->
<template>
    <div class="chess">
        <table>
            <tr v-for="(row, i) in board" :key="i" :class="{ 'evenRow': i % 2 == 0, 'oddRow': i % 2 != 0 }">
                <td v-for="(cell, j) in row" :key="j" :class="{ 'evenTile': j % 2 == 0, 'oddTile': j % 2 != 0 }">
                    <Piece :piece="cell" v-if="cell != ''"/>
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
      board: [['wR', 'wN', 'wB', 'wK', 'wQ', 'wB', 'wN', 'wR'], ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', ''], ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'], ['bR', 'bN', 'bB', 'bK', 'bQ', 'bB', 'bN', 'bR']]
    }
  }
}
</script>