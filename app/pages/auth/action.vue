<script setup lang="ts">
import { applyActionCode, checkActionCode } from 'firebase/auth'

definePageMeta({
  layout: false
})

const { auth } = useFirebase()
const route = useRoute()
const router = useRouter()

const mode = route.query.mode as string
const oobCode = route.query.oobCode as string

const status = ref<'loading' | 'success' | 'error' | 'expired'>('loading')
const errorMessage = ref('')
const emailHandled = ref('')

onMounted(async () => {
  if (!mode || !oobCode) {
    status.value = 'error'
    errorMessage.value = 'Invalid or missing action code.'
    return
  }

  try {
    switch (mode) {
      case 'verifyEmail':
        await applyActionCode(auth, oobCode)
        status.value = 'success'
        break
      
      case 'resetPassword':
        // Redirect to a dedicated reset password page or handle here
        router.push({ path: '/auth/reset-password', query: { oobCode } })
        break

      default:
        status.value = 'error'
        errorMessage.value = 'This action mode is not supported yet.'
    }
  } catch (e: any) {
    console.error('Auth action error:', e)
    if (e.code === 'auth/invalid-action-code' || e.code === 'auth/expired-action-code') {
      status.value = 'expired'
    } else {
      status.value = 'error'
      errorMessage.value = e.message.replace('Firebase: ', '')
    }
  }
})
</script>

<template>
  <div class="auth-action-container">
    <div class="glass-card">
      <!-- Loading State -->
      <div v-if="status === 'loading'" class="state-content">
        <div class="spinner"></div>
        <h2>Processing...</h2>
        <p>Verifying your credentials with the agency.</p>
      </div>

      <!-- Success State -->
      <div v-if="status === 'success'" class="state-content">
        <div class="icon-circle success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2>Verification Complete</h2>
        <p>Your account is now fully activated. Welcome to the Agency.</p>
        <NuxtLink to="/login" class="action-btn">Return to Login</NuxtLink>
      </div>

      <!-- Error State -->
      <div v-if="status === 'error'" class="state-content">
        <div class="icon-circle error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2>Action Failed</h2>
        <p>{{ errorMessage }}</p>
        <NuxtLink to="/login" class="action-btn secondary">Back to Home</NuxtLink>
      </div>

      <!-- Expired State -->
      <div v-if="status === 'expired'" class="state-content">
        <div class="icon-circle warning">!</div>
        <h2>Link Expired</h2>
        <p>This verification link has already been used or has expired.</p>
        <NuxtLink to="/login" class="action-btn secondary">Request New Link</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-action-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at bottom right, #1e293b, #000);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 60px 40px;
  width: 100%;
  max-width: 440px;
  text-align: center;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
}

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

h2 {
  color: #fff;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

p {
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: 800;
}

.icon-circle.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 2px solid rgba(34, 197, 94, 0.2);
}

.icon-circle.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 2px solid rgba(239, 68, 68, 0.2);
}

.icon-circle.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 2px solid rgba(245, 158, 11, 0.2);
}

.icon-circle svg {
  width: 40px;
  height: 40px;
}

.action-btn {
  margin-top: 15px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  padding: 14px 32px;
  border-radius: 14px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.action-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(59, 130, 246, 0.5);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
