;(function () {
  var screenIds = [
    'ob',
    'signup',
    'home',
    'search',
    'post',
    'detail',
    'chat',
    'inbox',
    'profile',
    'dashboard',
    'notifs',
    'history',
    'settings',
    'sos',
    'sub',
  ]
  var obIndex = 0
  var obCount = 3
  var toastTimer = null
  var currentScreen = 'ob'

  function byId(id) {
    return document.getElementById(id)
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector))
  }

  function screenElement(name) {
    return byId('s-' + name)
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function updateOnboarding() {
    var hero = byId('ob-hero')
    var text = byId('ob-text')
    var dots = qsa('.obdot', byId('ob-dots'))
    var cta = byId('ob-cta')

    if (hero) {
      hero.style.transform = 'translateX(' + -obIndex * 100 + '%)'
    }
    if (text) {
      text.style.transform = 'translateX(' + -obIndex * 100 + '%)'
    }

    dots.forEach(function (dot, index) {
      dot.classList.toggle('on', index === obIndex)
      dot.style.width = index === obIndex ? '20px' : '6px'
    })

    if (cta) {
      cta.textContent = obIndex === obCount - 1 ? 'Create Your Account' : "Get Started - It's Free"
    }
  }

  function updateNavState(target) {
    var navButtons = qsa('.xb', byId('xnav'))
    navButtons.forEach(function (button) {
      var action = button.getAttribute('onclick') || ''
      button.classList.toggle('on', action.indexOf("'" + target + "'") !== -1)
    })

    var group = target
    if (['detail', 'chat', 'inbox'].indexOf(target) !== -1) {
      group = target === 'detail' ? 'home' : target
    }
    if (['dashboard', 'history', 'settings', 'sub', 'sos'].indexOf(target) !== -1) {
      group = 'profile'
    }

    qsa('.scr').forEach(function (screen) {
      qsa('.tb, .tc', screen).forEach(function (tab) {
        tab.classList.remove('on')
      })

      qsa('.tb, .tc', screen).forEach(function (tab) {
        var text = (tab.textContent || '').toLowerCase()
        if (group === 'home' && text.indexOf('home') !== -1) {
          tab.classList.add('on')
        }
        if (group === 'search' && text.indexOf('search') !== -1) {
          tab.classList.add('on')
        }
        if (group === 'post' && text.indexOf('post') !== -1) {
          tab.classList.add('on')
        }
        if (group === 'inbox' && text.indexOf('message') !== -1) {
          tab.classList.add('on')
        }
        if (group === 'profile' && text.indexOf('profile') !== -1) {
          tab.classList.add('on')
        }
      })
    })

    // Sync desktop nav active state
    var desktopNav = byId('desktnav')
    if (desktopNav) {
      qsa('.dnb', desktopNav).forEach(function (btn) {
        btn.classList.toggle('on', btn.getAttribute('data-screen') === group)
      })
    }
  }

  function closeTransientUi() {
    qsa('.ratover.on').forEach(function (overlay) {
      overlay.classList.remove('on')
    })
  }

  function go(target) {
    if (screenIds.indexOf(target) === -1) {
      return
    }

    qsa('.scr').forEach(function (screen) {
      screen.classList.toggle('on', screen.id === 's-' + target)
    })

    currentScreen = target
    closeTransientUi()
    updateNavState(target)

    var activeScroll = screenElement(target) ? screenElement(target).querySelector('.sa') : null
    if (activeScroll) {
      activeScroll.scrollTop = 0
    }

    if (target === 'chat') {
      scrollChatToEnd()
      setTimeout(function () {
        var input = byId('chatInp')
        if (input) {
          input.focus()
        }
      }, 60)
    }
  }

  function obNext() {
    if (obIndex < obCount - 1) {
      obIndex += 1
      updateOnboarding()
      return
    }
    go('signup')
  }

  function showOTP() {
    var step1 = byId('signup-step1')
    var step2 = byId('signup-step2')
    if (step1) {
      step1.style.display = 'none'
    }
    if (step2) {
      step2.style.display = ''
    }
    var firstBox = document.querySelector('.otpbox')
    if (firstBox) {
      firstBox.focus()
    }
  }

  function otpMove(input, index) {
    input.value = input.value.replace(/\D/g, '').slice(0, 1)
    if (input.value && index < 4) {
      var next = qsa('.otpbox')[index]
      if (next) {
        next.focus()
      }
    }
  }

  function chipSel(button, containerId) {
    var container = byId(containerId)
    if (!container) {
      return
    }
    qsa('.chip', container).forEach(function (chip) {
      chip.classList.remove('on')
    })
    button.classList.add('on')
  }

  function stepChg(button, delta) {
    var step = button.closest('.step')
    if (!step) {
      return
    }
    var valueNode = step.querySelector('.sval')
    var current = parseInt(valueNode.textContent, 10)
    var next = Math.max(1, Math.min(8, current + delta))
    valueNode.textContent = String(next)
  }

  function showToast(message) {
    var toast = byId('toast')
    if (!toast) {
      return
    }
    toast.textContent = message
    toast.style.display = 'block'
    toast.style.opacity = '1'
    clearTimeout(toastTimer)
    toastTimer = setTimeout(function () {
      toast.style.opacity = '0'
      setTimeout(function () {
        toast.style.display = 'none'
      }, 220)
    }, 2200)
  }

  function setStar(rating) {
    qsa('.bigstar', byId('starRow')).forEach(function (star, index) {
      star.classList.toggle('lit', index < rating)
    })
  }

  function submitRating() {
    var overlay = byId('rat')
    if (overlay) {
      overlay.classList.remove('on')
    }
    showToast('Review submitted')
  }

  function addEmoji(emoji) {
    var input = byId('chatInp')
    if (!input) {
      return
    }
    input.value += emoji
    input.focus()
  }

  function scrollChatToEnd() {
    var chatArea = byId('chatArea')
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight
    }
  }

  function sendMsg() {
    var input = byId('chatInp')
    var target = byId('chatMsgs')
    if (!input || !target) {
      return
    }

    var value = input.value.trim()
    if (!value) {
      return
    }

    var time = new Date()
    var hours = time.getHours()
    var minutes = String(time.getMinutes()).padStart(2, '0')
    var meridiem = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12

    var wrapper = document.createElement('div')
    wrapper.className = 'mwrap out'
    wrapper.innerHTML =
      '<div class="bout"><div class="btxt">' +
      escapeHtml(value) +
      '</div><div class="bmeta">' +
      hours +
      ':' +
      minutes +
      ' ' +
      meridiem +
      ' \u2713\u2713</div></div>'
    target.appendChild(wrapper)
    input.value = ''
    scrollChatToEnd()
  }

  function segSel(button) {
    var group = button.parentElement
    if (!group) {
      return
    }
    qsa('.segbtn', group).forEach(function (candidate) {
      candidate.classList.remove('on')
    })
    button.classList.add('on')
  }

  function bindScrollMorph() {
    var nav = byId('desktnav')
    if (!nav) {
      return
    }
    qsa('.sa').forEach(function (area) {
      area.addEventListener(
        'scroll',
        function () {
          if (area.scrollTop > 30) {
            nav.classList.add('scrolled')
          } else {
            nav.classList.remove('scrolled')
          }
        },
        { passive: true },
      )
    })
  }

  function bindScrollAwareTabbars() {
    qsa('.scr').forEach(function (screen) {
      var scrollArea = screen.querySelector('.sa')
      var tabbar = screen.querySelector('.tabbar')
      if (!scrollArea || !tabbar) {
        return
      }

      var lastScrollTop = 0
      scrollArea.addEventListener(
        'scroll',
        function () {
          var top = scrollArea.scrollTop
          if (top <= 14) {
            tabbar.classList.remove('compact')
            lastScrollTop = top
            return
          }

          if (top > lastScrollTop + 6) {
            tabbar.classList.add('compact')
          } else if (top < lastScrollTop - 6) {
            tabbar.classList.remove('compact')
          }
          lastScrollTop = top
        },
        { passive: true },
      )
    })
  }

  function bindMessageButtons() {
    qsa('.racc').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation()
        showToast('Seat request accepted')
      })
    })

    qsa('.rdec').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation()
        showToast('Request dismissed')
      })
    })
  }

  function init() {
    updateOnboarding()
    updateNavState(currentScreen)
    bindScrollAwareTabbars()
    bindScrollMorph()
    bindMessageButtons()
    scrollChatToEnd()
  }

  window.go = go
  window.obNext = obNext
  window.showOTP = showOTP
  window.otpMove = otpMove
  window.chipSel = chipSel
  window.stepChg = stepChg
  window.showToast = showToast
  window.setStar = setStar
  window.submitRating = submitRating
  window.addEmoji = addEmoji
  window.sendMsg = sendMsg
  window.segSel = segSel

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
