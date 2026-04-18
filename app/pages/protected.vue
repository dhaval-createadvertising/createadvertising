<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <div class="protected-page">
    <div class="card">
      <div class="icon">🔒</div>
      <h1>Protected Route</h1>
      <p class="desc">This page is only visible to authenticated users.</p>
      
      <div class="user-info">
        <div class="badge">Logged In</div>
        <pre>{{ user?.email }}</pre>
      </div>

      <button @click="handleLogout" class="logout-btn">
        Logout from Agency
      </button>

      <NuxtLink to="/" class="back-link">Return to Dashboard</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.protected-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  color: white;
  font-family: 'Inter', sans-serif;
}

.card {
  background: #1e293b;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #334155;
  max-width: 400px;
  width: 90%;
}

.icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.desc {
  color: #94a3b8;
  margin-bottom: 32px;
}

.user-info {
  background: #0f172a;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 32px;
  text-align: left;
}

.badge {
  display: inline-block;
  background: #22c55e22;
  color: #22c55e;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

pre {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #3b82f6;
}

.logout-btn {
  width: 100%;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
  transform: scale(1.02);
}

.back-link {
  display: block;
  margin-top: 20px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  color: #fff;
}
</style>
