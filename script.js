document.addEventListener("DOMContentLoaded", () => {
  initTypingEffect();
  initScrollReveal();
  initParticles();
  initContactForm();
});

function initTypingEffect() {
  const target = document.getElementById("typed-role");
  if (!target) return;

  const roles = ["Video Editor", "Photographer", "Cinematographer"];
  const typingSpeed = 90;
  const deletingSpeed = 55;
  const holdDelay = 1300;
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    target.textContent = currentRole.slice(0, charIndex);

    let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      nextDelay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextDelay = 320;
    }

    window.setTimeout(tick, nextDelay);
  }

  tick();
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = 0;

  function sizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticle() {
    const isMobile = window.innerWidth < 768;
    const speedScale = isMobile ? 0.28 : 0.42;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * speedScale,
      vy: (Math.random() - 0.5) * speedScale,
      alpha: Math.random() * 0.55 + 0.15
    };
  }

  function createParticleSet() {
    const count = window.innerWidth < 768 ? 34 : 62;
    particles = Array.from({ length: count }, createParticle);
  }

  function drawConnections(particle, index) {
    for (let i = index + 1; i < particles.length; i += 1) {
      const other = particles[i];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 130) {
        const opacity = (1 - dist / 130) * 0.18;
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(167, 139, 250, ${particle.alpha})`;
      ctx.shadowColor = "rgba(109, 40, 217, 0.9)";
      ctx.shadowBlur = 10;
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      drawConnections(particle, index);
    });

    animationId = window.requestAnimationFrame(animate);
  }

  function handleResize() {
    sizeCanvas();
    createParticleSet();
  }

  sizeCanvas();
  createParticleSet();
  animate();
  window.addEventListener("resize", handleResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationId);
      return;
    }
    animate();
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = "Please fill out all fields correctly.";
      return;
    }

    const nameValue = String(form.elements.name.value || "").trim();
    status.textContent = `Thanks ${nameValue || "there"}, your message is ready to send.`;
    form.reset();
  });
}
