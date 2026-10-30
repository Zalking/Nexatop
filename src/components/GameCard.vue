<script setup>
import { rupiah } from '../data/games'
import Icon from './Icon.vue'
defineProps({ game: { type: Object, required: true }, active: Boolean })
defineEmits(['select'])
</script>

<template>
  <button class="game-card" :class="{ active }" @click="$emit('select', game)">
    <div class="game-media">
      <img class="game-cover" :src="game.image" :alt="`Artwork ${game.name}`" loading="lazy" />
      <span v-if="game.tag" class="game-tag">{{ game.tag }}</span>
    </div>
    <strong>{{ game.name }}</strong>
    <small>{{ game.category }}</small>
    <span class="game-foot">
      <span v-if="game.nominals?.length" class="from">Mulai {{ rupiah(Math.min(...game.nominals.map((n) => n.price))) }}</span>
      <span v-if="game.rating" class="rate"><Icon name="star" :size="12" /> {{ game.rating }}</span>
    </span>
  </button>
</template>
