<template>
  <span class="badge" :class="badgeClass">
    <span class="badge-dot"></span>
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import type { ProjectStatus } from '~/types'

const props = defineProps<{ status: ProjectStatus }>()

const badgeClass = computed(() => {
  switch (props.status) {
    case 'New': return 'badge--new'
    case 'In Progress': return 'badge--in-progress'
    case 'Approved': return 'badge--approved'
    case 'Completed': return 'badge--completed'
    default: return 'badge--new'
  }
})
</script>
