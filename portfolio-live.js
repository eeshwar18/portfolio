(function () {

    // ============================================================
    // SUPABASE CONFIG
    // ============================================================

    const SUPABASE_URL =
        "https://kwnzxflncwmtpvisnhkb.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_ZcTkgrlSgTXQ4_Q5Y6eLIg_a8s4UcSk";


    // ============================================================
    // HELPER
    // ============================================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ============================================================
    // LOAD PORTFOLIO
    // ============================================================

    async function loadPortfolio() {

        try {

            // ----------------------------------------------------
            // CHECK SUPABASE
            // ----------------------------------------------------

            if (!window.supabase) {

                console.error(
                    "Supabase library is missing."
                );

                return;
            }


            // ----------------------------------------------------
            // CREATE CLIENT
            // ----------------------------------------------------

            const supabase =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_PUBLISHABLE_KEY
                );


            // ----------------------------------------------------
            // GET PORTFOLIO DATA
            // ----------------------------------------------------

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
                    "No portfolio data found in Supabase."
                );

                return;
            }


            const portfolio =
                data.data;


            // ====================================================
            // SHORTCUTS
            // ====================================================

            const get =
                selector =>
                    document.querySelector(selector);


            const getAll =
                selector =>
                    document.querySelectorAll(selector);


            // ====================================================
            // HERO
            // ====================================================

            if (get(".hero-label")) {

                get(".hero-label").textContent =
                    portfolio.hero?.label ||
                    "ELECTRONICS & COMMUNICATION ENGINEERING";

            }


            if (get(".hero h1")) {

                get(".hero h1").innerHTML =
                    `Hi, I'm
                    <span class="cyan">
                        ${escapeHTML(
                            portfolio.hero?.name ||
                            "Eeshwar"
                        )}.
                    </span>`;

            }


            if (get(".hero-description")) {

                get(".hero-description").textContent =
                    portfolio.hero?.description ||
                    "";

            }


            if (get(".hero-card h2")) {

                get(".hero-card h2").textContent =
                    portfolio.hero?.focusTitle ||
                    "";

            }


            if (get(".hero-card p")) {

                get(".hero-card p").textContent =
                    portfolio.hero?.focusDescription ||
                    "";

            }


            if (get(".focus-list")) {

                const items =
                    portfolio.hero?.focusItems ||
                    [];


                get(".focus-list").innerHTML =
                    items
                        .map(
                            item =>
                                `<li>
                                    ${escapeHTML(item)}
                                </li>`
                        )
                        .join("");

            }



            // ====================================================
            // ABOUT
            // ====================================================

            const aboutParagraphs =
                getAll(
                    ".about-content > p"
                );


            (
                portfolio.about?.paragraphs ||
                []
            ).forEach(
                (paragraph, index) => {

                    if (
                        aboutParagraphs[index]
                    ) {

                        aboutParagraphs[index]
                            .textContent =
                            paragraph;

                    }

                }
            );


            if (get(".about-highlight")) {

                get(".about-highlight")
                    .textContent =
                    portfolio.about?.highlight ||
                    "";

            }



            // ====================================================
            // EDUCATION
            // ====================================================

            if (
                get(".education-card h3")
            ) {

                get(
                    ".education-card h3"
                ).textContent =
                    portfolio.education?.degree ||
                    "";

            }


            if (get(".college-name")) {

                get(".college-name")
                    .textContent =
                    portfolio.education?.college ||
                    "";

            }


            if (get(".college-period")) {

                get(".college-period")
                    .textContent =
                    portfolio.education?.period ||
                    "";

            }


            if (
                get(".education-card p")
            ) {

                get(
                    ".education-card p"
                ).textContent =
                    portfolio.education?.description ||
                    "";

            }



            // ====================================================
            // INTERESTS
            // ====================================================

            const interestTitles =
                getAll(
                    ".interest-card h3"
                );


            (
                portfolio.interests ||
                []
            ).forEach(
                (interest, index) => {

                    if (
                        interestTitles[index]
                    ) {

                        interestTitles[index]
                            .textContent =
                            interest;

                    }

                }
            );



            // ====================================================
            // SKILLS
            // ====================================================
            //
            // IMPORTANT:
            //
            // The old code could ONLY update the skill groups
            // already present in the HTML.
            //
            // This version dynamically creates the skill groups
            // from the Supabase data.
            //
            // ====================================================

            const savedSkills =
                Array.isArray(portfolio.skills)
                    ? portfolio.skills
                    : [];


            const existingSkillGroups =
                getAll(".skill-group");


            let skillsContainer = null;


            // Find the existing parent container.

            if (
                existingSkillGroups.length > 0
            ) {

                skillsContainer =
                    existingSkillGroups[0].parentElement;

            }


            // Fallbacks in case the original HTML uses
            // a different structure.

            if (!skillsContainer) {

                skillsContainer =
                    get(".skills-grid");

            }


            if (!skillsContainer) {

                skillsContainer =
                    get(".skills-container");

            }


            if (!skillsContainer) {

                skillsContainer =
                    get(".skills-content");

            }


            if (
                skillsContainer &&
                savedSkills.length
            ) {

                skillsContainer.innerHTML =
                    savedSkills
                        .map(
                            skill => {

                                let items;


                                // ------------------------------------------------
                                // Support both:
                                //
                                // items: ["C", "C++", "Python"]
                                //
                                // and:
                                //
                                // items: "C, C++, Python"
                                // ------------------------------------------------

                                if (
                                    Array.isArray(
                                        skill.items
                                    )
                                ) {

                                    items =
                                        skill.items;

                                } else {

                                    items =
                                        String(
                                            skill.items ||
                                            ""
                                        )
                                            .split(",")
                                            .map(
                                                item =>
                                                    item.trim()
                                            )
                                            .filter(
                                                Boolean
                                            );

                                }


                                return `

                                    <div class="skill-group">

                                        <h3>
                                            ${escapeHTML(
                                                skill.title ||
                                                ""
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

                                    </div>

                                `;

                            }
                        )
                        .join("");

            }


            // If all skill groups were deleted,
            // clear the existing container.

            if (
                skillsContainer &&
                savedSkills.length === 0
            ) {

                skillsContainer.innerHTML = "";

            }



            // ====================================================
            // PROJECTS
            // ====================================================

            const projectsGrid =
                get(
                    ".projects-grid"
                );


            if (projectsGrid) {

                const projects =
                    portfolio.projects ||
                    [];


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
                                            project.technologies ||
                                            ""
                                        )
                                            .split(",")
                                            .map(
                                                item =>
                                                    item.trim()
                                            )
                                            .filter(
                                                Boolean
                                            );


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


                                const projectNumber =
                                    project.number ||
                                    `PROJECT ${
                                        String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )
                                    }`;


                                const projectLink =
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
                                                projectNumber
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


                                        ${projectLink}

                                    </article>

                                `;

                            }
                        )
                        .join("");

            }



            // ====================================================
            // BEYOND PROJECTS
            // ====================================================
            //
            // IMPORTANT:
            //
            // The old code could ONLY update existing
            // .beyond-card elements.
            //
            // This version dynamically creates and deletes
            // Beyond Project cards based on Supabase.
            //
            // ====================================================

            const savedBeyond =
                Array.isArray(portfolio.beyond)
                    ? portfolio.beyond
                    : [];


            const existingBeyondCards =
                getAll(".beyond-card");


            let beyondContainer = null;


            // Find existing card parent.

            if (
                existingBeyondCards.length > 0
            ) {

                beyondContainer =
                    existingBeyondCards[0].parentElement;

            }


            // Fallback container names.

            if (!beyondContainer) {

                beyondContainer =
                    get(".beyond-grid");

            }


            if (!beyondContainer) {

                beyondContainer =
                    get(".beyond-container");

            }


            if (!beyondContainer) {

                beyondContainer =
                    get(".beyond-content");

            }


            if (
                beyondContainer &&
                savedBeyond.length
            ) {

                beyondContainer.innerHTML =
                    savedBeyond
                        .map(
                            item => `

                                <article
                                    class="beyond-card"
                                >

                                    <h3>
                                        ${escapeHTML(
                                            item.title ||
                                            ""
                                        )}
                                    </h3>


                                    <p>
                                        ${escapeHTML(
                                            item.p1 ||
                                            ""
                                        )}
                                    </p>


                                    <p>
                                        ${escapeHTML(
                                            item.p2 ||
                                            ""
                                        )}
                                    </p>

                                </article>

                            `
                        )
                        .join("");

            }


            // If the admin deleted every Beyond card,
            // remove all cards from the live page.

            if (
                beyondContainer &&
                savedBeyond.length === 0
            ) {

                beyondContainer.innerHTML = "";

            }



            // ====================================================
            // RESUME
            // ====================================================

            if (
                get(".resume-box h3")
            ) {

                get(
                    ".resume-box h3"
                ).textContent =
                    portfolio.resume?.title ||
                    "";

            }


            if (
                get(".resume-box p")
            ) {

                get(
                    ".resume-box p"
                ).textContent =
                    portfolio.resume?.description ||
                    "";

            }


            if (
                portfolio.resume?.path
            ) {

                getAll(
                    ".resume-box a"
                ).forEach(
                    link => {

                        link.href =
                            portfolio.resume.path;

                    }
                );

            }



            // ====================================================
            // CONTACT
            // ====================================================

            if (
                get(".contact-info p")
            ) {

                get(
                    ".contact-info p"
                ).textContent =
                    portfolio.contact?.description ||
                    "";

            }


            if (
                get(".contact-email")
            ) {

                const email =
                    portfolio.contact?.email ||
                    "";


                get(
                    ".contact-email"
                ).textContent =
                    email;


                get(
                    ".contact-email"
                ).href =
                    `mailto:${email}`;

            }



            // ====================================================
            // SOCIAL LINKS
            // ====================================================

            const socialLinks =
                getAll(
                    ".social-links a"
                );


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



            // ====================================================
            // SUCCESS
            // ====================================================

            console.log(
                "✓ Portfolio loaded from Supabase"
            );


            console.log(
                "✓ Skills loaded dynamically:",
                savedSkills.length
            );


            console.log(
                "✓ Beyond Projects loaded dynamically:",
                savedBeyond.length
            );


            console.log(
                "✓ Projects loaded:",
                portfolio.projects?.length || 0
            );

        }

        catch (error) {

            console.error(
                "Portfolio loading failed:",
                error
            );

        }

    }



    // ============================================================
    // START AFTER PAGE LOAD
    // ============================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadPortfolio
        );

    } else {

        loadPortfolio();

    }

})();
