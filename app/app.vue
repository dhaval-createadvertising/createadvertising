<template>
  <div class="app-shell">
    <Transition name="splash">
      <div v-if="showSplash" class="splash-screen">
        <img src="/logo.svg" alt="CREATE" class="splash-logo" />
      </div>
    </Transition>

    <NuxtPage />
    <BottomNav v-if="$route.path !== '/distributor-portal'" />
  </div>
</template>

<script setup lang="ts">
const showSplash = ref(true)

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
