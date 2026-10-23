// Background particles
particlesJS("particles-js", {
    particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: "#22c55e" },
        shape: { type: "circle" },
        opacity: { value: 0.45 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#16a34a", opacity: 0.3, width: 1 },
        move: { enable: true, speed: 1.4, out_mode: "out" }
    },
    interactivity: {
        events: { onhover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } } }
    },
    retina_detect: true
});

// Pie chart (vanilla SVG)
(function () {
    const data = [
        { label: "Data", value: 35, color: "#14532d" },
        { label: "Design", value: 25, color: "#15803d" },
        { label: "Code", value: 25, color: "#22c55e" },
        { label: "Other", value: 15, color: "#86efac" }
    ];

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("pie-chart");
    const legend = document.getElementById("pie-legend");
    const tooltip = document.getElementById("pie-tooltip");
    const R = 100;
    const total = data.reduce((s, d) => s + d.value, 0);
    const point = (angle) => [R * Math.cos(angle), R * Math.sin(angle)];

    // Build a slice path from startAngle to endAngle (radians, 0 = 3 o'clock)
    function slicePath(start, end) {
        if (end - start < 0.0001) return "";
        const [x1, y1] = point(start);
        const [x2, y2] = point(end);
        const large = end - start > Math.PI ? 1 : 0;
        return `M0,0 L${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2} Z`;
    }

    let angle = -Math.PI / 2;
    const slices = data.map((d) => {
        const span = (d.value / total) * 2 * Math.PI;
        const slice = { ...d, start: angle, span };
        angle += span;

        const path = document.createElementNS(NS, "path");
        path.setAttribute("fill", d.color);
        svg.appendChild(path);
        slice.path = path;

        path.addEventListener("mousemove", (e) => {
            const box = svg.parentElement.getBoundingClientRect();
            tooltip.hidden = false;
            tooltip.textContent = `${d.label}: ${d.value}%`;
            tooltip.style.left = `${e.clientX - box.left}px`;
            tooltip.style.top = `${e.clientY - box.top}px`;
        });
        path.addEventListener("mouseleave", () => { tooltip.hidden = true; });

        const li = document.createElement("li");
        li.innerHTML = `<span class="swatch" style="background:${d.color}"></span>${d.label}`;
        legend.appendChild(li);
        return slice;
    });

    // Animate: slices sweep in clockwise from the top
    const duration = 1400;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let t0 = null;

    function frame(now) {
        if (t0 === null) t0 = now;
        const progress = easeOut(Math.min((now - t0) / duration, 1));
        const sweep = progress * 2 * Math.PI;
        const base = -Math.PI / 2;

        slices.forEach((s) => {
            const from = s.start;
            const to = Math.min(s.start + s.span, base + sweep);
            s.path.setAttribute("d", to > from ? slicePath(from, to) : "");
        });

        if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();

// Highlight the active nav link while scrolling
(function () {
    const links = document.querySelectorAll(".navbar nav a");
    const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

    function update() {
        const y = window.scrollY + window.innerHeight / 3;
        let current = 0;
        sections.forEach((s, i) => { if (s.offsetTop <= y) current = i; });
        links.forEach((a, i) => a.classList.toggle("active", i === current));
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
})();
