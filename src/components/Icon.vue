<script setup>
import { computed } from 'vue'
import feather from 'feather-icons'
const props = defineProps({ name: { type: String, required: true }, size: { type: [Number, String], default: 18 } })
const svg = computed(() => feather.icons[props.name]?.toSvg({ width: props.size, height: props.size, 'stroke-width': 2 }) || '')
</script>
<template><span class="ico" aria-hidden="true" v-html="svg"></span></template>
