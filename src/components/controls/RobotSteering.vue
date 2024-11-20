<script>
const FORWARD = 'F'
const BACK = 'B'
const LEFT = 'L'
const RIGHT = 'R'
const STOP = 'S'

const FOLLOW = 'Y'
const AVOID = 'U'
const LIGHT = 'X'

export default {
  emits: ['controlCommand'],
  props:{
    disableControls: Boolean
  },
  created() {
    window.addEventListener('keydown', (e) => {
      if(!this.pressed && !this.disableControls) {
        switch(e.key) {
          case 'w':
          case 'W':
            this.pressed = true
            this.$emit('controlCommand', FORWARD)
            break

          case 's':
          case 'S':
            this.pressed = true
            this.$emit('controlCommand', BACK)
            break

          case 'a':
          case 'A':
            this.pressed = true
            this.$emit('controlCommand', LEFT)
            break

          case 'd':
          case 'D':
            this.pressed = true
            this.$emit('controlCommand', RIGHT)
            break
        }

        this.currentMode = 'Steering'
      }
    });
    window.addEventListener('keyup', (e) => {
      if(!this.disableControls) {
        this.pressed = false
        this.$emit('controlCommand', STOP)
      }
    })
  },
  data() {
    return {
      pressed: false,
      command: '',
      currentMode: 'Steering',

      follow: FOLLOW,
      avoid: AVOID,
      light: LIGHT,
    }
  },
  methods: {
    setMode(mode) {
      switch(mode) {
        case FOLLOW:
          this.currentMode = 'Follow'
          break

        case AVOID:
          this.currentMode = 'Avoid obstacles'
          break

        case LIGHT:
          this.currentMode = 'Follow light'
          break
      }

      this.$emit("controlCommand", mode)
    },
  }
}
</script>

<template>
  <p>Controls: {{ disableControls ? 'Disabled' : 'Enabled' }}</p>
  <div>
    <button type="button" class="btn btn-primary mr-1 text-white" :disabled="disableControls" @click="setMode(follow)">Follow</button>
    <button type="button" class="btn btn-primary mr-1 text-white" :disabled="disableControls" @click="setMode(avoid)">Avoid obstacles</button>
    <button type="button" class="btn btn-primary text-white" :disabled="disableControls" @click="setMode(light)">Follow light</button>
  </div>
  <p>Current mode: {{ currentMode }}</p>
</template>