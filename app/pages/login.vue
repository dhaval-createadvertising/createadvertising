<script setup lang="ts">
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'

definePageMeta({
  layout: false
})

const { auth } = useFirebase()
const { user } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const verificationSent = ref(false)
const resendLoading = ref(false)
const resendSuccess = ref(false)

// Redirect if already logged in AND verified
watchEffect(() => {
  if (user.value && user.value.emailVerified) {
    router.push('/')
  }
})

async function handleResend() {
  if (!email.value || !password.value) {
    error.value = 'Please enter your email and password to resend the link.'
    return
  }
  
  resendLoading.value = true
  resendSuccess.value = false
  error.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    await sendEmailVerification(userCredential.user)
    resendSuccess.value = true
    await signOut(auth)
  } catch (e: any) {
    error.value = "Couldn't resend: " + e.message.replace('Firebase: ', '')
  } finally {
    resendLoading.value = false
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  verificationSent.value = false
  resendSuccess.value = false
  
  try {
    if (isLogin.value) {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
      if (!userCredential.user.emailVerified) {
        error.value = 'Please verify your email before logging in.'
        await signOut(auth)
      }
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      await sendEmailVerification(userCredential.user)
      verificationSent.value = true
      await signOut(auth) // Sign out immediately so they have to verify
    }
  } catch (e: any) {
    error.value = e.message.replace('Firebase: ', '')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="glass-card">
      <div class="header">
        <h1>Create<span>Ad</span></h1>
        <p>{{ isLogin ? 'Welcome back, Agent' : 'Join the Agency' }}</p>
      </div>

      <div v-if="verificationSent" class="verification-success">
        <div class="verify-icon">✉️</div>
        <h3>Verify your email</h3>
        <p>We've sent a verification link to <strong>{{ email }}</strong>. Please check your inbox to activate your account.</p>
        <button @click="verificationSent = false; isLogin = true" class="back-btn">Return to Login</button>
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="input-group">
          <label>Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="name@agency.com" 
            required
          >
        </div>

        <div class="input-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required
          >
        </div>

        <p v-if="error" class="error-msg">
          {{ error }}
          <button 
            v-if="error.includes('verify')" 
            @click="handleResend" 
            class="resend-link"
            type="button"
          >
            {{ resendLoading ? 'Sending...' : 'Resend link' }}
          </button>
        </p>

        <p v-if="resendSuccess" class="success-msg">Verification email resent! Check your inbox.</p>

        <button :disabled="loading" type="submit" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
        </button>
      </form>

      <div class="footer">
        <button @click="isLogin = !isLogin" class="toggle-btn">
          {{ isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #1a1a1a, #000);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  color: #fff;
  font-size: 2.5rem;
  letter-spacing: -1px;
  margin: 0;
}

.header h1 span {
  color: #3b82f6;
  font-weight: 300;
}

.header p {
  color: #888;
  margin-top: 8px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  color: #ccc;
  font-size: 0.85rem;
  margin-bottom: 8px;
  margin-left: 4px;
}

.input-group input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #fff;
  transition: all 0.3s ease;
  outline: none;
}

.input-group input:focus {
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.submit-btn {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
}

.resend-link {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  font-size: inherit;
}

.success-msg {
  color: #22c55e;
  font-size: 0.85rem;
  margin-bottom: 16px;
  text-align: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100%;
  margin-top: 24px;
}

.toggle-btn:hover {
  color: #3b82f6;
}

.verification-success {
  text-align: center;
  padding: 20px 0;
}

.verify-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.verification-success h3 {
  color: #fff;
  margin-bottom: 12px;
}

.verification-success p {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 24px;
}

.back-btn {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
