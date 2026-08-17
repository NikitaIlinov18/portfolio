/* ==========================================================================
   Портфолио веб-разработчика — main.js (Vanilla JS)
   Меню, плавный скролл, Swiper, валидация формы, анимации появления.
   ========================================================================== */

;(function () {
  'use strict'

  /* ---------- 1. Текущий год в футере ---------- */
  var yearEl = document.getElementById('year')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
  }

  /* ---------- 2. Состояние шапки и кнопка "наверх" ---------- */
  var header = document.getElementById('header')
  var toTop = document.getElementById('to-top')

  function onScrollUI() {
    var y = window.scrollY || window.pageYOffset

    if (header) {
      header.classList.toggle('header--scrolled', y > 12)
    }
    if (toTop) {
      toTop.classList.toggle('to-top--visible', y > 600)
    }
  }

  window.addEventListener('scroll', onScrollUI, { passive: true })
  onScrollUI()

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  /* ---------- 3. Мобильное меню (гамбургер) ---------- */
  var burger = document.getElementById('burger')
  var nav = document.getElementById('nav')
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : []

  function setMenu(open) {
    if (!burger || !nav) return

    burger.classList.toggle('burger--open', open)
    nav.classList.toggle('nav--open', open)
    burger.setAttribute('aria-expanded', String(open))
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню')
    document.body.classList.toggle('is-locked', open)
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var isOpen = nav.classList.contains('nav--open')
      setMenu(!isOpen)
    })

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenu(false)
      })
    })

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('nav--open')) {
        setMenu(false)
      }
    })

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && nav.classList.contains('nav--open')) {
        setMenu(false)
      }
    })
  }

  /* ---------- 4. Плавный якорный скролл ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      var hash = anchor.getAttribute('href')
      if (!hash || hash.length < 2) return

      var target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })

      if (history.pushState) {
        history.pushState(null, '', hash)
      }
    })
  })

  /* ---------- 5. Подсветка активного пункта меню ---------- */
  var sections = document.querySelectorAll('main section[id]')

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return

          var id = entry.target.getAttribute('id')
          navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + id
            link.classList.toggle('nav__link--active', isActive)
          })
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    sections.forEach(function (section) {
      sectionObserver.observe(section)
    })
  }

  /* ---------- 6. Появление элементов при скролле ---------- */
  var revealItems = document.querySelectorAll('[data-reveal]')

  if ('IntersectionObserver' in window && revealItems.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealItems.forEach(function (item) {
      revealObserver.observe(item)
    })
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible')
    })
  }

  /* ---------- 7. Swiper-слайдеры проектов ---------- */
  if (typeof Swiper !== 'undefined') {
    document.querySelectorAll('.project__swiper').forEach(function (swiperEl) {
      var prevBtn = swiperEl
        .closest('.project__media')
        .querySelector('.project__nav--prev')
      var nextBtn = swiperEl
        .closest('.project__media')
        .querySelector('.project__nav--next')

      new Swiper(swiperEl, {
        loop: true,
        speed: 650,
        grabCursor: true,
        slidesPerView: 1,
        autoplay: {
          delay: 4200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        keyboard: { enabled: true },
        pagination: {
          el: swiperEl.querySelector('.project__pagination'),
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          prevEl: prevBtn,
          nextEl: nextBtn,
        },
        a11y: {
          prevSlideMessage: 'Предыдущий слайд',
          nextSlideMessage: 'Следующий слайд',
        },
      })
    })
  }

  /* ---------- 8. Валидация формы обратной связи ---------- */
  var form = document.getElementById('contact-form')

  if (form) {
    var fields = {
      name: {
        el: document.getElementById('field-name'),
        min: 2,
        errorText: 'Укажите имя (минимум 2 символа).',
      },
      contact: {
        el: document.getElementById('field-contact'),
        min: 5,
        errorText: 'Укажите Telegram или телефон, чтобы я мог ответить.',
      },
      message: {
        el: document.getElementById('field-message'),
        min: 10,
        errorText: 'Опишите задачу подробнее (минимум 10 символов).',
      },
    }

    function setFieldState(field, isValid) {
      var wrapper = field.el.closest('.contact-form__field')
      var errorEl = wrapper.querySelector('.contact-form__error')

      wrapper.classList.toggle('contact-form__field--invalid', !isValid)
      field.el.classList.toggle('contact-form__input--error', !isValid)
      field.el.setAttribute('aria-invalid', String(!isValid))
      errorEl.textContent = isValid ? '' : field.errorText
    }

    function validateField(field) {
      var value = field.el.value.trim()
      var isValid = value.length >= field.min
      setFieldState(field, isValid)
      return isValid
    }

    Object.keys(fields).forEach(function (key) {
      var field = fields[key]

      field.el.addEventListener('input', function () {
        if (field.el.classList.contains('contact-form__input--error')) {
          validateField(field)
        }
      })
    })

    form.addEventListener('submit', function (event) {
      event.preventDefault()

      var allValid = true
      var firstInvalid = null

      Object.keys(fields).forEach(function (key) {
        var field = fields[key]
        var isValid = validateField(field)

        if (!isValid) {
          allValid = false
          if (!firstInvalid) {
            firstInvalid = field.el
          }
        }
      })

      if (!allValid) {
        if (firstInvalid) {
          firstInvalid.focus()
        }
        return
      }

      var status = form.querySelector('.contact-form__status')
      var submitBtn = form.querySelector('.contact-form__submit')

      if (status) {
        status.hidden = false
      }

      form.reset()

      if (submitBtn) {
        submitBtn.disabled = true
        var originalHTML = submitBtn.innerHTML
        submitBtn.innerHTML =
          'Отправлено <i class="fa-solid fa-check" aria-hidden="true"></i>'

        setTimeout(function () {
          submitBtn.disabled = false
          submitBtn.innerHTML = originalHTML
        }, 4000)
      }
    })
  }
})()
