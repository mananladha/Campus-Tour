function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.querySelector(".menu-btn");

  sidebar.classList.toggle("active");
  // Hide button when sidebar is open
  if (sidebar.classList.contains("active")) {
    menuBtn.style.display = "none";
  } else {
    menuBtn.style.display = "block";
  }
}

let panInterval = null;

// Zoom functions
function zoomIn() {
  viewer.setHfov(viewer.getHfov() - 10);
}
function zoomOut() {
  viewer.setHfov(viewer.getHfov() + 10);
}

// Pan continuously
function startPan(direction) {
  stopPan(); // clear old
  panInterval = setInterval(() => {
    if (direction === 'up') viewer.setPitch(viewer.getPitch() + 20);
    if (direction === 'down') viewer.setPitch(viewer.getPitch() - 20);
    if (direction === 'left') viewer.setYaw(viewer.getYaw() - 20);
    if (direction === 'right') viewer.setYaw(viewer.getYaw() + 20);
    console.log("panning " + direction)
  }, 30); // every 30ms
}
function stopPan() {
  if (panInterval) {
    clearInterval(panInterval);
    panInterval = null;
  }
}

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Home
function goHome() {
  window.location.href = "index.html";
}

// Attach mouse + touch events
function attachPanEvents(id, direction) {
  const btn = document.getElementById(id);

  // Mouse hold
  btn.addEventListener("mousedown", () => startPan(direction));
  btn.addEventListener("mouseup", stopPan);
  btn.addEventListener("mouseleave", stopPan);

  // Touch hold (for mobile)
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startPan(direction);
  });
  btn.addEventListener("touchend", stopPan);
}

// Hook up
attachPanEvents("btnUp", "up");
attachPanEvents("btnDown", "down");
attachPanEvents("btnLeft", "left");
attachPanEvents("btnRight", "right");

window.viewer = viewer;
        let isDragging = false;
        let lastX, lastY;
        let velocityX = 0, velocityY = 0;
        let momentumInterval;

        const sensitivity = 0.3;   // increase for faster movement
        const inertia = 0.95;      // closer to 1 = longer inertia

        const canvas = document.querySelector('#panorama canvas');

        // Mouse down
        canvas.addEventListener('mousedown', (e) => {
          isDragging = true;
          lastX = e.clientX;
          lastY = e.clientY;
          clearInterval(momentumInterval);
        });

        // Mouse move
        canvas.addEventListener('mousemove', (e) => {
          if (!isDragging) return;

          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;

          lastX = e.clientX;
          lastY = e.clientY;

          viewer.setYaw(viewer.getYaw() - dx * sensitivity);
          viewer.setPitch(viewer.getPitch() + dy * sensitivity);

          velocityX = dx * sensitivity;
          velocityY = dy * sensitivity;
        });

// Mouse up (apply inertia)
        canvas.addEventListener('mouseup', () => {
          isDragging = false;

          momentumInterval = setInterval(() => {
            viewer.setYaw(viewer.getYaw() - velocityX);
            viewer.setPitch(viewer.getPitch() + velocityY);

            velocityX *= inertia;
            velocityY *= inertia;

            if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01) {
              clearInterval(momentumInterval);
            }
          }, 16); // ~60fps
        });