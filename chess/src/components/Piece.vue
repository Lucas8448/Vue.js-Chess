<template>
    <div class="piece" @click="selectPiece">
        <img :src="img" />
    </div>
</template>

<script>
import { ref } from 'vue'


export default {
    name: 'Piece',
    data() {
        return {
            img: null
        }
    },
    methods:{
        selectPiece() {
            console.log('piece selected')
        },
        getPieceImg() {
            switch (this.piece) {
                case 'wP':
                    this.img = require('../assets/w/p.png')
                    break
                case 'wR':
                    this.img = require('../assets/w/r.png')
                    break
                case 'wN':
                    this.img = require('../assets/w/n.png')
                    break
                case 'wB':
                    this.img = require('../assets/w/b.png')
                    break
                case 'wQ':
                    this.img = require('../assets/w/q.png')
                    break
                case 'wK':
                    this.img = require('../assets/w/k.png')
                    break
                case 'bP':
                    this.img = require('../assets/b/p.png')
                    break
                case 'bR':
                    this.img = require('../assets/b/r.png')
                    break
                case 'bN':
                    this.img = require('../assets/b/n.png')
                    break
                case 'bB':
                    this.img = require('../assets/b/b.png')
                    break
                case 'bQ':
                    this.img = require('../assets/b/q.png')
                    break
                case 'bK':
                    this.img = require('../assets/b/k.png')
                    break
                default:
                    this.img = null
                    break
            }
        }
    },
    mounted() {
        this.getPieceImg()
    }
}
</script>