<template>
  <div class="progress-bar" :title="`${progressPercent}% complete`">
    <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()

const progressPercent = computed(() => {
  const checks = [
    props.project.dubs_received,
    props.project.logos_received,
    props.project.localized_graphics_required,
    props.project.territory_approved,
    props.project.final_approved
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
})
</script>
