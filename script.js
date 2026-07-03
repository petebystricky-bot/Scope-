const track = document.getElementById("track");
const viewport = document.getElementById("viewport");
const image = document.querySelector(".image");

let posX = 0;
let velocity = 0;

let isDragging = false;
let lastX = 0;

// inertia tuning
const friction = 0.92;   // spomalenie (0.85–0.98)
const strength = 1;      // citlivosť pohybu

function applyTransform() {
  track.style.transform = `translateX(${posX}px)`;
}

/**
 * DRAG START
 */
function startDrag(x) {
  isDragging = true;
  lastX = x;
  velocity = 0; // reset inertia pri novom ťahaní
}

/**
 * DRAG MOVE
 */
function moveDrag(x) {
  if (!isDragging) return;

  const delta = x - lastX;
  lastX = x;

  // pohyb (opačný smer panorámy)
  posX += delta * strength;

  // ukladáme rýchlosť pre inertia
  velocity = delta;

  applyTransform();
  handleLoop();
}

/**
 * DRAG END → spustí inertia
 */
function endDrag() {
  isDragging = false;
  inertiaLoop();
}

/**
 * INERTIA ANIMATION LOOP
 * (ako momentum scroll na mobile)
 */
function inertiaLoop() {
  if (Math.abs(velocity) < 0.1) return;

  velocity *= friction;
  posX += velocity;

  applyTransform();
  handleLoop();

  requestAnimationFrame(inertiaLoop);
}

/**
 * INFINITE LOOP LOGIC (TODO / Copilot doplní presne)
 */
function handleLoop() {
  const imgWidth = image.offsetWidth;

  // TODO: zabezpečiť seamless loop
  // idea:
  // if posX <= -imgWidth → posX += imgWidth
  // if posX >= 0 → posX -= imgWidth
}

/**
 * EVENTS
 */
viewport.addEventListener("mousedown", (e) => startDrag(e.clientX));
viewport.addEventListener("mousemove", (e) => moveDrag(e.clientX));
viewport.addEventListener("mouseup", endDrag);
viewport.addEventListener("mouseleave", endDrag);

viewport.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX), { passive: true });
viewport.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX), { passive: true });
viewport.addEventListener("touchend", endDrag);
