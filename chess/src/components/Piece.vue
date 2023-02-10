<template>
    <div class="piece" @click="selectPiece">
        <img :src="img" draggable="false"/>
    </div>
</template>

<script>
import wR from '../assets/pieces/w/r.png'
import wN from '../assets/pieces/w/n.png'
import wB from '../assets/pieces/w/b.png'
import wQ from '../assets/pieces/w/q.png'
import wK from '../assets/pieces/w/k.png'
import wP from '../assets/pieces/w/p.png'
import bR from '../assets/pieces/b/r.png'
import bN from '../assets/pieces/b/n.png'
import bB from '../assets/pieces/b/b.png'
import bQ from '../assets/pieces/b/q.png'
import bK from '../assets/pieces/b/k.png'
import bP from '../assets/pieces/b/p.png'

export default {
    props: {
        piece: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            img: null
        }
    },
    methods: {
        selectPiece() {
            console.log('piece selected')
        },
        getPieceImg() {
            switch (this.piece) {
                case 'wR':
                    this.img = wR
                    break
                case 'wN':
                    this.img = wN
                    break
                case 'wB':
                    this.img = wB
                    break
                case 'wQ':
                    this.img = wQ
                    break
                case 'wK':
                    this.img = wK
                    break
                case 'wP':
                    this.img = wP
                    break
                case 'bR':
                    this.img = bR
                    break
                case 'bN':
                    this.img = bN
                    break
                case 'bB':
                    this.img = bB
                    break
                case 'bQ':
                    this.img = bQ
                    break
                case 'bK':
                    this.img = bK
                    break
                case 'bP':
                    this.img = bP
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