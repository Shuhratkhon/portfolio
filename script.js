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
