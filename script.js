// project filter buttons
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;
        projects.forEach(project => {
            const tags = project.dataset.tags.split(" ");
            const show = filter === "all" || tags.includes(filter);
            project.classList.toggle("hide", !show);
        });
    });
});

// fade sections in when you scroll to them
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: "0px 0px -80px 0px" }); // no threshold, tall sections never reach 10% on a phone

sections.forEach(section => {
    section.classList.add("fade");
    observer.observe(section);
});

// highlight the nav link of the section on screen
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle("current", link.getAttribute("href") === "#" + current);
    });
});

// copy the logo strip once so the scrolling loop never shows a gap
const track = document.querySelector(".marquee-track");
if (track) {
    track.innerHTML += track.innerHTML.replaceAll("<span class=\"logo-item\">", "<span class=\"logo-item\" aria-hidden=\"true\">");
}

// small logos in front of the skill and tech chips
const devicon = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const simple = "https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/";

const icons = {
    "Python": devicon + "python/python-original.svg",
    "JavaScript": devicon + "javascript/javascript-original.svg",
    "SQL": devicon + "azuresqldatabase/azuresqldatabase-original.svg",
    "Java": devicon + "java/java-original.svg",
    "NumPy": devicon + "numpy/numpy-original.svg",
    "scikit-learn": devicon + "scikitlearn/scikitlearn-original.svg",
    "Matplotlib": devicon + "matplotlib/matplotlib-original.svg",
    "Jupyter Notebook": devicon + "jupyter/jupyter-original.svg",
    "HTML & CSS": devicon + "html5/html5-original.svg",
    "React": devicon + "react/react-original.svg",
    "Git & GitHub": devicon + "git/git-original.svg",
    "PyCharm": devicon + "pycharm/pycharm-original.svg",
    "PostgreSQL": devicon + "postgresql/postgresql-original.svg",
    "PostgreSQL / Neon": devicon + "postgresql/postgresql-original.svg",
    "Supabase": devicon + "supabase/supabase-original.svg"
};

// these logos are black, so they get inverted to show on the dark background
const darkIcons = {
    "pandas": devicon + "pandas/pandas-original.svg",
    "Flask": devicon + "flask/flask-original.svg",
    "Three.js": devicon + "threejs/threejs-original.svg",
    "Google Colab": simple + "googlecolab.svg",
    "Render": simple + "render.svg",
    "GitHub Pages": simple + "githubpages.svg",
    "Chart.js": simple + "chartdotjs.svg"
};

// no logo online for these, so a coloured letter instead
const letters = {
    "Seaborn": ["S", "seaborn"],
    "Excel": ["X", "excel"],
    "Word & PowerPoint": ["W", "word"]
};

document.querySelectorAll(".chips span").forEach(chip => {
    const name = chip.textContent.trim();

    if (icons[name] || darkIcons[name]) {
        const img = document.createElement("img");
        img.src = icons[name] || darkIcons[name];
        img.alt = "";
        if (darkIcons[name]) img.className = "mono";
        chip.prepend(img);
    } else if (letters[name]) {
        const badge = document.createElement("span");
        badge.className = "letter " + letters[name][1];
        badge.textContent = letters[name][0];
        chip.prepend(badge);
    }
});

// line globe behind the achievements, the lines near the mouse light up
const globe = document.querySelector(".globe");

if (globe) {
    const ctx = globe.getContext("2d");
    const area = document.getElementById("achievements");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    let angle = 0;
    let width = 0;
    let height = 0;
    let onScreen = false;

    function resize() {
        const ratio = window.devicePixelRatio || 1;
        width = globe.clientWidth;
        height = globe.clientHeight;
        globe.width = width * ratio;
        globe.height = height * ratio;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    // point on the sphere (degrees) -> x, y on the canvas and z (z > 0 means front side)
    function project(lat, lon, r, cx, cy) {
        const la = lat * Math.PI / 180;
        const lo = lon * Math.PI / 180 + angle;
        const x = Math.cos(la) * Math.sin(lo);
        const y = Math.sin(la);
        const z = Math.cos(la) * Math.cos(lo);

        // tilt it a bit so we see the top of the globe
        const tilt = 0.35;
        const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
        const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);

        return { x: cx + x * r, y: cy - y2 * r, z: z2 };
    }

    function drawLine(points) {
        for (let i = 1; i < points.length; i++) {
            const a = points[i - 1];
            const b = points[i];
            const dist = Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y);
            const near = Math.max(0, 1 - dist / 150); // 1 under the mouse, 0 far away
            const front = a.z + b.z > 0;

            const alpha = (front ? 0.22 : 0.06) + near * 0.75;
            ctx.strokeStyle = near > 0 ? `rgba(196, 181, 253, ${alpha})` : `rgba(147, 197, 253, ${alpha})`;
            ctx.lineWidth = 1 + near * 1.3;
            ctx.shadowBlur = near * 16;
            ctx.shadowColor = "rgba(167, 139, 250, 0.9)";

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const r = Math.min(width * 0.42, height * 0.85, 460);
        const cx = width / 2;
        const cy = height * 0.6;

        // latitude rings
        for (let lat = -75; lat <= 75; lat += 15) {
            const points = [];
            for (let lon = 0; lon <= 360; lon += 5) {
                points.push(project(lat, lon, r, cx, cy));
            }
            drawLine(points);
        }

        // longitude lines
        for (let lon = 0; lon < 360; lon += 15) {
            const points = [];
            for (let lat = -90; lat <= 90; lat += 5) {
                points.push(project(lat, lon, r, cx, cy));
            }
            drawLine(points);
        }
    }

    function loop() {
        if (!onScreen) return;
        angle += 0.0025;
        draw();
        requestAnimationFrame(loop);
    }

    // only spin while the section is on screen
    new IntersectionObserver(entries => {
        onScreen = entries[0].isIntersecting;
        if (onScreen && !still) loop();
    }).observe(area);

    area.addEventListener("pointermove", event => {
        const rect = globe.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        if (still) draw();
    });

    area.addEventListener("pointerleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
        if (still) draw();
    });

    window.addEventListener("resize", () => {
        resize();
        draw();
    });

    resize();
    draw();
}
