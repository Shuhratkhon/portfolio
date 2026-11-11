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
    "pandas": devicon + "pandas/pandas-original.svg",
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
