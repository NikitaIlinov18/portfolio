document.addEventListener('DOMContentLoaded', () => {
  const body = document.body
  const burger = document.querySelector('.header__burger')
  const navigation = document.querySelector('.nav')
  const navigationLinks = document.querySelectorAll('.nav__link')
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  const currentYear = document.querySelector('#current-year')

  const openMenu = () => {
    navigation.classList.add('nav--open')
    burger.classList.add('header__burger--active')

    burger.setAttribute('aria-expanded', 'true')
    burger.setAttribute('aria-label', 'Закрыть меню')

    body.classList.add('body--locked')
  }

  const closeMenu = () => {
    navigation.classList.remove('nav--open')
    burger.classList.remove('header__burger--active')

    burger.setAttribute('aria-expanded', 'false')
    burger.setAttribute('aria-label', 'Открыть меню')

    body.classList.remove('body--locked')
  }

  if (burger && navigation) {
    burger.addEventListener('click', () => {
      const isMenuOpen = navigation.classList.contains('nav--open')

      if (isMenuOpen) {
        closeMenu()
      } else {
        openMenu()
      }
    })

    navigationLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu()
      })
    })

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        navigation.classList.contains('nav--open')
      ) {
        closeMenu()
      }
    })

    document.addEventListener('click', (event) => {
      const clickedInsideNavigation = navigation.contains(event.target)
      const clickedBurger = burger.contains(event.target)

      if (
        navigation.classList.contains('nav--open') &&
        !clickedInsideNavigation &&
        !clickedBurger
      ) {
        closeMenu()
      }
    })
  }

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href')

      if (!targetId || targetId === '#') {
        return
      }

      const target = document.querySelector(targetId)

      if (!target) {
        return
      }

      event.preventDefault()

      const header = document.querySelector('.header')
      const headerHeight = header ? header.offsetHeight : 0

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      })

      if (navigation.classList.contains('nav--open')) {
        closeMenu()
      }
    })
  })

  const sliders = document.querySelectorAll('.project-card__slider')

  sliders.forEach((slider) => {
    new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      speed: 500,
      grabCursor: true,

      pagination: {
        el: slider.querySelector('.swiper-pagination'),
        clickable: true,
      },

      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
    })
  })

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear()
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 800 && navigation.classList.contains('nav--open')) {
      closeMenu()
    }
  })
})
