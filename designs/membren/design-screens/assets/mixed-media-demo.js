(() => {
  const viewer = document.querySelector('[data-viewer]');
  const scenario = document.querySelector('#scenario');
  if (!viewer || !scenario) return;

  const frame = viewer.querySelector('.media-frame');
  const counter = viewer.querySelector('.media-counter');
  const dots = viewer.querySelector('.dots');
  const previous = viewer.querySelector('[data-prev]');
  const next = viewer.querySelector('[data-next]');
  let items = [];
  let index = 0;
  let playing = false;
  let progress = 0;
  let timer;

  function stop() {
    clearInterval(timer);
    timer = undefined;
    playing = false;
    progress = 0;
  }

  function render() {
    stop();
    const item = items[index];
    if (item === 'Photo') {
      frame.innerHTML = '<img src="assets/mixed-media-photo.svg" alt="Illustrative photo of a warm evening at home">';
    } else if (item === 'Video') {
      frame.innerHTML = '<div class="video-art" role="img" aria-label="Illustrative video thumbnail"></div><button class="play-toggle" type="button" aria-label="Play video preview">▶</button><div class="video-controls"><span class="video-time">0:00 / 0:12</span><span class="video-track"><span class="video-progress"></span></span></div>';
      frame.querySelector('.play-toggle').addEventListener('click', () => {
        playing = !playing;
        const button = frame.querySelector('.play-toggle');
        button.textContent = playing ? 'Ⅱ' : '▶';
        button.setAttribute('aria-label', playing ? 'Pause video preview' : 'Play video preview');
        clearInterval(timer);
        if (playing) timer = setInterval(() => {
          progress = (progress + 1) % 13;
          frame.querySelector('.video-time').textContent = `0:${String(progress).padStart(2, '0')} / 0:12`;
          frame.querySelector('.video-progress').style.width = `${progress / 12 * 100}%`;
          if (progress === 12) {
            playing = false;
            button.textContent = '▶';
            button.setAttribute('aria-label', 'Play video preview');
            clearInterval(timer);
          }
        }, 1000);
      });
    } else {
      frame.innerHTML = '<div class="processing"><span class="processing-icon" aria-hidden="true">◷</span><strong>Video is processing</strong><p>Your photo is ready. The video will be playable once processing finishes.</p></div>';
    }
    counter.textContent = `${index + 1} of ${items.length} · ${item}`;
    previous.disabled = index === 0;
    next.disabled = index === items.length - 1;
    previous.setAttribute('aria-label', `Previous media, ${index > 0 ? items[index - 1] : 'unavailable'}`);
    next.setAttribute('aria-label', `Next media, ${index < items.length - 1 ? items[index + 1] : 'unavailable'}`);
    dots.replaceChildren(...items.map((label, position) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', `Show ${label.toLowerCase()}, ${position + 1} of ${items.length}`);
      dot.setAttribute('aria-current', String(position === index));
      dot.addEventListener('click', () => go(position));
      return dot;
    }));
    viewer.setAttribute('aria-label', `Memory media: ${counter.textContent}`);
  }

  function go(position) {
    if (position < 0 || position >= items.length || position === index) return;
    index = position;
    render();
  }

  function chooseScenario() {
    items = scenario.value === 'processing' ? ['Photo', 'Processing video'] : scenario.value === 'photo' ? ['Photo'] : scenario.value === 'video' ? ['Video'] : ['Photo', 'Video'];
    index = 0;
    render();
  }

  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  scenario.addEventListener('change', chooseScenario);
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let touchStart;
  frame.addEventListener('touchstart', event => { touchStart = event.changedTouches[0]; }, { passive: true });
  frame.addEventListener('touchend', event => {
    if (!touchStart) return;
    const delta = event.changedTouches[0].clientX - touchStart.clientX;
    if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
    touchStart = undefined;
  }, { passive: true });
  chooseScenario();
})();
