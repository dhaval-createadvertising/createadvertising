<template>
  <div :class="['app-shell', { 'no-shell': isStandalonePage }]">
    <Transition name="splash">
      <div v-if="showSplash && !isStandalonePage" class="splash-screen">
        <img src="/logo.svg" alt="CREATE" class="splash-logo" />
      </div>
    </Transition>

    <NuxtPage />
    <BottomNav v-if="!isStandalonePage && $route.path !== '/distributor-portal'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const showSplash = ref(true)

const standalonePages = ['/proposal', '/login']
const isStandalonePage = computed(() => standalonePages.includes(route.path))

// Seed demo data on first load
onMounted(() => {
  const { seedDemoData } = useStore()
  const { initTheme } = useTheme()
  initTheme()
  seedDemoData()

  // High-end feel: show splash for at least 1.2s
  setTimeout(() => {
    showSplash.value = false
  }, 1200)
})
</script>
