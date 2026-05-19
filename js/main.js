(() => {
  "use strict";

  const photos = [
    "photo/photo1.jpg",
    "photo/photo2.jpg",
    "photo/photo3.jpg",
    "photo/photo4.jpg",
    "photo/photo5.jpg",
    "photo/photo6.jpg",
    "photo/photo7.jpg",
    "photo/photo8.jpg",
    "photo/photo9.jpg",
    "photo/photo10.jpg",
    "photo/1.jpeg",
    "photo/2.jpeg",
    "photo/3.jpeg",
    "photo/4.jpeg",
    "photo/5.jpeg",
    "photo/6.jpeg",
    "photo/7.jpeg",
    "photo/8.jpeg",
    "photo/9.jpeg",
    "photo/10.jpeg",
    "photo/11.jpeg",
    "photo/12.jpeg",
    "photo/13.jpeg",
    "photo/14.jpeg",
    "photo/15.jpeg",
    "photo/16.jpeg",
    "photo/17.jpeg"
  ];

  // Editable birthday target date/time.
  const DEFAULT_BIRTHDAY_TARGET = "2026-05-21T00:00:00+10:00";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const on = (node, eventName, handler, options) => {
    if (node) {
      node.addEventListener(eventName, handler, options);
    }
  };

  const body = document.body;
  if (!body) {
    return;
  }

  const THEME_KEY = "denaya_theme";
  const THEME_DEEP = "deep-burgundy";
  const THEME_SOFT = "soft-pink";
  let isNavigating = false;

  applySavedTheme();

  const cleanupIntervals = [];

  const confettiPalette = ["#b41627", "#d7192b", "#ff8fa8", "#fff8f2", "#f0b24b"];

  initAmbientEffects();
  initGiftOpening();
  initCountdown();
  initBirthdayContinue();
  initStoryFlowLinks();
  initThemeToggle();
  initMusicToggle();
  initShareAction();
  initMemoriesGrid();
  initMomentsCarousel();
  initReasonsCarousel();
  initFutureCardSelection();
  initLetterTypewriter();
  initLocalSongPlayer();
  initSurpriseAction();
  initModalDismissHandlers();

  on(window, "beforeunload", () => {
    cleanupIntervals.forEach((id) => window.clearInterval(id));
  });

  function initAmbientEffects() {
    const confettiMode = body.dataset.confetti || "";
    const petalsEnabled = body.dataset.petals === "true";
    const fireworksEnabled = body.dataset.fireworks === "true";

    if (confettiMode) {
      startConfetti(confettiMode);
    }

    if (petalsEnabled) {
      startPetals();
    }

    if (fireworksEnabled) {
      startFireworks();
    }
  }

  function applySavedTheme() {
    let savedTheme = THEME_DEEP;
    try {
      const stored = window.localStorage.getItem(THEME_KEY);
      if (stored === THEME_DEEP || stored === THEME_SOFT) {
        savedTheme = stored;
      }
    } catch (error) {
      savedTheme = THEME_DEEP;
    }

    body.dataset.theme = savedTheme;
  }

  function initThemeToggle() {
    const toggleButton = qs("#themeToggle");
    if (!toggleButton) {
      return;
    }

    const icon = qs(".icon-theme", toggleButton);

    const render = () => {
      const currentTheme = body.dataset.theme === THEME_SOFT ? THEME_SOFT : THEME_DEEP;
      const isSoft = currentTheme === THEME_SOFT;
      toggleButton.classList.toggle("is-soft", isSoft);
      toggleButton.setAttribute("aria-pressed", isSoft ? "true" : "false");
      toggleButton.setAttribute("title", `Theme: ${isSoft ? "Soft Pink" : "Deep Burgundy"}`);
      if (icon) {
        icon.textContent = isSoft ? "S" : "D";
      }
    };

    render();

    on(toggleButton, "click", () => {
      const currentTheme = body.dataset.theme === THEME_SOFT ? THEME_SOFT : THEME_DEEP;
      const nextTheme = currentTheme === THEME_SOFT ? THEME_DEEP : THEME_SOFT;

      body.dataset.theme = nextTheme;
      try {
        window.localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        // Ignore storage failures and keep in-memory theme.
      }

      render();
    });
  }

  function startConfetti(mode) {
    const layer = createLayer("confetti-layer");
    const gap = mode === "heavy" ? 120 : 260;

    const loop = window.setInterval(() => {
      spawnConfettiPiece(layer);
    }, gap);

    cleanupIntervals.push(loop);

    for (let i = 0; i < 12; i += 1) {
      window.setTimeout(() => spawnConfettiPiece(layer), i * 120);
    }
  }

  function spawnConfettiPiece(layer, fixedX, fixedY, burstMode = false) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const color = confettiPalette[randomInt(0, confettiPalette.length - 1)];
    const left = typeof fixedX === "number" ? fixedX : Math.random() * window.innerWidth;
    const top = typeof fixedY === "number" ? fixedY : -26;
    const drift = `${randomFloat(-90, 120).toFixed(2)}px`;
    const spin = `${randomFloat(230, 880).toFixed(2)}deg`;
    const duration = burstMode ? randomFloat(0.8, 1.4) : randomFloat(3.3, 6.2);

    piece.style.left = `${left}px`;
    piece.style.top = `${top}px`;
    piece.style.background = color;
    piece.style.setProperty("--x-drift", drift);
    piece.style.setProperty("--spin", spin);
    piece.style.animationDuration = `${duration}s`;

    if (burstMode) {
      piece.style.width = `${randomFloat(5, 10).toFixed(0)}px`;
      piece.style.height = `${randomFloat(9, 15).toFixed(0)}px`;
    }

    layer.appendChild(piece);
    window.setTimeout(() => piece.remove(), (duration + 0.2) * 1000);
  }

  function startPetals() {
    const layer = createLayer("petal-layer");
    const loop = window.setInterval(() => {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.left = `${Math.random() * window.innerWidth}px`;
      petal.style.top = "-28px";
      petal.style.setProperty("--x-drift", `${randomFloat(-110, 110).toFixed(2)}px`);
      petal.style.setProperty("--rotate", `${randomFloat(-260, 260).toFixed(2)}deg`);
      petal.style.animationDuration = `${randomFloat(5.6, 10.8).toFixed(2)}s`;
      petal.style.opacity = `${randomFloat(0.55, 0.9).toFixed(2)}`;
      layer.appendChild(petal);

      window.setTimeout(() => petal.remove(), 12000);
    }, 620);

    cleanupIntervals.push(loop);
  }

  function startFireworks() {
    const loop = window.setInterval(() => {
      const x = randomFloat(window.innerWidth * 0.12, window.innerWidth * 0.88);
      const y = randomFloat(window.innerHeight * 0.18, window.innerHeight * 0.62);
      createFireworkBurst(x, y, randomInt(20, 30));
    }, 1150);

    cleanupIntervals.push(loop);

    window.setTimeout(() => {
      createFireworkBurst(window.innerWidth * 0.48, window.innerHeight * 0.3, 26);
    }, 500);
  }

  function createFireworkBurst(x, y, count = 24) {
    for (let i = 0; i < count; i += 1) {
      const spark = document.createElement("span");
      spark.className = "firework-dot";

      const angle = (Math.PI * 2 * i) / count;
      const distance = randomFloat(34, 160);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--dx", `${dx.toFixed(2)}px`);
      spark.style.setProperty("--dy", `${dy.toFixed(2)}px`);
      spark.style.background = confettiPalette[randomInt(0, confettiPalette.length - 1)];
      spark.style.boxShadow = "0 0 12px currentColor";

      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 1100);
    }
  }

  function flashFireworksGlow() {
    const glow = document.createElement("div");
    glow.className = "fireworks-glow";
    document.body.appendChild(glow);
    window.setTimeout(() => glow.remove(), 1000);
  }

  function createLayer(className) {
    const existing = qs(`.${className}`);
    if (existing) {
      return existing;
    }

    const layer = document.createElement("div");
    layer.className = `particle-layer ${className}`;
    document.body.appendChild(layer);
    return layer;
  }

  function initGiftOpening() {
    const giftButton = qs("#giftOpenBtn");
    if (!giftButton) {
      return;
    }

    on(giftButton, "click", () => {
      if (giftButton.classList.contains("is-opening")) {
        return;
      }

      giftButton.classList.add("is-opening");
      const confettiLayer = createLayer("confetti-layer");
      const x = window.innerWidth / 2;
      const y = window.innerHeight * 0.42;

      for (let i = 0; i < 34; i += 1) {
        spawnConfettiPiece(confettiLayer, x + randomFloat(-22, 22), y + randomFloat(-8, 14), true);
      }

      createFireworkBurst(x, y, 24);

      window.setTimeout(() => {
        navigateTo("countdown.html", 220);
      }, 1100);
    });
  }

  function initCountdown() {
    const daysEl = qs("#days");
    const hoursEl = qs("#hours");
    const minutesEl = qs("#minutes");
    const secondsEl = qs("#seconds");
    const msEl = qs("#milliseconds");
    const skipBtn = qs("#skipCountdown");
    let countdownCompleted = false;

    if (skipBtn) {
      on(skipBtn, "click", () => {
        navigateTo("home.html");
      });
    }

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !msEl) {
      return;
    }

    const targetRaw = body.dataset.targetDate || DEFAULT_BIRTHDAY_TARGET;
    const targetDate = new Date(targetRaw);
    const safeTarget = Number.isNaN(targetDate.getTime()) ? new Date(DEFAULT_BIRTHDAY_TARGET) : targetDate;

    const render = () => {
      const now = Date.now();
      const diff = safeTarget.getTime() - now;

      if (diff <= 0) {
        if (countdownCompleted) {
          return true;
        }

        countdownCompleted = true;
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        msEl.textContent = "000";

        triggerCountdownCelebration("home.html");
        return true;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const milliseconds = Math.floor(diff % 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
      msEl.textContent = String(milliseconds).padStart(3, "0");

      return false;
    };

    const alreadyFinished = render();
    if (alreadyFinished) {
      return;
    }

    const timer = window.setInterval(() => {
      const finished = render();
      if (finished) {
        window.clearInterval(timer);
      }
    }, 33);

    cleanupIntervals.push(timer);
  }

  function triggerCountdownCelebration(nextUrl) {
    body.classList.add("countdown-is-complete");

    const banner = document.createElement("div");
    banner.className = "countdown-celebration";
    banner.innerHTML = "<span>Happy Birthday!</span>";
    document.body.appendChild(banner);

    const layer = createLayer("confetti-layer");
    const burstCount = 110;

    for (let i = 0; i < burstCount; i += 1) {
      window.setTimeout(() => {
        const x = randomFloat(window.innerWidth * 0.08, window.innerWidth * 0.92);
        const y = randomFloat(window.innerHeight * 0.16, window.innerHeight * 0.5);
        spawnConfettiPiece(layer, x, y, true);
      }, i * 10);
    }

    for (let i = 0; i < 4; i += 1) {
      window.setTimeout(() => {
        createFireworkBurst(
          randomFloat(window.innerWidth * 0.18, window.innerWidth * 0.82),
          randomFloat(window.innerHeight * 0.2, window.innerHeight * 0.62),
          22
        );
      }, i * 280);
    }

    window.setTimeout(() => {
      navigateTo(nextUrl, 780);
    }, 1850);

    window.setTimeout(() => {
      banner.remove();
    }, 2600);
  }

  function initBirthdayContinue() {
    const button = qs("#continueToHome");
    if (!button) {
      return;
    }

    on(button, "click", () => {
      navigateTo("moments.html");
    });
  }

  function initStoryFlowLinks() {
    qsa("a[data-flow-link]").forEach((link) => {
      on(link, "click", (event) => {
        if (event.defaultPrevented || event.button !== 0) {
          return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        const href = link.getAttribute("href");
        if (!href) {
          return;
        }

        event.preventDefault();

        const transition = link.dataset.transition || "default";
        if (transition === "card") {
          link.classList.add("is-opening");
          body.classList.add("is-card-opening");
        }

        if (transition === "cd" && link.classList.contains("cd-nav")) {
          link.classList.add("is-rolling");
        }

        if (transition.startsWith("gift-")) {
          link.classList.add("is-selected");
          body.classList.add("gift-transitioning", `gift-transition-${transition.slice(5)}`);
        }

        const delay = transition === "cd" ? 980 : transition === "card" ? 1450 : transition.startsWith("gift-") ? 1080 : 560;
        navigateTo(href, delay, transition);
      });
    });
  }

  function initMusicToggle() {
    const musicBtn = qs("#musicToggle");
    if (!musicBtn) {
      return;
    }

    const storageKey = "denaya_music_on";
    const player = createRomanticAudioPlayer();

    const setVisualState = (active) => {
      musicBtn.classList.toggle("is-on", active);
      musicBtn.setAttribute("aria-pressed", active ? "true" : "false");
    };

    const storedState = window.localStorage.getItem(storageKey) === "true";
    setVisualState(storedState);

    if (storedState) {
      on(window, "pointerdown", () => {
        player.start();
      }, { once: true });
    }

    on(musicBtn, "click", async () => {
      const nowOn = await player.toggle();
      setVisualState(nowOn);
      window.localStorage.setItem(storageKey, String(nowOn));
    });
  }

  function createRomanticAudioPlayer() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return {
        start: async () => false,
        stop: () => false,
        toggle: async () => false
      };
    }

    let context = null;
    let masterGain = null;
    let loop = null;
    let isOn = false;
    let index = 0;

    const melody = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23];

    const ensureContext = async () => {
      if (!context) {
        context = new AudioContextClass();
        masterGain = context.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(context.destination);
      }

      if (context.state === "suspended") {
        await context.resume();
      }
    };

    const playTone = (frequency, duration = 0.5) => {
      if (!context || !masterGain) {
        return;
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(0.04, now + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.start(now);
      oscillator.stop(now + duration + 0.06);
    };

    const startLoop = () => {
      if (loop) {
        window.clearInterval(loop);
      }

      playTone(melody[index % melody.length]);

      loop = window.setInterval(() => {
        if (!isOn) {
          return;
        }

        const current = melody[index % melody.length];
        playTone(current, 0.5);

        if (index % 4 === 0) {
          playTone(current / 2, 0.65);
        }

        index += 1;
      }, 560);
    };

    const start = async () => {
      await ensureContext();
      if (isOn) {
        return true;
      }

      isOn = true;
      startLoop();
      return true;
    };

    const stop = () => {
      isOn = false;
      if (loop) {
        window.clearInterval(loop);
        loop = null;
      }
      return false;
    };

    const toggle = async () => {
      if (isOn) {
        stop();
        return false;
      }

      await start();
      return true;
    };

    return { start, stop, toggle };
  }

  function initShareAction() {
    const shareBtn = qs("#shareBtn");
    if (!shareBtn) {
      return;
    }

    on(shareBtn, "click", async () => {
      const baseUrl = window.location.href.includes("home.html")
        ? window.location.href.replace("home.html", "index.html")
        : window.location.href;

      const payload = {
        title: "For Denaya Lydia",
        text: "A birthday card made with love.",
        url: baseUrl
      };

      try {
        if (navigator.share) {
          await navigator.share(payload);
          return;
        }

        if (navigator.clipboard) {
          await navigator.clipboard.writeText(payload.url);
          const original = shareBtn.textContent;
          shareBtn.textContent = "Copied";
          window.setTimeout(() => {
            shareBtn.textContent = original;
          }, 1300);
        }
      } catch (error) {
        // Ignore share dismissal errors.
      }
    });
  }

  function initMemoriesGrid() {
    const grid = qs("#memoriesGrid");
    if (!grid) {
      return;
    }

    const captions = [
      "Our little moment",
      "Favorite memory",
      "Us being us",
      "A day I want to remember",
      "A little piece of us"
    ];

    const rotations = [-5, 3, -2, 6, -4, 2, -6, 4, -3, 5];

    photos.forEach((src, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "polaroid-card";
      card.style.transform = `rotate(${rotations[index % rotations.length]}deg)`;

      const caption = captions[index % captions.length];
      card.innerHTML = `<img src="${src}" alt="Memory ${index + 1}" /><p>${caption}</p>`;

      on(card, "click", () => {
        openPhotoModal(src, caption);
      });

      grid.appendChild(card);
    });
  }

  function openPhotoModal(src, caption) {
    const modal = qs("#photoModal");
    const modalImage = qs("#photoModalImage");
    const modalCaption = qs("#photoModalCaption");

    if (!modal || !modalImage || !modalCaption) {
      return;
    }

    modalImage.src = src;
    modalCaption.textContent = caption;
    openModal(modal);
  }

  function initMomentsCarousel() {
    const image = qs("#momentsImage");
    const description = qs("#momentsDescription");
    const dotsHost = qs("#momentsDots");

    if (!image || !description || !dotsHost) {
      return;
    }

    const descriptions = [
      "Our little moment",
      "Favorite memory",
      "Us being us",
      "A day I want to remember",
      "A little piece of us",
      "Your smile, my peace",
      "Still my favorite place",
      "Just us, always",
      "You and me in one frame",
      "No description"
    ];

    let active = 0;

    const render = () => {
      image.src = photos[active];
      image.alt = `Moment ${active + 1}`;
      description.textContent = descriptions[active] || "No description";

      qsa(".dot", dotsHost).forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    };

    photos.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Open moment ${index + 1}`);
      on(dot, "click", () => {
        active = index;
        render();
      });
      dotsHost.appendChild(dot);
    });

    on(qs("#momentsPrev"), "click", () => {
      active = (active - 1 + photos.length) % photos.length;
      render();
    });

    on(qs("#momentsNext"), "click", () => {
      active = (active + 1) % photos.length;
      render();
    });

    render();
  }

  function initReasonsCarousel() {
    const title = qs("#reasonsTitle");
    const bodyText = qs("#reasonsBody");
    const next = qs("#reasonsNext");
    const dotsHost = qs("#reasonsDots");

    if (!title || !bodyText || !next || !dotsHost) {
      return;
    }

    const slides = [
      {
        title: "What I love most about you",
        body:
          "I love how your laughter lightens every room and how your hands find mine without asking, sayang. I love the way you care for us and make ordinary moments feel like home."
      },
      {
        title: "Your Smile",
        body: "Your smile makes even ordinary days feel warmer."
      },
      {
        title: "Your Care",
        body: "I love how gently you care, even in the smallest ways."
      },
      {
        title: "Your Laugh",
        body: "Your laugh is one of my favorite sounds."
      },
      {
        title: "Your Heart",
        body: "Your heart makes everything around you softer."
      }
    ];

    let current = 0;

    const render = () => {
      title.textContent = slides[current].title;
      bodyText.textContent = slides[current].body;

      qsa(".dot", dotsHost).forEach((dot, index) => {
        dot.classList.toggle("is-active", index === current);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Reason slide ${index + 1}`);
      on(dot, "click", () => {
        current = index;
        render();
      });
      dotsHost.appendChild(dot);
    });

    on(next, "click", () => {
      current = (current + 1) % slides.length;
      render();
    });

    render();
  }

  function initFutureCardSelection() {
    const cards = qsa(".dream-chip");
    if (!cards.length) {
      return;
    }

    cards.forEach((card) => {
      on(card, "click", () => {
        card.classList.toggle("is-selected");
      });
    });
  }

  function initLetterTypewriter() {
    const target = qs("#letterTypewriter");
    if (!target) {
      return;
    }

    const text = target.dataset.text || target.textContent || "";
    target.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.setAttribute("aria-hidden", "true");
    target.appendChild(cursor);

    let i = 0;

    const typeNext = () => {
      if (i >= text.length) {
        cursor.remove();
        return;
      }

      const char = text.charAt(i);
      cursor.insertAdjacentText("beforebegin", char);
      i += 1;

      const delay = /[,.!?]/.test(char) ? 86 : 22;
      window.setTimeout(typeNext, delay);
    };

    typeNext();
  }

  function initLocalSongPlayer() {
    const audio = qs("#songAudio");
    const disc = qs("#songDisc");
    const toggle = qs("#songToggle");
    const progress = qs("#songProgress");

    if (!audio) {
      return;
    }

    const renderState = () => {
      const isPlaying = !audio.paused && !audio.ended;
      body.classList.toggle("song-is-playing", isPlaying);

      if (toggle) {
        toggle.textContent = isPlaying ? "Pause song" : "Play song";
      }

      if (disc) {
        disc.setAttribute("aria-label", isPlaying ? "Pause Best Part" : "Play Best Part");
      }
    };

    const togglePlayback = async () => {
      if (audio.paused || audio.ended) {
        try {
          await audio.play();
        } catch (error) {
          renderState();
        }
        return;
      }

      audio.pause();
    };

    on(disc, "click", togglePlayback);
    on(toggle, "click", togglePlayback);
    on(audio, "play", renderState);
    on(audio, "pause", renderState);
    on(audio, "ended", renderState);
    on(audio, "timeupdate", () => {
      if (!progress || !Number.isFinite(audio.duration) || audio.duration <= 0) {
        return;
      }

      const percent = Math.min(100, (audio.currentTime / audio.duration) * 100);
      progress.style.width = `${percent}%`;
    });

    renderState();
  }

  function initSurpriseAction() {
    const button = qs("#surpriseBtn");
    const modal = qs("#surpriseModal");

    if (!button || !modal) {
      return;
    }

    on(button, "click", () => {
      openModal(modal);

      const x = window.innerWidth / 2;
      const y = window.innerHeight * 0.48;

      createFireworkBurst(x, y, 28);
      createHeartBurst(x, y, 32);
      flashFireworksGlow();

      const confettiLayer = createLayer("confetti-layer");
      for (let i = 0; i < 40; i += 1) {
        spawnConfettiPiece(confettiLayer, x + randomFloat(-18, 18), y + randomFloat(-12, 12), true);
      }
    });
  }

  function createHeartBurst(x, y, count = 24) {
    for (let i = 0; i < count; i += 1) {
      const heart = document.createElement("span");
      heart.className = "heart-particle";

      const angle = (Math.PI * 2 * i) / count;
      const distance = randomFloat(40, 180);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.setProperty("--dx", `${dx.toFixed(2)}px`);
      heart.style.setProperty("--dy", `${dy.toFixed(2)}px`);

      document.body.appendChild(heart);
      window.setTimeout(() => heart.remove(), 1250);
    }
  }

  function initModalDismissHandlers() {
    qsa("[data-close-modal]").forEach((trigger) => {
      on(trigger, "click", () => {
        const modal = trigger.closest(".modal");
        if (modal) {
          closeModal(modal);
        }
      });
    });

    on(document, "keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      qsa(".modal.is-open").forEach((modal) => closeModal(modal));
    });
  }

  function openModal(modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  function navigateTo(url, delay = 560, transition = "default") {
    if (!url || isNavigating) {
      return;
    }

    isNavigating = true;
    if (transition === "cd") {
      body.classList.add("is-cd-transitioning");
      playCdTransition(delay);
    } else if (transition === "card") {
      body.classList.add("is-card-transitioning");
      playCardOpenTransition(delay);
    } else if (transition.startsWith("gift-")) {
      playGiftTransition(delay, transition.slice(5));
    } else {
      playCinematicTransition(delay);
      body.classList.add("is-leaving");
    }
    window.setTimeout(() => {
      window.location.href = url;
    }, delay);
  }

  function playCardOpenTransition(delay) {
    const layer = createLayer("confetti-layer");
    const x = window.innerWidth / 2;
    const y = window.innerHeight * 0.5;

    for (let i = 0; i < 34; i += 1) {
      window.setTimeout(() => {
        spawnConfettiPiece(layer, x + randomFloat(-130, 130), y + randomFloat(-80, 20), true);
      }, i * 18);
    }

    window.setTimeout(() => {
      body.classList.add("is-leaving");
      playCinematicTransition(520);
    }, Math.max(760, delay - 560));
  }

  function playGiftTransition(delay, type) {
    const overlay = document.createElement("div");
    overlay.className = `gift-transition-overlay gift-transition-overlay-${type}`;

    const icon = document.createElement("span");
    icon.className = "gift-transition-icon";
    icon.setAttribute("aria-hidden", "true");
    overlay.appendChild(icon);

    for (let i = 0; i < 18; i += 1) {
      const spark = document.createElement("span");
      spark.className = "gift-transition-spark";
      spark.style.left = `${randomFloat(8, 92).toFixed(1)}%`;
      spark.style.top = `${randomFloat(14, 86).toFixed(1)}%`;
      spark.style.animationDelay = `${randomFloat(0.02, 0.48).toFixed(2)}s`;
      overlay.appendChild(spark);
    }

    document.body.appendChild(overlay);

    window.setTimeout(() => {
      body.classList.add("is-leaving");
    }, Math.max(460, delay - 460));

    window.setTimeout(() => {
      overlay.remove();
    }, delay + 140);
  }

  function playCdTransition(delay) {
    const overlay = document.createElement("div");
    overlay.className = "cd-transition-overlay";

    const disc = document.createElement("span");
    disc.className = "cd-transition-disc";
    overlay.appendChild(disc);

    for (let i = 0; i < 12; i += 1) {
      const spark = document.createElement("span");
      spark.className = "cd-transition-spark";
      spark.style.left = `${randomFloat(8, 92).toFixed(1)}%`;
      spark.style.top = `${randomFloat(18, 82).toFixed(1)}%`;
      spark.style.animationDelay = `${randomFloat(0.08, 0.46).toFixed(2)}s`;
      overlay.appendChild(spark);
    }

    document.body.appendChild(overlay);
    window.setTimeout(() => {
      overlay.remove();
    }, delay + 120);
  }

  function playCinematicTransition(delay) {
    const curtain = document.createElement("div");
    curtain.className = "transition-cinematic is-active";
    document.body.appendChild(curtain);

    const petalsCount = 22;
    for (let i = 0; i < petalsCount; i += 1) {
      const petal = document.createElement("span");
      petal.className = "transition-petal";
      petal.style.left = `${randomFloat(10, window.innerWidth - 10).toFixed(1)}px`;
      petal.style.top = `${randomFloat(30, window.innerHeight - 30).toFixed(1)}px`;
      petal.style.setProperty("--dx", `${randomFloat(-180, 180).toFixed(1)}px`);
      petal.style.setProperty("--dy", `${randomFloat(-180, 180).toFixed(1)}px`);
      petal.style.animationDelay = `${randomFloat(0, 0.09).toFixed(2)}s`;
      document.body.appendChild(petal);
      window.setTimeout(() => petal.remove(), delay + 120);
    }

    window.setTimeout(() => {
      curtain.remove();
    }, delay + 120);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
})();

