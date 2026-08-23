(function () {

    /* ============================================================
       SUPABASE CONFIG
    ============================================================ */

    const SUPABASE_URL =
        "https://kwnzxflncwmtpvisnhkb.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_ZcTkgrlSgTXQ4_Q5Y6eLIg_a8s4UcSk";


    /* ============================================================
       ESCAPE HTML
    ============================================================ */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ============================================================
       SUPABASE
    ============================================================ */

    async function loadPortfolio() {

        try {

            if (!window.supabase) {

                console.error(
                    "Supabase library is missing."
                );

                return;

            }


            const supabase =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_PUBLISHABLE_KEY
                );


            /* ====================================================
               GET DATA
            ==================================================== */

            const {
                data,
                error
            } = await supabase
                .from("portfolio_content")
                .select("data")
                .eq("id", 1)
                .maybeSingle();


            if (error) {

                console.error(
                    "Portfolio load error:",
                    error
                );

                return;

            }


            if (!data || !data.data) {

                console.warn(
                    "No portfolio data found."
                );

                return;

            }


            const portfolio =
                data.data;


            /* ====================================================
               HELPERS
            ==================================================== */

            const get =
                selector =>
                    document.querySelector(selector);


            const getAll =
                selector =>
                    document.querySelectorAll(selector);


            /* ====================================================
               HERO
            ==================================================== */

            if (get(".hero-label")) {

                get(".hero-label").textContent =
                    portfolio.hero?.label || "";

            }


            if (get(".hero h1")) {

                get(".hero h1").innerHTML =
                    `Hi, I'm
                    <span class="cyan">
                    ${escapeHTML(
                        portfolio.hero?.name || "Eeshwar"
                    )}.
                    </span>`;

            }


            if (get(".hero-description")) {

                get(".hero-description").textContent =
                    portfolio.hero?.description || "";

            }


            if (get(".hero-card h2")) {

                get(".hero-card h2").textContent =
                    portfolio.hero?.focusTitle || "";

            }


            if (get(".hero-card p")) {

                get(".hero-card p").textContent =
                    portfolio.hero?.focusDescription || "";

            }


            if (get(".focus-list")) {

                const items =
                    portfolio.hero?.focusItems || [];

                get(".focus-list").innerHTML =
                    items
                        .map(
                            item =>
                                `<li>${escapeHTML(item)}</li>`
                        )
                        .join("");

            }


            /* ====================================================
               ABOUT
            ==================================================== */

            const aboutParagraphs =
                getAll(".about-content > p");


            (
                portfolio.about?.paragraphs || []
            ).forEach(
                (paragraph, index) => {

                    if (aboutParagraphs[index]) {

                        aboutParagraphs[index]
                            .textContent =
                            paragraph;

                    }

                }
            );


            if (get(".about-highlight")) {

                get(".about-highlight")
                    .textContent =
                    portfolio.about?.highlight || "";

            }


            /* ====================================================
               EDUCATION
            ==================================================== */

            if (get(".education-card h3")) {

                get(".education-card h3")
                    .textContent =
                    portfolio.education?.degree || "";

            }


            if (get(".college-name")) {

                get(".college-name")
                    .textContent =
                    portfolio.education?.college || "";

            }


            if (get(".college-period")) {

                get(".college-period")
                    .textContent =
                    portfolio.education?.period || "";

            }


            if (get(".education-card p")) {

                get(".education-card p")
                    .textContent =
                    portfolio.education?.description || "";

            }


            /* ====================================================
               INTERESTS
               
               IMPORTANT:
               This now dynamically creates the cards.
               ==================================================== */

            const interestContainer =
                get(".interests-grid") ||
                get(".interests-list");


            if (interestContainer) {

                const interests =
                    portfolio.interests || [];


                interestContainer.innerHTML =
                    interests
                        .map(
                            interest => `
                                <article class="interest-card">

                                    <h3>
                                        ${escapeHTML(
                                            interest
                                        )}
                                    </h3>

                                </article>
                            `
                        )
                        .join("");

            }
            else {

                /* Fallback for existing HTML */

                const interestTitles =
                    getAll(".interest-card h3");


                (
                    portfolio.interests || []
                ).forEach(
                    (interest, index) => {

                        if (interestTitles[index]) {

                            interestTitles[index]
                                .textContent =
                                interest;

                        }

                    }
                );

            }


            /* ====================================================
               SKILLS
               
               IMPORTANT:
               This dynamically creates all skill groups.
               ==================================================== */

            const skillsContainer =
                get(".skills-grid") ||
                get(".skills-container") ||
                get(".skills-list");


            if (skillsContainer) {

                const skills =
                    portfolio.skills || [];


                skillsContainer.innerHTML =
                    skills
                        .map(
                            skill => {

                                let items;

                                if (
                                    Array.isArray(
                                        skill.items
                                    )
                                ) {

                                    items =
                                        skill.items;

                                }
                                else {

                                    items =
                                        String(
                                            skill.items || ""
                                        )
                                        .split(",")
                                        .map(
                                            item =>
                                                item.trim()
                                        )
                                        .filter(Boolean);

                                }


                                return `

                                    <article
                                        class="skill-group"
                                    >

                                        <h3>
                                            ${escapeHTML(
                                                skill.title
                                            )}
                                        </h3>

                                        <ul class="skill-list">

                                            ${items
                                                .map(
                                                    item =>
                                                        `
                                                        <li>
                                                            ${escapeHTML(
                                                                item
                                                            )}
                                                        </li>
                                                        `
                                                )
                                                .join("")}

                                        </ul>

                                    </article>

                                `;

                            }
                        )
                        .join("");

            }
            else {

                /* Fallback */

                const skillGroups =
                    getAll(".skill-group");


                (
                    portfolio.skills || []
                ).forEach(
                    (skill, index) => {

                        if (!skillGroups[index]) {

                            return;

                        }


                        const title =
                            skillGroups[index]
                                .querySelector("h3");


                        const list =
                            skillGroups[index]
                                .querySelector(
                                    ".skill-list"
                                );


                        if (title) {

                            title.textContent =
                                skill.title || "";

                        }


                        if (list) {

                            const items =
                                Array.isArray(
                                    skill.items
                                )
                                ? skill.items
                                : String(
                                    skill.items || ""
                                )
                                .split(",")
                                .map(
                                    x => x.trim()
                                )
                                .filter(Boolean);


                            list.innerHTML =
                                items
                                    .map(
                                        item =>
                                            `<li>
                                                ${escapeHTML(item)}
                                            </li>`
                                    )
                                    .join("");

                        }

                    }
                );

            }


            /* ====================================================
               PROJECTS
               
               KEEPING YOUR WORKING PROJECT SYSTEM
               ==================================================== */

            const projectsGrid =
                get(".projects-grid");


            if (projectsGrid) {

                const projects =
                    portfolio.projects || [];


                projectsGrid.innerHTML =
                    projects
                        .map(
                            (project, index) => {

                                const technologies =
                                    Array.isArray(
                                        project.technologies
                                    )
                                    ? project.technologies
                                    : String(
                                        project.technologies || ""
                                    )
                                    .split(",")
                                    .map(
                                        item =>
                                            item.trim()
                                    )
                                    .filter(Boolean);


                                const imageHTML =
                                    project.image
                                    ? `
                                        <div
                                            class="project-image-wrap"
                                            style="
                                                width:100%;
                                                margin-bottom:20px;
                                                overflow:hidden;
                                                border-radius:12px;
                                                border:1px solid rgba(85,232,255,0.12);
                                            "
                                        >

                                            <img
                                                class="project-image"
                                                src="${escapeHTML(
                                                    project.image
                                                )}"
                                                alt="${escapeHTML(
                                                    project.title ||
                                                    "Project image"
                                                )}"
                                                style="
                                                    width:100%;
                                                    height:210px;
                                                    object-fit:cover;
                                                    display:block;
                                                "
                                            >

                                        </div>
                                    `
                                    : "";


                                const number =
                                    project.number ||
                                    `PROJECT ${
                                        String(index + 1)
                                            .padStart(2, "0")
                                    }`;


                                const link =
                                    project.url
                                    ? `
                                        <a
                                            href="${escapeHTML(
                                                project.url
                                            )}"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="project-link"
                                        >
                                            View Project →
                                        </a>
                                    `
                                    : "";


                                return `

                                    <article
                                        class="project-card"
                                    >

                                        ${imageHTML}

                                        <div
                                            class="project-number"
                                        >
                                            ${escapeHTML(
                                                number
                                            )}
                                        </div>

                                        <h3>
                                            ${escapeHTML(
                                                project.title
                                            )}
                                        </h3>

                                        <p>
                                            ${escapeHTML(
                                                project.description
                                            )}
                                        </p>

                                        <div
                                            class="project-tags"
                                        >

                                            ${technologies
                                                .map(
                                                    technology =>
                                                        `
                                                        <span>
                                                            ${escapeHTML(
                                                                technology
                                                            )}
                                                        </span>
                                                        `
                                                )
                                                .join("")}

                                        </div>

                                        ${link}

                                    </article>

                                `;

                            }
                        )
                        .join("");

            }


            /* ====================================================
               BEYOND PROJECTS
               
               IMPORTANT:
               Dynamically creates/deletes cards on the live site.
               ==================================================== */

            const beyondContainer =
                get(".beyond-grid") ||
                get(".beyond-projects-grid") ||
                get(".beyond-container");


            if (beyondContainer) {

                const beyond =
                    portfolio.beyond || [];


                beyondContainer.innerHTML =
                    beyond
                        .map(
                            item => `

                                <article
                                    class="beyond-card"
                                >

                                    <h3>
                                        ${escapeHTML(
                                            item.title
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            item.p1
                                        )}
                                    </p>

                                    <p>
                                        ${escapeHTML(
                                            item.p2
                                        )}
                                    </p>

                                </article>

                            `
                        )
                        .join("");

            }
            else {

                /* Fallback for existing HTML */

                const beyondCards =
                    getAll(".beyond-card");


                (
                    portfolio.beyond || []
                ).forEach(
                    (item, index) => {

                        if (!beyondCards[index]) {

                            return;

                        }


                        const title =
                            beyondCards[index]
                                .querySelector("h3");


                        const paragraphs =
                            beyondCards[index]
                                .querySelectorAll("p");


                        if (title) {

                            title.textContent =
                                item.title || "";

                        }


                        if (paragraphs[0]) {

                            paragraphs[0]
                                .textContent =
                                item.p1 || "";

                        }


                        if (paragraphs[1]) {

                            paragraphs[1]
                                .textContent =
                                item.p2 || "";

                        }

                    }
                );

            }


            /* ====================================================
               RESUME
               ==================================================== */

            if (get(".resume-box h3")) {

                get(".resume-box h3")
                    .textContent =
                    portfolio.resume?.title || "";

            }


            if (get(".resume-box p")) {

                get(".resume-box p")
                    .textContent =
                    portfolio.resume?.description || "";

            }


            if (portfolio.resume?.path) {

                getAll(".resume-box a")
                    .forEach(
                        link => {

                            link.href =
                                portfolio.resume.path;

                        }
                    );

            }


            /* ====================================================
               CONTACT
               ==================================================== */

            if (get(".contact-info p")) {

                get(".contact-info p")
                    .textContent =
                    portfolio.contact?.description || "";

            }


            if (get(".contact-email")) {

                const email =
                    portfolio.contact?.email || "";


                get(".contact-email")
                    .textContent =
                    email;


                get(".contact-email")
                    .href =
                    `mailto:${email}`;

            }


            /* ====================================================
               SOCIAL LINKS
               ==================================================== */

            const socialLinks =
                getAll(".social-links a");


            if (
                socialLinks[0] &&
                portfolio.contact?.github
            ) {

                socialLinks[0].href =
                    portfolio.contact.github;

            }


            if (
                socialLinks[1] &&
                portfolio.contact?.linkedin
            ) {

                socialLinks[1].href =
                    portfolio.contact.linkedin;

            }


            /* ====================================================
               DONE
               ==================================================== */

            console.log(
                "✓ V4 portfolio loaded from Supabase"
            );

        }

        catch (error) {

            console.error(
                "Portfolio loading failed:",
                error
            );

        }

    }


    /* ============================================================
       START
    ============================================================ */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadPortfolio
        );

    }
    else {

        loadPortfolio();

    }

})();
