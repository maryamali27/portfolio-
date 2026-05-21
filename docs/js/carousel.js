// Project carousels — drag, momentum, snap, arrow nav
document.querySelectorAll('.projects-grid').forEach(grid => {
  // Wrap grid in carousel container
  const wrap = document.createElement('div');
  wrap.className = 'carousel-wrap';
  grid.parentNode.insertBefore(wrap, grid);
  wrap.appendChild(grid);

  // Only add arrow buttons if enough cards to scroll
  if (grid.querySelectorAll('.project-card').length > 3) {
    const prev = document.createElement('button');
    prev.className = 'carousel-btn prev';
    prev.setAttribute('aria-label', 'Scroll left');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

    const next = document.createElement('button');
    next.className = 'carousel-btn next';
    next.setAttribute('aria-label', 'Scroll right');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    wrap.appendChild(prev);
    wrap.appendChild(next);

    const STEP = 320;
    prev.addEventListener('click', () => grid.scrollBy({ left: -STEP, behavior: 'smooth' }));
    next.addEventListener('click', () => grid.scrollBy({ left: STEP, behavior: 'smooth' }));
  }

  // Drag-to-scroll with momentum
  let isDragging = false, startX, scrollStart, lastX, lastTime, velocity;
  let rafId;

  grid.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX;
    scrollStart = grid.scrollLeft;
    lastX = e.clientX;
    lastTime = Date.now();
    velocity = 0;
    cancelAnimationFrame(rafId);
    grid.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    grid.scrollLeft = scrollStart - (e.clientX - startX);
    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) velocity = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastTime = now;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove('is-dragging');
    let vel = velocity * 12;
    function coast() {
      if (Math.abs(vel) < 0.5) return;
      grid.scrollLeft -= vel;
      vel *= 0.9;
      rafId = requestAnimationFrame(coast);
    }
    coast();
  });

  // Touch swipe
  let touchStartX, touchScrollStart;
  grid.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchScrollStart = grid.scrollLeft;
  }, { passive: true });
  grid.addEventListener('touchmove', e => {
    grid.scrollLeft = touchScrollStart - (e.touches[0].clientX - touchStartX);
  }, { passive: true });
});
