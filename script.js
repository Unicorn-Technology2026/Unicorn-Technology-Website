import './style.css'
import { supabase } from './supabaseClient.js'

/* Sticky navbar background on scroll */
const header = document.getElementById('site-header')
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 24)
}
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

/* Mobile menu */
const menuToggle = document.getElementById('menu-toggle')
const navLinks = document.getElementById('nav-links')

const closeMenu = () => {
  navLinks.classList.remove('is-open')
  menuToggle.setAttribute('aria-expanded', 'false')
}

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open')
  menuToggle.setAttribute('aria-expanded', String(isOpen))
})

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu)
})

/* Floating hero particles */
const particlesContainer = document.getElementById('particles')
const PARTICLE_COUNT = 22
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const particle = document.createElement('span')
  particle.className = 'particle'
  particle.style.left = `${Math.random() * 100}%`
  particle.style.bottom = `${-20 - Math.random() * 40}px`
  particle.style.animationDuration = `${8 + Math.random() * 10}s`
  particle.style.animationDelay = `${Math.random() * 10}s`
  particlesContainer.appendChild(particle)
}

/* Scroll reveal via Intersection Observer */
const revealEls = document.querySelectorAll('.reveal')
revealEls.forEach((el) => {
  const delay = el.getAttribute('data-delay')
  if (delay !== null) el.style.setProperty('--delay', delay)
})

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
)
revealEls.forEach((el) => revealObserver.observe(el))

/* Animated stat counters */
const statNumbers = document.querySelectorAll('.stat-number')
const animateCounter = (el) => {
  const target = Number(el.getAttribute('data-target'))
  const suffix = el.getAttribute('data-suffix') || ''
  const duration = 1400
  const start = performance.now()

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(target * eased) + suffix
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.5 }
)
statNumbers.forEach((el) => counterObserver.observe(el))

/* Technologies marquee */
/* Technologies grid */
const TECH_GROUPS = [
  {
    label: 'Frontend',
    items: [
      { name: 'HTML5', icon: 'logos:html-5' },
      { name: 'CSS3', icon: 'logos:css-3' },
      { name: 'JavaScript', icon: 'logos:javascript' },
      { name: 'React', icon: 'logos:react' },
      { name: 'Angular', icon: 'logos:angular-icon' },
      { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
    ],
  },
  {
    label: 'Mobile',
    items: [
      { name: 'React Native', icon: 'logos:react' },
      { name: 'Android', icon: 'logos:android-icon' },
      { name: 'iOS', icon: 'logos:apple' },
      { name: 'Expo', icon: 'logos:expo-icon' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { name: 'Node.js', icon: 'logos:nodejs-icon' },
      { name: 'REST APIs', icon: 'mdi:api' },
      { name: 'Firebase', icon: 'logos:firebase' },
      { name: 'Supabase', icon: 'logos:supabase-icon' },
    ],
  },
  {
    label: 'Tooling',
    items: [
      { name: 'Git', icon: 'logos:git-icon' },
      { name: 'GitHub', icon: 'logos:github-icon' },
      { name: 'Figma', icon: 'logos:figma' },
      { name: 'Postman', icon: 'logos:postman-icon' },
      { name: 'VS Code', icon: 'logos:visual-studio-code' },
    ],
  },
]

const techGroupsContainer = document.getElementById('tech-groups')

techGroupsContainer.innerHTML = TECH_GROUPS.map(
  (group) => `
    <div class="tech-group">
      <h3 class="tech-group-title">${group.label}</h3>
      <div class="tech-grid">
        ${group.items
      .map(
        ({ name, icon }) => `
              <div class="tech-tile">
                <span class="tech-tile-icon">
                  <img src="https://api.iconify.design/${icon}.svg" alt="" width="20" height="20" loading="lazy" />
                </span>
                <span class="tech-tile-name">${name}</span>
              </div>`
      )
      .join('')}
      </div>
    </div>`
).join('')

/* Portfolio filtering */
const filterButtons = document.querySelectorAll('.filter-btn')
const portfolioCards = document.querySelectorAll('.portfolio-card')

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter')

    filterButtons.forEach((btn) => {
      btn.classList.remove('is-active')
      btn.setAttribute('aria-selected', 'false')
    })
    button.classList.add('is-active')
    button.setAttribute('aria-selected', 'true')

    portfolioCards.forEach((card) => {
      const matches = filter === 'all' || card.getAttribute('data-category') === filter
      card.classList.toggle('is-hidden', !matches)
    })
  })
})

/* Contact form validation + submission */
const form = document.getElementById('contact-form')
const submitBtn = document.getElementById('submit-btn')
const formStatus = document.getElementById('form-status')

const FIELD_VALIDATORS = {
  fullName: (value) => (value.trim().length >= 2 ? '' : 'Please enter your full name.'),
  email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.'),
  phone: (value) => (/^[+\d][\d\s-]{7,}$/.test(value) ? '' : 'Please enter a valid phone number.'),
  serviceRequired: (value) => (value ? '' : 'Please select a service.'),
  projectDetails: (value) => (value.trim().length >= 10 ? '' : 'Please share a few more details (10+ characters).'),
}

const showFieldError = (name, message) => {
  const field = form.elements[name]
  const errorEl = document.getElementById(`error-${name}`)
  const wrapper = field.closest('.form-field')
  if (errorEl) errorEl.textContent = message
  wrapper.classList.toggle('has-error', Boolean(message))
}

const validateForm = () => {
  let isValid = true
  Object.entries(FIELD_VALIDATORS).forEach(([name, validator]) => {
    const message = validator(form.elements[name].value)
    if (message) isValid = false
    showFieldError(name, message)
  })
  return isValid
}

Object.keys(FIELD_VALIDATORS).forEach((name) => {
  form.elements[name].addEventListener('blur', () => {
    showFieldError(name, FIELD_VALIDATORS[name](form.elements[name].value))
  })
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  formStatus.className = 'form-status'
  formStatus.textContent = ''

  if (!validateForm()) {
    formStatus.textContent = 'Please fix the highlighted fields and try again.'
    formStatus.className = 'form-status is-error'
    return
  }

  submitBtn.disabled = true
  submitBtn.querySelector('.btn-label').textContent = 'Sending...'

  const { error } = await supabase.from('contact_submissions').insert({
    full_name: form.elements.fullName.value.trim(),
    email: form.elements.email.value.trim(),
    phone: form.elements.phone.value.trim(),
    company_name: form.elements.companyName.value.trim(),
    service_required: form.elements.serviceRequired.value,
    project_details: form.elements.projectDetails.value.trim(),
  })

  submitBtn.disabled = false
  submitBtn.querySelector('.btn-label').textContent = 'Send Message'

  if (error) {
    formStatus.textContent = 'Something went wrong while sending your message. Please try again in a moment.'
    formStatus.className = 'form-status is-error'
    return
  }

  form.reset()
  formStatus.textContent = 'Thank you! Your message has been sent. Our team will get back to you shortly.'
  formStatus.className = 'form-status is-success'
})
