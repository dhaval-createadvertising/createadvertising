<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

definePageMeta({
  layout: false
})

const isDark = useDark({
  selector: 'body',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

const currentSlide = ref(0)
const totalSlides = 9
const transitioning = ref(false)
const direction = ref<'next' | 'prev'>('next')

function goTo(index: number) {
  if (index < 0 || index >= totalSlides || index === currentSlide.value || transitioning.value) return
  direction.value = index > currentSlide.value ? 'next' : 'prev'
  transitioning.value = true
  currentSlide.value = index
  setTimeout(() => { transitioning.value = false }, 500)
}

function next() { goTo(currentSlide.value + 1) }
function prev() { goTo(currentSlide.value - 1) }

// Keyboard navigation
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})

// Slide labels for nav dots
const slideLabels = [
  'Title', 'Overview', 'Architecture', 'Security',
  'Features', 'Option 1 Cost', 'Option 2 Cost',
  'TCO Comparison', 'Support'
]
</script>

<template>
  <div class="deck">
    <!-- ─── Progress Bar ─── -->
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: ((currentSlide + 1) / totalSlides) * 100 + '%' }"></div>
    </div>

    <!-- ─── Top Bar ─── -->
    <nav class="deck-nav">
      <img src="/logo.svg" alt="CREATE" class="deck-logo" />
      <div class="deck-nav-center">
        <div class="slide-counter">{{ currentSlide + 1 }} / {{ totalSlides }}</div>
      </div>
      <div class="deck-nav-right">
        <button class="theme-toggle" @click="toggleDark()" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <img src="/kdp.png" alt="KDP" class="deck-logo-right" />
      </div>
    </nav>

    <!-- ─── Slide Container ─── -->
    <div class="slide-viewport">
      <Transition :name="direction === 'next' ? 'slide-left' : 'slide-right'" mode="out-in">

        <!-- ═══════════════ SLIDE 0: TITLE ═══════════════ -->
        <div v-if="currentSlide === 0" key="s0" class="slide">
          <div class="slide-inner title-slide">
            <div class="title-glow"></div>
            <div class="title-badge">Technical Proposal</div>
            <h1>Production Tracking<br/><span class="gradient-text">Portal</span></h1>
            <p class="title-sub">Enterprise-Grade Application for Create Advertising's<br/>Production & Localization Workflow Management</p>
            <div class="title-chips">
              <div class="chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                April 2026
              </div>
              <div class="chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Enterprise Security
              </div>
              <div class="chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Production Ready
              </div>
            </div>
            <button class="start-btn" @click="next">
              View Proposal
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 1: OVERVIEW ═══════════════ -->
        <div v-else-if="currentSlide === 1" key="s1" class="slide">
          <div class="slide-inner">
            <div class="slide-label">01 — Overview</div>
            <h2>What We're Building</h2>
            <p class="slide-desc">
              A secure, role-based production tracking portal replacing the current Coda-based workflow.
              The portal serves two distinct audiences — <strong>Internal Team</strong> and <strong>Distributor Partners</strong> — 
              with granular data access, collaborative automation, and enterprise-grade security.
            </p>
            <div class="card-grid four">
              <div class="mini-card">
                <div class="mc-icon red">🔒</div>
                <h3>100% Login-Gated</h3>
                <p>No public pages. Every view requires authenticated, email-verified credentials.</p>
              </div>
              <div class="mini-card">
                <div class="mc-icon blue">👥</div>
                <h3>Role-Based Views</h3>
                <p>Internal, Distributor, and Admin portals — each with tailored data visibility.</p>
              </div>
              <div class="mini-card">
                <div class="mc-icon amber">📧</div>
                <h3>Email Automations</h3>
                <p>Templated emails, order notifications, and collaboration triggers.</p>
              </div>
              <div class="mini-card">
                <div class="mc-icon teal">🌐</div>
                <h3>Localization Engine</h3>
                <p>Copy localization records across projects. Mobile-first vertical script view.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 2: ARCHITECTURE ═══════════════ -->
        <div v-else-if="currentSlide === 2" key="s2" class="slide">
          <div class="slide-inner">
            <div class="slide-label">02 — Architecture</div>
            <h2>Two Infrastructure Options</h2>
            <div class="arch-compare">
              <!-- Option 1 -->
              <div class="arch-col recommended">
                <div class="arch-header opt1">
                  <span class="arch-opt">Option 1 <span class="reco-badge">★ Recommended</span></span>
                  <h3>Google Cloud + Firebase</h3>
                </div>
                <div class="arch-flow">
                  <div class="flow-box fb-user">👤 Users</div>
                  <div class="flow-arrow">↓</div>
                  <div class="flow-box fb-shield">🛡️ Cloud Armor <small>WAF · DDoS · Rate Limiting</small></div>
                  <div class="flow-arrow">↓</div>
                  <div class="flow-row">
                    <div class="flow-box fb-fire">🔥 Firebase Hosting <small>GitHub Auto-deploy</small></div>
                    <div class="flow-box fb-auth">🔐 Firebase Auth <small>Email Verification</small></div>
                  </div>
                  <div class="flow-arrow">↓</div>
                  <div class="flow-row">
                    <div class="flow-box fb-db">🗄️ Cloud SQL <small>PostgreSQL · Encrypted</small></div>
                    <div class="flow-box fb-key">🔑 Secret Manager <small>HSM-backed Vault</small></div>
                  </div>
                </div>
              </div>
              <!-- Option 2 -->
              <div class="arch-col">
                <div class="arch-header opt2">
                  <span class="arch-opt">Option 2</span>
                  <h3>Netlify + Supabase Enterprise</h3>
                </div>
                <div class="arch-flow">
                  <div class="flow-box fb-user">👤 Users</div>
                  <div class="flow-arrow alt">↓</div>
                  <div class="flow-box fb-netlify">◆ Netlify Enterprise <small>Edge CDN · DDoS</small></div>
                  <div class="flow-arrow alt">↓</div>
                  <div class="flow-row">
                    <div class="flow-box fb-supa">⚡ Supabase Enterprise <small>Postgres · RLS · Realtime</small></div>
                    <div class="flow-box fb-supa-auth">🔐 Supabase Auth <small>JWT · RLS Policies</small></div>
                  </div>
                  <div class="flow-arrow alt">↓</div>
                  <div class="flow-row">
                    <div class="flow-box fb-supa-db">🗄️ Dedicated Postgres <small>Isolated Instance</small></div>
                    <div class="flow-box fb-vault">🔑 Supabase Vault <small>DB-level Secrets</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 3: SECURITY ═══════════════ -->
        <div v-else-if="currentSlide === 3" key="s3" class="slide">
          <div class="slide-inner">
            <div class="slide-label">03 — Security</div>
            <h2>Enterprise-Grade Security</h2>
            <p class="slide-desc">Both architectures provide layered security. Option 1 provides stronger protection with dedicated Cloud Armor WAF.</p>
            <div class="sec-compare">
              <div class="sec-col recommended">
                <h3 class="sec-title opt1-text">Option 1 — Google Cloud</h3>
                <div class="sec-row"><div class="dot green"></div><div><strong>Cloud Armor WAF</strong><span>DDoS, OWASP Top 10, geo-blocking, IP rules</span></div></div>
                <div class="sec-row"><div class="dot green"></div><div><strong>Secret Manager (HSM)</strong><span>Hardware-backed, auto-rotation, audit logs</span></div></div>
                <div class="sec-row"><div class="dot green"></div><div><strong>Cloud SQL Encryption</strong><span>AES-256 at rest, TLS in transit, private VPC</span></div></div>
                <div class="sec-row"><div class="dot green"></div><div><strong>Firebase Auth</strong><span>Email verify, session mgmt, brute-force block</span></div></div>
                <div class="sec-row"><div class="dot green"></div><div><strong>IAM + Service Accounts</strong><span>Least-privilege access, role-based API control</span></div></div>
                <div class="sec-row"><div class="dot green"></div><div><strong>SOC 2, ISO 27001, HIPAA</strong><span>Full enterprise compliance stack</span></div></div>
              </div>
              <div class="sec-col">
                <h3 class="sec-title opt2-text">Option 2 — Netlify + Supabase</h3>
                <div class="sec-row"><div class="dot purple"></div><div><strong>Netlify Edge DDoS</strong><span>Built-in protection, auto HTTPS</span></div></div>
                <div class="sec-row"><div class="dot purple"></div><div><strong>Supabase Vault</strong><span>AES-256 secrets at database level</span></div></div>
                <div class="sec-row"><div class="dot purple"></div><div><strong>Row Level Security</strong><span>Database-enforced access control</span></div></div>
                <div class="sec-row"><div class="dot purple"></div><div><strong>Supabase Auth</strong><span>JWT sessions, email verify, RLS policies</span></div></div>
                <div class="sec-row"><div class="dot purple"></div><div><strong>Dedicated Instance</strong><span>Isolated compute, no noisy neighbors</span></div></div>
                <div class="sec-row"><div class="dot purple"></div><div><strong>SOC 2 Type II</strong><span>Standard compliance certification</span></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 4: FEATURES ═══════════════ -->
        <div v-else-if="currentSlide === 4" key="s4" class="slide">
          <div class="slide-inner">
            <div class="slide-label">04 — Key Functionalities</div>
            <h2>What's Included</h2>
            <p class="slide-desc">Beyond the core data models already in development, these key capabilities are part of the build scope.</p>
            <div class="feature-grid">
              <div class="feat-card">
                <div class="feat-icon auth-bg">🔐</div>
                <h3>Authentication & Access</h3>
                <ul>
                  <li>Email + password with mandatory verification</li>
                  <li>All pages gated — zero public content</li>
                  <li>Session management & password recovery</li>
                </ul>
              </div>
              <div class="feat-card">
                <div class="feat-icon role-bg">👥</div>
                <h3>Role-Based Portal Views</h3>
                <ul>
                  <li><strong>Internal:</strong> Full access across all data</li>
                  <li><strong>Distributor:</strong> Scoped to their projects only</li>
                  <li><strong>Admin:</strong> User onboarding & role mgmt</li>
                </ul>
              </div>
              <div class="feat-card">
                <div class="feat-icon auto-bg">⚡</div>
                <h3>Automations & Collaboration</h3>
                <ul>
                  <li>Distributor order/project requests</li>
                  <li>Automated email notifications</li>
                  <li>Branded email templates</li>
                </ul>
              </div>
              <div class="feat-card">
                <div class="feat-icon loc-bg">📋</div>
                <h3>Localization & Extras</h3>
                <ul>
                  <li>Copy localization records across projects</li>
                  <li class="optional"><strong>Optional:</strong> portal.createadvertising.com</li>
                  <li class="optional"><strong>Optional:</strong> portal@createadvertising.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 5: OPTION 1 COST ═══════════════ -->
        <div v-else-if="currentSlide === 5" key="s5" class="slide">
          <div class="slide-inner">
            <div class="slide-label">05 — Option 1 Investment <span class="reco-badge">★ Recommended</span></div>
            <h2>Google Cloud + Firebase</h2>
            <div class="cost-layout">
              <!-- One-time -->
              <div class="cost-card highlight-blue">
                <div class="cc-tag">One-Time</div>
                <h3>Build & Deployment</h3>
                <div class="cost-lines">
                  <div class="cl"><span>Application Build</span><span class="price">$3,800</span></div>
                  <div class="cl sub">Nuxt 4 app, all views, CRUD, role-based routing, mobile-responsive UI, email automations, localization cloning</div>
                  <div class="cl"><span>Auth & Admin Portal</span><span class="price">$1,200</span></div>
                  <div class="cl sub">Firebase Auth, email verification, admin onboarding, role management</div>
                  <div class="cl"><span>Infrastructure & Production Setup</span><span class="price">$1,500</span></div>
                  <div class="cl sub">Cloud SQL, Cloud Armor WAF, Secret Manager, CI/CD pipeline, security hardening, domain + email config</div>
                </div>
                <div class="cost-total">
                  <span>Total One-Time</span>
                  <span class="big-price">$6,500</span>
                </div>
              </div>
              <!-- Monthly -->
              <div class="cost-card">
                <div class="cc-tag green">Monthly</div>
                <h3>Recurring Costs</h3>
                <div class="cost-lines">
                  <div class="cl"><span>Cloud Hosting & Infrastructure</span><span class="price highlight-green">~$150/mo</span></div>
                  <div class="cl sub">Cloud Run, Cloud SQL, Cloud Armor, Secret Manager, Firebase Auth — usage-based, significantly lower than enterprise SaaS plans</div>
                  <div class="cl"><span>Support & Maintenance</span><span class="price">$700/mo</span></div>
                  <div class="cl sub">10 hrs/month bug fixes & small enhancements, email-based support, security patches, monitoring</div>
                </div>
                <div class="cost-total">
                  <span>Total Monthly</span>
                  <span class="big-price">$850<small>/mo</small></span>
                </div>
              </div>
            </div>
            <div class="cost-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Higher upfront infrastructure setup due to Cloud Armor, Secret Manager, and Cloud SQL configuration — but <strong>dramatically lower monthly hosting costs</strong> vs managed SaaS platforms.
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 6: OPTION 2 COST ═══════════════ -->
        <div v-else-if="currentSlide === 6" key="s6" class="slide">
          <div class="slide-inner">
            <div class="slide-label">06 — Option 2 Investment</div>
            <h2>Netlify + Supabase Enterprise</h2>
            <div class="cost-layout">
              <!-- One-time -->
              <div class="cost-card highlight-purple">
                <div class="cc-tag purple">One-Time</div>
                <h3>Build & Deployment</h3>
                <div class="cost-lines">
                  <div class="cl"><span>Application Build</span><span class="price">$3,800</span></div>
                  <div class="cl sub">Nuxt 4 app, all views, CRUD, role-based routing, mobile-responsive UI, email automations, localization cloning</div>
                  <div class="cl"><span>Auth & Admin Portal</span><span class="price">$1,200</span></div>
                  <div class="cl sub">Supabase Auth, email verification, RLS policies, admin onboarding, role management</div>
                  <div class="cl"><span>Infrastructure & Production Setup</span><span class="price">$800</span></div>
                  <div class="cl sub">Netlify config, Supabase project, RLS policies, CI/CD pipeline, domain + email setup — simpler managed infrastructure</div>
                </div>
                <div class="cost-total">
                  <span>Total One-Time</span>
                  <span class="big-price">$5,800</span>
                </div>
              </div>
              <!-- Monthly -->
              <div class="cost-card">
                <div class="cc-tag green">Monthly</div>
                <h3>Recurring Costs</h3>
                <div class="cost-lines">
                  <div class="cl"><span>Cloud Hosting & Infrastructure</span><span class="price highlight-red">~$1,200+/mo</span></div>
                  <div class="cl sub">Netlify Enterprise ($500+/mo) + Supabase Enterprise/Team ($700+/mo with dedicated Postgres) — fixed enterprise plan pricing</div>
                  <div class="cl"><span>Support & Maintenance</span><span class="price">$600/mo</span></div>
                  <div class="cl sub">10 hrs/month bug fixes & small enhancements, email-based support, security patches — reduced due to simpler architecture</div>
                </div>
                <div class="cost-total">
                  <span>Total Monthly</span>
                  <span class="big-price">$1,800<small>/mo</small></span>
                </div>
              </div>
            </div>
            <div class="cost-note warn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Simpler initial setup saves $700 on deployment — but enterprise SaaS subscriptions result in <strong>$1,050+ more per month</strong> in ongoing hosting charges. Hosting accounts belong to Create Advertising.
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 7: TCO COMPARISON ═══════════════ -->
        <div v-else-if="currentSlide === 7" key="s7" class="slide">
          <div class="slide-inner">
            <div class="slide-label">07 — Total Cost of Ownership</div>
            <h2>12 & 24 Month Comparison</h2>
            <p class="slide-desc">All hosting and infrastructure accounts belong to Create Advertising. Support costs include 10 hrs/month bug fixing & enhancements.</p>

            <div class="tco-table-wrap">
              <table class="tco-table">
                <thead>
                  <tr>
                    <th></th>
                    <th class="col-recommended"><span class="th-reco-badge">★ RECOMMENDED</span><span class="th-opt opt1-text">Option 1</span><span class="th-name">Google Cloud + Firebase</span></th>
                    <th><span class="th-opt opt2-text">Option 2</span><span class="th-name">Netlify + Supabase</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-label">One-Time Build</td>
                    <td class="col-recommended">$6,500</td>
                    <td>$5,800</td>
                  </tr>
                  <tr>
                    <td class="row-label">Monthly Hosting</td>
                    <td class="col-recommended"><span class="tag tag-orange">~$150/mo</span></td>
                    <td><span class="tag tag-red">~$1,200/mo</span></td>
                  </tr>
                  <tr>
                    <td class="row-label">Monthly Support</td>
                    <td class="col-recommended">$700/mo</td>
                    <td>$600/mo</td>
                  </tr>
                  <tr class="border-row">
                    <td class="row-label">Monthly Total</td>
                    <td class="col-recommended"><strong>$850/mo</strong></td>
                    <td><strong>$1,800/mo</strong></td>
                  </tr>
                  <tr class="highlight-row">
                    <td class="row-label big">12-Month TCO</td>
                    <td class="tco-val winner col-recommended">
                      <span class="tco-amount">$16,700</span>
                      <span class="tco-math">$6,500 + (12 × $850)</span>
                    </td>
                    <td class="tco-val">
                      <span class="tco-amount">$27,400</span>
                      <span class="tco-math">$5,800 + (12 × $1,800)</span>
                    </td>
                  </tr>
                  <tr class="highlight-row">
                    <td class="row-label big">24-Month TCO</td>
                    <td class="tco-val winner col-recommended">
                      <span class="tco-amount">$26,900</span>
                      <span class="tco-math">$6,500 + (24 × $850)</span>
                    </td>
                    <td class="tco-val">
                      <span class="tco-amount">$49,000</span>
                      <span class="tco-math">$5,800 + (24 × $1,800)</span>
                    </td>
                  </tr>
                  <tr class="savings-row">
                    <td class="row-label">Savings with Option 1</td>
                    <td colspan="2" class="savings-cell">
                      <span class="save-12">$10,700 saved in Year 1</span>
                      <span class="save-24">$22,100 saved over 2 Years</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="tco-reco">
              <div class="reco-icon">💡</div>
              <div>
                <h4>Recommendation</h4>
                <p><strong>Option 1 (Google Cloud + Firebase)</strong> is recommended. While it has a slightly higher upfront cost (+$700), the dramatically lower monthly hosting (~$150 vs ~$1,200+) results in <strong>$10,700+ savings in the first year alone</strong>, growing to $22,100+ over two years. It also provides superior security with Cloud Armor WAF and hardware-backed secret management.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ═══════════════ SLIDE 8: SUPPORT ═══════════════ -->
        <div v-else-if="currentSlide === 8" key="s8" class="slide">
          <div class="slide-inner">
            <div class="slide-label">08 — Ongoing Support</div>
            <h2>What's Included Monthly</h2>
            <p class="slide-desc">Keep the portal running, secure, and progressively improved.</p>
            <div class="card-grid three">
              <div class="support-stat">
                <div class="ss-num">10</div>
                <div class="ss-unit">hours/month</div>
                <h3>Development Time</h3>
                <p>Bug fixes, small feature enhancements, and UI adjustments. Unused hours do not roll over.</p>
              </div>
              <div class="support-stat">
                <div class="ss-num">24</div>
                <div class="ss-unit">hour response</div>
                <h3>Email-Based Support</h3>
                <p>Guaranteed response within one business day. Critical production issues escalated immediately.</p>
              </div>
              <div class="support-stat">
                <div class="ss-num">∞</div>
                <div class="ss-unit">always included</div>
                <h3>Security Patches</h3>
                <p>Dependency updates, vulnerability scanning, and proactive patching included at no extra cost.</p>
              </div>
            </div>
            <div class="support-extra">
              <p>Need more than 10 hours? Additional development time is available at <strong>$100/hour</strong>. Larger features will be scoped separately.</p>
            </div>
            <div class="footer-note">
              <img src="/logo.svg" alt="CREATE" class="footer-logo" />
              <p>This proposal is valid for 30 days. Implementation timeline: 4–6 weeks from kickoff.</p>
              <p class="small">All prices in USD. Hosting accounts and usage charges belong to Create Advertising.</p>
            </div>
          </div>
        </div>

      </Transition>
    </div>

    <!-- ─── Navigation Controls ─── -->
    <div class="deck-controls">
      <button class="ctrl-btn" :disabled="currentSlide === 0" @click="prev">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div class="dots">
        <button
          v-for="(label, i) in slideLabels"
          :key="i"
          :class="['dot-btn', { active: currentSlide === i }]"
          :title="label"
          @click="goTo(i)"
        >
          <span class="dot-pip"></span>
        </button>
      </div>

      <button class="ctrl-btn" :disabled="currentSlide === totalSlides - 1" @click="next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── Variables ────────────────────────────────────────────── */
:root {
  --bg-primary: #000;
  --bg-secondary: rgba(255,255,255,0.025);
  --text-primary: #fff;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-primary: rgba(255,255,255,0.06);
  --border-secondary: rgba(255,255,255,0.08);
  --nav-bg: rgba(0,0,0,0.8);
  --accent-blue: #3b82f6;
  --accent-purple: #8b5cf6;
  --card-hover: rgba(255,255,255,0.04);
  --shadow-sm: 0 4px 12px rgba(0,0,0,0.4);
  --logo-filter: none;
}

[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #ffffff;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --border-primary: rgba(0,0,0,0.06);
  --border-secondary: rgba(0,0,0,0.08);
  --nav-bg: rgba(248,250,252,0.8);
  --card-hover: rgba(0,0,0,0.02);
  --shadow-sm: 0 4px 12px rgba(15,23,42,0.06);
  --logo-filter: invert(1) brightness(0.2);
}

/* ── Base Deck ─────────────────────────────────────────────── */
.deck {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-secondary);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  user-select: none;
  transition: background-color 0.4s ease, color 0.4s ease;
}

[data-theme="light"] .deck {
  background: #f1f5f9; /* Slightly different to contrast with secondary bg */
}

/* ── Progress Bar ──────────────────────────────────────────── */
.progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.06);
  z-index: 100;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
}

/* ── Top Nav ───────────────────────────────────────────────── */
.deck-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  flex-shrink: 0;
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  z-index: 50;
  border-bottom: 1px solid var(--border-primary);
}
.deck-logo { height: 22px; opacity: 0.7; filter: var(--logo-filter); }
[data-theme="light"] .deck-logo { filter: invert(1) brightness(0.2); }

.deck-nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.deck-nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.theme-toggle:hover {
  background: var(--card-hover);
  color: var(--text-primary);
  border-color: var(--border-secondary);
}

.slide-counter {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}
.deck-logo-right {
  height: 28px;
  opacity: 0.85;
  border-radius: 4px;
  transition: opacity 0.3s;
}
.deck-logo-right:hover {
  opacity: 1;
}

/* ── Slide Viewport ────────────────────────────────────────── */
.slide-viewport {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  min-height: 0;
  overflow-y: auto;
}
.slide {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
}
.slide-inner {
  padding: 20px 0;
}

/* ── Title Slide ───────────────────────────────────────────── */
.title-slide {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.title-glow {
  position: absolute;
  top: -300px;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.title-badge {
  display: inline-block;
  padding: 6px 18px;
  border-radius: 100px;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  color: #60a5fa;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 28px;
}
.title-slide h1 {
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title-sub {
  font-size: clamp(15px, 2vw, 18px);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 28px;
}
.title-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 36px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 100px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
}
.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  background: #3b82f6;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.start-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59,130,246,0.3);
}

/* ── Shared Slide ──────────────────────────────────────────── */
.slide-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3b82f6;
  margin-bottom: 12px;
}
.slide-inner h2 {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.slide-desc {
  font-size: 15px;
  color: #94a3b8;
  line-height: 1.7;
  max-width: 640px;
  margin-bottom: 32px;
}
.slide-desc strong { color: var(--text-primary); }

/* ── Card Grids ────────────────────────────────────────────── */
.card-grid { display: grid; gap: 14px; }
.card-grid.four { grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
.card-grid.three { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

.mini-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: 24px 20px;
  transition: all 0.3s;
}
.mini-card:hover { border-color: rgba(59,130,246,0.2); transform: translateY(-3px); }
.mc-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 14px;
}
.mc-icon.red { background: rgba(239,68,68,0.1); }
.mc-icon.blue { background: rgba(59,130,246,0.1); }
.mc-icon.amber { background: rgba(251,191,36,0.1); }
.mc-icon.teal { background: rgba(45,212,191,0.1); }
.mini-card h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px; }
.mini-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

/* ── Architecture Compare ──────────────────────────────────── */
.arch-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .arch-compare { grid-template-columns: 1fr; } }

.arch-col {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.arch-col.recommended {
  background: rgba(16, 185, 129, 0.08);
  border: 2px solid #10b981;
  box-shadow: 0 0 60px rgba(16, 185, 129, 0.15);
  transform: scale(1.02);
  z-index: 10;
}
[data-theme="light"] .arch-col.recommended {
  background: rgba(16, 185, 129, 0.05);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.1);
}
.arch-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-primary);
}
.arch-header.opt1 { background: rgba(59,130,246,0.04); border-bottom-color: rgba(59,130,246,0.1); }
.arch-header.opt2 { background: rgba(139,92,246,0.04); border-bottom-color: rgba(139,92,246,0.1); }
.arch-opt {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  display: block;
  margin-bottom: 2px;
}
.arch-header.opt1 .arch-opt { color: #60a5fa; }
.arch-header.opt2 .arch-opt { color: #a78bfa; }
.arch-header h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); }

.arch-flow {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.flow-box {
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  width: 100%;
  max-width: 200px;
  border: 1px solid var(--border-secondary);
  background: var(--bg-secondary);
}
.flow-box small { display: block; font-size: 10px; color: #64748b; font-weight: 500; margin-top: 2px; }
.flow-row { display: flex; gap: 8px; width: 100%; justify-content: center; }
.flow-row .flow-box { max-width: 180px; }
.flow-arrow { color: #3b82f6; font-size: 16px; opacity: 0.5; }
.flow-arrow.alt { color: #a78bfa; }

.fb-shield { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.04); }
.fb-fire { border-color: rgba(251,146,60,0.2); background: rgba(251,146,60,0.04); }
.fb-auth { border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.04); }
.fb-db { border-color: rgba(52,211,153,0.2); background: rgba(52,211,153,0.04); }
.fb-key { border-color: rgba(251,191,36,0.2); background: rgba(251,191,36,0.04); }
.fb-netlify { border-color: rgba(0,194,168,0.2); background: rgba(0,194,168,0.04); }
.fb-supa { border-color: rgba(62,207,142,0.2); background: rgba(62,207,142,0.04); }
.fb-supa-auth { border-color: rgba(59,130,246,0.2); background: rgba(59,130,246,0.04); }
.fb-supa-db { border-color: rgba(52,211,153,0.2); background: rgba(52,211,153,0.04); }
.fb-vault { border-color: rgba(251,191,36,0.2); background: rgba(251,191,36,0.04); }

/* ── Security Compare ──────────────────────────────────────── */
.sec-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .sec-compare { grid-template-columns: 1fr; } }

.sec-col {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: 24px;
  transition: all 0.3s ease;
}
.sec-col.recommended {
  background: rgba(16, 185, 129, 0.08);
  border: 2px solid #10b981;
  box-shadow: 0 0 60px rgba(16, 185, 129, 0.15);
  transform: scale(1.02);
  z-index: 10;
}
[data-theme="light"] .sec-col.recommended {
  background: rgba(16, 185, 129, 0.05);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.1);
}
.sec-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; }
.opt1-text { color: #60a5fa; }
.opt2-text { color: #a78bfa; }

.sec-row {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.sec-row:last-child { border-bottom: none; }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}
.dot.green { background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.3); }
.dot.purple { background: #a78bfa; box-shadow: 0 0 8px rgba(167,139,250,0.3); }
.sec-row strong { display: block; font-size: 13px; color: var(--text-primary); }
.sec-row span { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

/* ── Feature Grid ──────────────────────────────────────────── */
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.feat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: 24px 20px;
}
.feat-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 14px;
}
.auth-bg { background: rgba(239,68,68,0.1); }
.role-bg { background: rgba(59,130,246,0.1); }
.auto-bg { background: rgba(251,191,36,0.1); }
.loc-bg { background: rgba(139,92,246,0.1); }
.feat-card h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
.feat-card ul {
  list-style: none;
  padding: 0;
}
.feat-card li {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  padding: 3px 0 3px 14px;
  position: relative;
}
.feat-card li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-size: 11px;
}
.feat-card li strong { color: var(--text-primary); }
.feat-card li.optional { color: #a78bfa; }
.feat-card li.optional::before { color: #a78bfa; }

/* ── Cost Cards ────────────────────────────────────────────── */
.cost-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
@media (max-width: 768px) { .cost-layout { grid-template-columns: 1fr; } }

.cost-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  padding: 24px;
}
.cost-card.highlight-blue { 
  border: 2px solid #10b981; 
  background: rgba(16, 185, 129, 0.08);
  box-shadow: 0 0 60px rgba(16, 185, 129, 0.15); 
  transform: scale(1.02);
  z-index: 10;
}
[data-theme="light"] .cost-card.highlight-blue {
  background: rgba(16, 185, 129, 0.05);
  border-color: #10b981;
}
.cost-card.highlight-purple { 
  border-color: rgba(139, 92, 246, 0.3); 
  background: rgba(139, 92, 246, 0.04);
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.05); 
}

.cc-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
}
.cc-tag.green { background: rgba(52,211,153,0.15); color: #34d399; }
.cc-tag.purple { background: rgba(139,92,246,0.15); color: #a78bfa; }

.cost-card h3 { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }

.cost-lines { margin-bottom: 16px; }
.cl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-primary);
}
.cl.sub {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  padding: 0 0 10px;
  border-bottom: 1px solid var(--border-primary);
}
.price { font-weight: 700; color: var(--text-primary); white-space: nowrap; }
.price.highlight-green { color: #34d399; }
.price.highlight-red { color: #f87171; }

.cost-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.cost-total span:first-child {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
}
.big-price {
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
}
.big-price small { font-size: 14px; color: var(--text-muted); font-weight: 500; }

.cost-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 18px;
  border-radius: 10px;
  background: rgba(59,130,246,0.04);
  border: 1px solid rgba(59,130,246,0.1);
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
}
.cost-note svg { flex-shrink: 0; margin-top: 1px; color: #60a5fa; }
.cost-note strong { color: var(--text-primary); }
.cost-note.warn {
  background: rgba(251,191,36,0.04);
  border-color: rgba(251,191,36,0.15);
}
.cost-note.warn svg { color: #fbbf24; }

/* ── TCO Table ─────────────────────────────────────────────── */
.tco-table-wrap {
  overflow-x: auto;
  margin-bottom: 24px;
  -webkit-overflow-scrolling: touch;
}
.tco-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 580px;
}
.tco-table th {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 2px solid var(--border-primary);
  vertical-align: bottom;
}
.tco-table th:first-child { width: 30%; }
.th-opt { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.th-name { display: block; font-size: 14px; font-weight: 700; color: var(--text-primary); margin-top: 2px; }

/* Recommended column highlight */
.col-recommended {
  background: rgba(16, 185, 129, 0.04);
  border-left: 2px solid rgba(16, 185, 129, 0.3);
  border-right: 2px solid rgba(16, 185, 129, 0.3);
}
thead .col-recommended {
  border-top: 2px solid #10b981;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: rgba(16, 185, 129, 0.1);
}
.savings-row + tr .col-recommended,
tr:last-child .col-recommended {
  border-bottom: 2px solid rgba(52, 211, 153, 0.2);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.th-reco-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  background: #10b981;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}
.reco-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 100px;
  background: #10b981;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  margin-left: 12px;
  vertical-align: middle;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.tco-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-primary);
}
.row-label { font-weight: 600; color: var(--text-muted); }
.row-label.big { font-size: 15px; color: var(--text-primary); }

.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
}
.tag-green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.tag-red { background: rgba(248,113,113,0.1); color: #f87171; }

.border-row td { border-bottom: 2px solid var(--border-secondary); }
.highlight-row td { background: var(--bg-secondary); }

.tco-val { padding: 16px !important; }
.tco-amount { display: block; font-size: 22px; font-weight: 900; color: var(--text-primary); }
.tco-math { display: block; font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.tco-val.winner .tco-amount { color: #10b981; }

.savings-row td { border-bottom: none; }
.savings-cell {
  text-align: center;
  padding: 16px !important;
}
.save-12, .save-24 {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  margin: 4px 8px;
}
.save-12 {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.save-24 {
  background: rgba(59,130,246,0.1);
  color: #60a5fa;
}

.tco-reco {
  display: flex;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.03));
  border: 1px solid rgba(59,130,246,0.12);
  border-radius: 14px;
}
.reco-icon { font-size: 24px; flex-shrink: 0; }
.tco-reco h4 { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.tco-reco p { font-size: 13px; color: #94a3b8; line-height: 1.7; }
.tco-reco strong { color: #e2e8f0; }

/* ── Support Slide ─────────────────────────────────────────── */
.support-stat {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 14px;
  padding: 28px 20px;
  text-align: center;
}
.ss-num {
  font-size: 42px;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 2px;
}
.ss-unit {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 16px;
}
.support-stat h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.support-stat p { font-size: 13px; color: #94a3b8; line-height: 1.5; }

.support-extra {
  margin-top: 20px;
  padding: 18px 24px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
}
.support-extra strong { color: var(--text-primary); }

.footer-note {
  margin-top: 32px;
  text-align: center;
}
.footer-logo { height: 22px; opacity: 0.4; margin-bottom: 12px; filter: var(--logo-filter); }
.footer-note p { font-size: 13px; color: var(--text-muted); }
.footer-note .small { font-size: 11px; color: var(--text-muted); opacity: 0.8; margin-top: 4px; }

/* ── Navigation Controls ───────────────────────────────────── */
.deck-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px 32px 24px;
  flex-shrink: 0;
}
.ctrl-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.ctrl-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  color: #fff;
  border-color: rgba(255,255,255,0.15);
}
.ctrl-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.dots { display: flex; gap: 6px; }
.dot-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.dot-pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  transition: all 0.3s;
}
.dot-btn.active .dot-pip {
  background: #3b82f6;
  box-shadow: 0 0 10px rgba(59,130,246,0.4);
  transform: scale(1.3);
}
.dot-btn:hover:not(.active) .dot-pip {
  background: rgba(255,255,255,0.3);
}

/* ── Slide Transitions ─────────────────────────────────────── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from { opacity: 0; transform: translateX(60px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-60px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-60px); }
.slide-right-leave-to { opacity: 0; transform: translateX(60px); }

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 640px) {
  .deck-nav { padding: 12px 16px; }
  .slide-viewport { padding: 0 16px; }
  .deck-controls { padding: 12px 16px 20px; gap: 12px; }
  .cost-layout { grid-template-columns: 1fr; }
  .arch-compare, .sec-compare { grid-template-columns: 1fr; }
}
</style>
