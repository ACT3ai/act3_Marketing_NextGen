Build (or update) the ACT 3 AI "Step-by-Step Guide" pages on the act3ai.com marketing site.

One table-of-contents page (guide 0) opens seven walkthroughs (guides 1 through 7). Each walkthrough
teaches a new filmmaker one path through the ACT 3 AI web app, one screen at a time: what to look at,
what to click, and why. The pages are hand-built HTML with marketing-level graphics and gentle motion,
in the same look as our homepage.

Run this prompt from any directory. It finds everything through the variables below.
Re-running it UPDATES the guides: it re-reads the product, keeps what is still correct, and fixes what
drifted. It never starts over unless a guide is missing.

Appendix A (bottom of this file) holds ALL of the background knowledge, the screen layout, the writing
rules and the per-guide content plan. Appendix B is Bryan's original request and Appendix C his
follow-up, both verbatim. Every agent reads all three appendices before it writes anything.


====================================================================
  VARIABLES
====================================================================

ROOT_DIR dir is ~/BGit

SITE_REPO_DIR dir is {ROOT_DIR}/act3/act3_Marketing_NextGen

SITE_STATIC_DIR dir is {SITE_REPO_DIR}/site/static

GUIDES_DIR dir is {SITE_STATIC_DIR}/step_guides
  * Everything this prompt builds goes under here. Docusaurus copies site/static/ into every build
    as-is, so a file at {GUIDES_DIR}/2_import_script/page_1.html is served at
    https://act3ai.com/step_guides/2_import_script/page_1.html

SHARED_KIT_DIR dir is {GUIDES_DIR}/_shared
  * guide.css, guide.js, the shared header/footer markup snippet, the shared editor animation engine.
  * As built on 2026-10-19 (read these before writing a page):
    * {SHARED_KIT_DIR}/TEMPLATE_page.html — copy it for every step page; it holds the header, rail,
      both Continue buttons, the screenshot frame, the detail section, Back, and the footer.
    * {SHARED_KIT_DIR}/guide.css and guide.js — layout and page behavior (classes .g-*).
    * {SHARED_KIT_DIR}/anim/anim.js (+ anim.css) — GuideAnim, the screenshot animator: cursor, click,
      ring, typing into a box, chat post and AI reply, flash, region swap, whole-screen swap,
      progress bar, sparkles, zoom, caption. Its header comment is the API. It works on ANY
      screenshot, in that image's own pixel coordinates.
    * GuideAnim.EDITOR (in anim.js) — the homepage editor screenshot, 5504 x 3072 coordinate space,
      with the boxes of its parts (input, post, log, script, toggle, firstFrame, timeline, ...).
      Images in {SHARED_KIT_DIR}/editor_anim/img/ (editor, storyboard, kitchen, beach).
    * On a phone the editor screenshot is small: use a { zoom: box } step in an animation, or a
      cropped close-up image under the full screenshot, when the control to click is tiny.

GUIDE_IMG_DIR is the img/ dir inside each guide's own folder, e.g. {GUIDES_DIR}/5_storyboard/img/

PRODUCTION_CODE_DIR dir is {ROOT_DIR}/all/film/code
  * The real ACT 3 web app. Main frontend: {PRODUCTION_CODE_DIR}/p/act3ai-appclient. Backend:
    {PRODUCTION_CODE_DIR}/p/act3ai-appsrv. Its routes and navigation show which page follows which.

PM_MOCK_DIR dir is {ROOT_DIR}/all/app/pm/film/ui/mock/v4
  * PM specs for every v4 page: what each page does and what comes after it.
  * NEW_PROJECT_FLOW_FILE is file {PM_MOCK_DIR}/new_project/flow.md (the ORDER of the New Project
    wizard, every Continue and Back; §1 Import Script path, §5 Empty Script path, §8 AI Screenwriter lane)
  * NEW_PROJECT_SPEC_FILE is file {PM_MOCK_DIR}/new_project/new_project.mdx (outranks flow.md for the
    AI Screenwriter path and the progress tabs)

MOCK_CODE_DIR dir is {ROOT_DIR}/all/app/code/film/ui/mock/v4
  * The code that goes with the PM specs above. WIZARD_STEPS, nextStep(), prevStep() in
    {MOCK_CODE_DIR}/new_project/wizard_kit/wizardKit.tsx are the truth for wizard order.
  * Claude Design HTML of each page: {MOCK_CODE_DIR}/{page}/{version}/{dark|light}/index.html and
    {MOCK_CODE_DIR}/{page}/out/claude_design_{dark|light}.html
  * {MOCK_CODE_DIR}/render-html-jpeg.mjs renders one of those HTML files to a JPEG.

KEY_PAGES_DIR dir is {ROOT_DIR}/all/film/design/key_pages
  * The screenshots of every key page, one folder per page (or per area/page), numbered version
    folders inside. Index: {KEY_PAGES_DIR}/pages.csv (row, rel_path, full_path, has_in, has_spec,
    highest_version).
  * {KEY_PAGES_DIR}/CLAUDE.md, {KEY_PAGES_DIR}/DESIGN.md and
    {KEY_PAGES_DIR}/global_design_input_by_human.md explain the folder and the design rules.
  * SMALL_ACT3_FILE is file {ROOT_DIR}/all/film/Small_ACT3.md (the product summary; read it).

HOMEPAGE_ROWS_DIR dir is {ROOT_DIR}/all/film/marketing/ACT3_marketing_Home/act3/rows
  * The hand-built rows of our homepage. Each row's approved variation is named in
    {ROOT_DIR}/all/film/marketing/ACT3_marketing_Home/act3/summary_sections.csv (column
    variation_approved), and lives at {HOMEPAGE_ROWS_DIR}/{directory}/v/{variation}/ as
    row.html + row.css + row.js + planning.md.
  * EDITOR_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_4_editor_proof (approved variation 38 on 2026-10-19:
    the real editor with a chat that types, a script import, a storyboard switch, a timeline scroll).
    Its needs.txt says what each demonstration point animates.
  * CHAT_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_2_ai_chat (approved variation 29: AI chat typing).
  * HERO_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_1_hero (approved variation 42).
  * Always re-read summary_sections.csv for the CURRENT approved variation numbers; the numbers above
    are a snapshot.

SITE_TEMPLATE_CSS is file {SITE_REPO_DIR}/site/css/v4-template.css (the site's colors, type and
  spacing tokens, --v4t-*; the guides must look like they belong next to the homepage)

SITE_NAV_FILE is file {SITE_REPO_DIR}/site/data/siteNav.ts (the one source of site navigation; READ
  for link targets, do NOT edit)

STATUS_FILE is file {SITE_REPO_DIR}/prompts/step_guides_status.md

THE_DATE_TIME_STRING is the string "{Date}_{Time}_" where it uses "_" instead of any special characters,
  so it is purely alphanumeric or underscores.

THE_LOG_FILE is the file ~/T/_Log/{THE_DATE_TIME_STRING}_step_guides.log

REPORT_FILE is file ~/to/ACT3_step_guides_update.md

PREVIEW_URL_BASE is the value http://localhost:3000/step_guides
LIVE_URL_BASE is the value https://act3ai.com/step_guides

THE_GUIDES are the eight guides below (number, folder, short button label, line beside the button):
  0  0_step_by_step_guide   (the table of contents; no walkthrough layout)
  1  1_create_account       Create Account      Create your account, then start your first project.
  2  2_import_script        Import a Script     Bring in your screenplay and watch it become a film.
  3  3_empty_script         Empty Script        Start a new project from a blank script.
  4  4_ai_screenwriter      AI Screenwriter     Let the AI Screenwriter write your script with you.
  5  5_storyboard           Storyboard          Get the storyboard built for every shot.
  6  6_first_frame          Improve First Frame Perfect a shot's first frame, then return to the editor.
  7  7_build_videos         Build Videos        Build videos, improve the script, move through the timeline.
  * Folder names and labels may be tightened by the guide's agent, but keep the leading number and
    keep the line beside each button at 12 words or fewer. If a folder is renamed, fix every link to it.


Create THE_LOG_FILE if it does not exist. Append a line to it at every stage boundary below.


====================================================================
  HARD RULES (pass every one of these to every agent you start)
====================================================================

* Never create, edit or append to ANY CLAUDE.md file. If this work makes one stale, put the exact
  proposed text under "CLAUDE.md suggestions" at the end of REPORT_FILE. Bryan applies them.
* Never create, switch or push git branches. Never git push. Never commit unless Bryan asks.
* Write only under {GUIDES_DIR}, plus STATUS_FILE, THE_LOG_FILE and REPORT_FILE. Every other directory
  named in VARIABLES is READ-ONLY: production code, PM specs, mock code, key page images, homepage rows.
* Outside {GUIDES_DIR}, the ONLY site code this prompt may change is the More menu entry of STAGE 2b
  (SITE_NAV_FILE plus the few link renderers it needs). Never touch site/pages/ or any generated file.
  Any other navigation or footer link is a suggestion in REPORT_FILE, with the exact change.
* Never use macOS find or Spotlight tools. Use rg, fd, ls.
* Never use bare diff or git difftool. Use git --no-pager diff.
* External scripts only from cdnjs.cloudflare.com, cdn.jsdelivr.net/npm/ or unpkg.com, each pinned to
  an exact version. Prefer none: plain HTML, CSS and vanilla JS. Fonts the same way the homepage rows
  load them (Google Fonts link), one link per page, no duplicate faces.
* Every image a page shows must be copied into that guide's own img/ folder (compressed JPEG or WebP,
  long edge 2400 px or less, under 600 KB each). A page may never reference a path outside
  {SITE_STATIC_DIR}; visitors do not have Bryan's disk.
* Never invent a button, page or feature. Every click a guide tells the reader to make must exist in
  the production code, the PM spec, or the screenshot it shows. When those three disagree, follow the
  order in Appendix A section A.4 and note the disagreement in REPORT_FILE.


====================================================================
  STAGE 0: READ IN
====================================================================

* Read Appendix A, B and C of this file in full.
* Read SMALL_ACT3_FILE, {KEY_PAGES_DIR}/CLAUDE.md, {KEY_PAGES_DIR}/DESIGN.md,
  {KEY_PAGES_DIR}/global_design_input_by_human.md and {KEY_PAGES_DIR}/pages.csv.
* Read NEW_PROJECT_SPEC_FILE and NEW_PROJECT_FLOW_FILE in full.
* Read SITE_TEMPLATE_CSS (tokens, colors, button styles) and SITE_NAV_FILE (link targets for
  Get Started, Login, Plans).
* Read summary_sections.csv, then the approved variation of the hero row, the AI chat row and the
  editor row: planning.md, row.html, row.css, row.js, and EDITOR_ROW_DIR/needs.txt.
* Open https://act3ai.com/ (or run `pnpm start` in {SITE_REPO_DIR} and open http://localhost:3000/)
  and look at the homepage. This is the visual bar the guides must meet.
* If {GUIDES_DIR} already exists, list it and read STATUS_FILE: this is an update run.
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".
* Output to stdout "  STEP GUIDES: read-in done. Building the shared kit next."
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".


====================================================================
  STAGE 1: STATUS FILE
====================================================================

* Read STATUS_FILE fresh from disk every time you use it. Write it back to disk after every change.
* If it does not exist, create it with this table (one row per guide):

  STATUS_TABLE:
  Guide | Folder                  | Pages | Progress | Done   | Notes
  0     | 0_step_by_step_guide    |       | [     ]  | [     ] |
  1     | 1_create_account        |       | [     ]  | [     ] |
  2     | 2_import_script         |       | [     ]  | [     ] |
  3     | 3_empty_script          |       | [     ]  | [     ] |
  4     | 4_ai_screenwriter       |       | [     ]  | [     ] |
  5     | 5_storyboard            |       | [     ]  | [     ] |
  6     | 6_first_frame           |       | [     ]  | [     ] |
  7     | 7_build_videos          |       | [     ]  | [     ] |

  Plus one row for the shared kit:
  kit   | _shared                 |       | [     ]  | [     ] |

* Progress values: [     ] never worked on · [IN-PR] in progress · [ DONE] built and verified.
* On an update run, set every [ DONE] row back to [     ] in the Progress column only, so each guide
  gets re-checked against the current product. Keep the Notes.


====================================================================
  STAGE 2: THE SHARED KIT AND GUIDE 0 (you, the lead session, do this before any agent starts)
====================================================================

The seven walkthroughs must look like one product. Build the common parts once, here, so every agent
uses them instead of inventing its own.

* Mark the kit row [IN-PR] in STATUS_FILE.
* Build {SHARED_KIT_DIR}/guide.css: the walkthrough layout from Appendix A section A.2 (left step rail,
  wide right area, top crumb, title, goal sentences, screenshot frame, detail section, prev/next
  controls, mobile layout), the primary button from A.1, and the color, type and spacing tokens taken
  from SITE_TEMPLATE_CSS and the homepage rows. Dark ground like the homepage.
* Build {SHARED_KIT_DIR}/guide.js: marks the current step in the rail, keyboard left/right for
  previous/next page, starts and stops animations when they scroll into or out of view, and turns every
  animation off under prefers-reduced-motion.
* Build {SHARED_KIT_DIR}/editor_anim/: a reusable, scoped copy of the homepage editor animation
  (EDITOR_ROW_DIR approved variation, plus the chat typing from CHAT_ROW_DIR). Make it drivable by a
  small script per page: type this text into the chat window, move the cursor to this spot, click this
  button, flash this pane, switch to the storyboard view, scroll the timeline. Copy, never link, the
  row files; scope every CSS rule and id under one wrapper class so it cannot collide with the page.
* Build the site header and footer for the guide pages: a slim top bar with the ACT 3 AI logo (links
  to https://act3ai.com/), "Step-by-Step Guide" (links to guide 0), and the Get Started button (same
  target as SITE_NAV_FILE). A short footer with the copyright line. Same look as the homepage's.
* Build guide 0 at {GUIDES_DIR}/0_step_by_step_guide/page_1.html, exactly as Appendix A section A.1.
  Also write {GUIDES_DIR}/index.html as a copy of it (fix relative paths) so /step_guides/ works.
* Build one example walkthrough page with placeholder text using the kit, open it in a browser at
  1440 px and 390 px wide, and fix the kit until it matches A.2. Delete the example when done.
* Mark guide 0 and the kit [ DONE]. Fill in the Pages column.


====================================================================
  STAGE 2b: "STEP-BY-STEP GUIDE" IN THE MORE MENU (lead session)
====================================================================

* Pulling down the site's "More" menu must show "Step-by-Step Guide". Clicking it opens guide 0, the
  table of contents: /step_guides/0_step_by_step_guide/page_1.html
* Add it to MORE_NAV in SITE_NAV_FILE, directly above Articles. Articles MUST stay the last entry
  (SEO invariant).
* The guides are static HTML files, not Docusaurus routes, so the link must be a plain <a href> with a
  full page load: no @docusaurus/Link, no SPA navigation (data-v4-spa), or the router shows a 404.
  Give NavItem a flag for that (for example `plain: true`, "a static file outside the SPA") and honor
  it everywhere MORE_NAV is drawn: site/components/v4/V4Link.tsx (and V4Header.tsx that passes it on),
  site/components/v4/rowTransforms.ts linkHtml() (the homepage hero's own More menu), and the
  NAVBAR_ITEMS map in docusaurus.config.ts (use `href`, same tab, for a plain item). Keep the change
  small and in the style of the surrounding code.
* Check it on the homepage (/), on a v4 page (/about), on a docs page's phone drawer and in the
  mobile menu: the entry shows, sits above Articles, and opens guide 0.


====================================================================
  STAGE 3: ONE AGENT PER GUIDE (guides 1 through 7, in parallel)
====================================================================

* Start seven agents at the same time, one per guide 1 through 7 (Agent tool, one message, seven calls).
  If agents are not available, do the guides one at a time yourself, in order.
* Each agent's brief is: this whole prompt file path, its guide number, and these instructions:
  * Read this prompt file in full, Appendix A, B and C included. Obey every HARD RULE. Never write a
    CLAUDE.md, and never tell anything you start to write one.
  * Set your row to [IN-PR] in STATUS_FILE (read it fresh first; write it right after).
  * Work only inside your guide's folder {GUIDES_DIR}/{your folder}/. Use the shared kit in
    {SHARED_KIT_DIR} unchanged. If the kit truly lacks something you need, add it inside your own folder
    and say so in your final message; do not edit the kit (other agents are using it).
  * Trace your path through the product (Appendix A section A.5 gives the start and end of your path
    and where to look). Read the PM specs, the mock code and the production code for every screen on
    the path. List the screens in order, and for each one: what the filmmaker sees, the decision they
    face, the exact control they press to move on, and where it takes them.
  * Turn that list into steps. One step = one page = page_N.html (page_1.html is the first step).
    Aim for 4 to 8 steps. Merge screens that need no decision; split a screen that holds two decisions.
  * For every step, pick the screenshot (Appendix A section A.3) and copy it into your img/ folder.
  * Write each page with the layout in A.2 and the writing rules in A.6. Every page shows the full
    step rail of your guide with the current step selected.
  * Add motion where it teaches (A.7). Editor steps use {SHARED_KIT_DIR}/editor_anim/.
  * Every page has the Continue button (A.2) above AND below its screenshot. Continue opens the next
    step's page, where the rail selection has moved one row down. On the LAST step, Continue goes
    back to guide 0, the table of contents. The last page may also carry a Get Started button lower
    in its detail section.
  * Verify (STAGE 4 checks) on your own pages. Then set your row to [ DONE], fill in Pages and Notes.
  * Final message: the page list with one-line summaries, any product disagreements you found, any
    screen that had no usable screenshot, anything you added outside the kit.


====================================================================
  STAGE 4: VERIFY EVERYTHING (lead session, after all agents finish)
====================================================================

* In {SITE_REPO_DIR}: run `pnpm build`. It must pass. Then `pnpm serve` (or `pnpm start`) and open
  every page under PREVIEW_URL_BASE in a real browser.
* For every page check:
  * No console errors, no 404 for any image, script, style or font.
  * Every link works: TOC buttons, the back chevron, the step rail, both Continue buttons (the last
    step's go to guide 0), Back, header, footer, and the More menu entry on the Docusaurus site. Write a small link-walker script in the scratchpad if that is faster than clicking.
  * Layout at 1440 px, 1024 px and 390 px wide: rail at 20 percent or less on desktop, no horizontal
    scroll on a phone, screenshot full width of the right area unless that makes it too tall (A.2).
  * Writing rules (A.6): at most three goal sentences, at most 18 words each. Count them; a script is
    fine.
  * Animations start on view, stop off view, and are off under prefers-reduced-motion.
  * The page matches the homepage's look closely enough to sit beside it.
* Take one desktop screenshot of guide 0 and of page_1 of each walkthrough into the scratchpad, and
  look at every one.
* Fix what fails. If a fix belongs inside a guide folder, fix it there.
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".
* Output to stdout "  STEP GUIDES: all guides built and verified."
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".


====================================================================
  STAGE 5: REPORT
====================================================================

* Write REPORT_FILE: summary on top (what was built or changed), then per guide its page list, then
  details. Include up to five URLs Bryan will most want to open: guide 0 and the most changed pages,
  both as PREVIEW_URL_BASE links and as LIVE_URL_BASE links (live after the next push to main).
* List every product disagreement the agents found (spec vs code vs screenshot), every missing
  screenshot, and the suggested navigation change (where the site should link to guide 0).
* End with "CLAUDE.md suggestions" if anything here made a CLAUDE.md stale. Do not edit any CLAUDE.md.
* Do not commit. Tell Bryan the guides are ready to review and commit.




====================================================================
====================================================================
  APPENDIX A: BACKGROUND, LAYOUT, AND THE CONTENT PLAN
====================================================================
====================================================================

A.0  WHAT THESE PAGES ARE FOR
------------------------------
* ACT 3 AI is an AI filmmaking web app: script, then cinematography, then video. Beats, Acts, Scenes and
  Shots are film terms here and mean exactly what they mean to a screenwriter and a cinematographer.
  Think like a cinematographer when you describe a shot, a first frame or a storyboard.
* A new filmmaker opens the app and does not know where to start. These guides walk them through it,
  step by step: what to get done next, what to look for on the screen, what to click, and why.
* They are marketing-quality pages. They should make the product look as good as the homepage does,
  while staying calm enough to learn from. No animation that distracts from the instruction.
* They live on the marketing site (the Docusaurus site at {SITE_REPO_DIR}, served at act3ai.com) as
  static HTML under /step_guides/, because HTML gives us full control of graphics and motion.
* The path pattern is ./step_guides/{number}_{name}/page_{N}.html, with page_1.html as the first page
  of each guide.

A.1  GUIDE 0: THE STEP-BY-STEP GUIDE (table of contents)
---------------------------------------------------------
* Title: "Step-by-Step Guide". One short line under it saying what the guides are.
* A vertical list of seven rows, one per guide 1 through 7, in order.
* Each row: a PRIMARY BUTTON on the left, and up to 12 words of description to its right.
  * The button: the same yellow primary button as the walkthrough Continue (A.2 item 2b): yellow fill,
    white text, a few words (the short label in THE_GUIDES), and a right
    arrow on the right side of the button.
  * All seven buttons the same width, so the descriptions line up in one column.
  * Clicking the button (or the row) opens page_1.html of that guide.
* No walkthrough rail on this page. It may carry a little marketing polish (a soft background graphic,
  a hover lift on the buttons) but it is a menu first.
* On a phone the description wraps under its button.

A.2  THE WALKTHROUGH PAGE LAYOUT (guides 1 through 7, every page)
------------------------------------------------------------------
Two columns.

LEFT COLUMN: THE STEP RAIL (no more than 20 percent of the screen width)
* Top, small text: the guide this is, e.g. "#2 Import a Script", with a LEFT-FACING CHEVRON on the left
  of the text. Clicking it goes back to guide 0 (the table of contents).
* Under it, bigger text: the name of the step the reader is on now.
* Under that, the list of steps of this guide. Each row is one step, numbered (1, 2, 3 ...).
  * Keep each step's label short: no more than three lines tall in the rail, ideally one or two. Be
    succinct.
  * The current step is selected: its background fill is the dominant (primary) color and its text is
    white. The others are quiet.
  * Clicking any step opens that step's page.
* The rail stays in view while the right side scrolls (sticky), on desktop.

RIGHT COLUMN: THE BIG WIDE AREA (the rest of the width), top to bottom
1. The step title (large).
2. Up to THREE sentences: the goal of this step, what to look for, and what to click or do to move
   forward. See the writing rules in A.6.
2b. The CONTINUE button, right-aligned (on the right side of the wide area), between the sentences
   and the screenshot.
   * A primary button: yellow fill (the site yellow, --v4t-yellow #eebc3c, hover --v4t-yellow-hi)
     with white text, the word "Continue", and a right-facing chevron on its right side.
   * Keep the white text readable on the yellow: bold weight, and a soft dark text shadow or a slightly
     deeper gold toward the bottom of the fill. Do not swap the white text for dark text.
   * Clicking it opens the NEXT step's page (page_{N+1}.html), so the selection in the left rail moves
     to the row below. On the last step it opens guide 0, the table of contents.
   * The same button appears again right-aligned UNDER the screenshot (see 5).
3. The SCREENSHOT of the screen the reader is looking at during this step, right under those
   sentences. Make it the full width of the right area. If full width makes it so tall the reader
   cannot see the sentences and the top of the image together on a laptop screen, it may be narrower.
   Give it a thin rim and a shadow so its edges read against the page (like the homepage's editor row).
   A callout (a highlight ring, an arrow, a pulse) may point at the control to click.
4. Under the screenshot: MORE DETAIL. Guidance and guidelines for this stage: what this page is, what
   to focus on, and why the reader is going where they are going. If there is a decision to make here,
   name it, give the options, and say which to pick when. Short on top, more detail below, always very
   clear.
3b. The second CONTINUE button, right-aligned, directly under the screenshot (identical to 2b).
5. At the very bottom, a quiet "Back" text link to the previous step (step 1's Back goes to guide 0)
   on the left, and the Continue button once more on the right only if the detail section is long.

ONE PAGE PER STEP
* Every step in the left rail has its own HTML page: page_1.html, page_2.html ... in step order.
* Walking a guide is: press Continue, the next page opens with the next rail row selected; after the
  last step, Continue returns to guide 0.

PHONE WIDTH
* The rail collapses to the top: the chevron crumb, the current step name, and the step list as a
  compact horizontal strip (or a "Step 3 of 6" control that opens the list). The right column then
  runs full width. 16 px side gutters, no horizontal page scroll.

A.3  SCREENSHOTS: WHERE THEY COME FROM AND HOW TO PICK
-------------------------------------------------------
* Source: {KEY_PAGES_DIR}. Search under it for the screen the reader is looking at in this step. Use
  pages.csv to map a screen to its folder, then use its highest numbered version folder.
* In a version folder prefer, in this order: claude_design_dark.jpg, nb_pro_dark.jpg, then the light
  versions. The site is dark, so dark images sit better. A *_full.jpg is the whole scrolling page; use
  it only when the step is about something far down the page.
* An in/ folder holds captures of the shipping product Bryan put there. Use one when no designed
  version exists, or when the step is about something only the shipping page shows.
* If a page's spec (the .mdx in its folder) has a "Reference images" table, read it: it says what each
  file really shows, and some files are misnamed. Never rename a file there.
* When no image fits, render the matching Claude Design HTML from {MOCK_CODE_DIR} with
  {MOCK_CODE_DIR}/render-html-jpeg.mjs, or take a browser screenshot of the running mock. Record which
  you did in your Notes.
* Copy the chosen file into the guide's img/ folder with a descriptive name (step_3_upload_script.jpg),
  compressed (A.HARD RULES). Write meaningful alt text.

A.4  WHICH SOURCE WINS (when the code, the spec and the screenshot disagree)
-----------------------------------------------------------------------------
* The production code under {PRODUCTION_CODE_DIR} is what a real user sees today.
* The PM specs under {PM_MOCK_DIR} and their code under {MOCK_CODE_DIR} are the next-generation design,
  and they are great at explaining what each page does and what comes after it. Reading that code is
  very useful for the order of pages.
* The screenshots under {KEY_PAGES_DIR} are mostly the next-generation designs.
* The guides teach the flow the PM specs describe, shown with the key-page images, because that is
  the product the marketing site sells. Where the production app does something different today,
  keep the guide's words true for both if you can (name the goal, not a pixel), and list the gap in
  REPORT_FILE.

A.5  THE SEVEN PATHS (start, end, and where to look)
-----------------------------------------------------
The step lists below are a starting point. Each agent confirms them against the code and specs, and
may merge, split or rename steps.

GUIDE 1: Create your account, then start a new project
* Path: the act3ai.com Get Started button, create account (or sign in), the plan/credits screen if the
  flow shows one, the Home page, Start Creating (the "Create New Project" entry), the first wizard page
  (Starting Info: name the film, frame shape, type, organization).
* Look in: {KEY_PAGES_DIR}/create_account, signin, pay, home, new_project/starting_info;
  {PM_MOCK_DIR}/create_account, signin, home, new_project; the production app's sign-up and home routes.
* Ends with: the reader on Starting Info, pointed at guides 2, 3 and 4 (the three ways to get a script).

GUIDE 2: Create a new project by importing a script
* Path: NEW_PROJECT_FLOW_FILE §1. Home, Starting Info, Script Create or Upload (Option 1 "Import
  Script"), Upload Script (drop a Final Draft or PDF screenplay), Progress Script Import (beats, scenes
  and shots appear), Visual Options, Render Style, Plot (treatment), Character Overview, Character
  List, Character looks (Create Character Sheets or Upload Photos), character progress, Storyboards for
  the full film, storyboard progress, Film Build progress, the Editor.
* Look in: {KEY_PAGES_DIR}/new_project/*, {PM_MOCK_DIR}/new_project/*,
  {MOCK_CODE_DIR}/new_project/wizard_kit/wizardKit.tsx.
* Group the 14 wizard screens into readable steps (for example: Name your film · Import the script ·
  Watch it break down · Pick the look · Meet your cast · Storyboards and build · Open the editor).
* Motion idea: the homepage editor row's Final Draft import (sheet slides up, sparkles flow into the
  script pane, the pane flashes).

GUIDE 3: Create a new project with an empty script
* Path: NEW_PROJECT_FLOW_FILE §5, the Empty Script path. Option 2 "Start with Empty Script" on Script
  Create or Upload, then the steps §5 lists, then the Editor with an empty script, and how to start
  writing in the script pane or with the AI chat.
* Look in: the same folders as guide 2, plus {KEY_PAGES_DIR}/script and {PM_MOCK_DIR}/script.

GUIDE 4: Create a new project with the AI Screenwriter writing your script
* Path: NEW_PROJECT_FLOW_FILE §8 and NEW_PROJECT_SPEC_FILE §3 to §4 (they win). The AI Screenwriter
  option, then its pages (idea, video type, duration, acts, beats, credit approval, script-writing
  progress), then back into the wizard at Visual Options to finish, then the Editor.
* Look in: {KEY_PAGES_DIR}/screenwriter_ai/*, {PM_MOCK_DIR}/screenwriter_ai/*,
  {MOCK_CODE_DIR}/screenwriter_ai, {KEY_PAGES_DIR}/story_arc/*.
* Explain Acts and Beats the way a screenwriter would, in one line each.

GUIDE 5: Getting the storyboard built
* Path: the wizard's Storyboards for the full film decision and its progress wall, or, from the
  Editor, asking for the storyboard (the chat: "show me the storyboard") and the Storyboard page:
  read it shot by shot, regenerate a frame you do not like, approve.
* Look in: {KEY_PAGES_DIR}/storyboarding/storyboard, new_project/storyboards_full_film,
  {PM_MOCK_DIR}/storyboarding, {PM_MOCK_DIR}/new_project/progress_storyboards, the editor row's
  storyboard demonstration point (it uses its in/storyboard.jpg).
* Motion idea: the editor animation typing "show me the storyboard" and switching views.

GUIDE 6: Improving a first frame
* Path: Editor, select a shot, open First Frame (the Image Builder), improve the prompt and the
  references, generate, compare and pick, Return to Editor and see the new frame on the timeline.
* Look in: {KEY_PAGES_DIR}/editor, image_builder/first_frame, {PM_MOCK_DIR}/editor,
  {PM_MOCK_DIR}/image_builder/first_frame, {MOCK_CODE_DIR}/image_builder, {KEY_PAGES_DIR}/_stills
  (real first frames and takes, e.g. aberdeen_shot40_first_frame_v1.jpg).
* Explain why the first frame matters: it sets the composition, lighting and look the video shot
  starts from, so a better first frame means fewer video generations.

GUIDE 7: Build videos, improve the script, and move through the timeline
* Path: in the Editor, build the video for a shot (or a scene), watch it render, review the take, ask
  the AI chat to change the script (a line, a set, an actor's action) and see the script pane update,
  move through the timeline (scenes, shots, from a 2-hour movie down to a few frames), play it back.
* Look in: {KEY_PAGES_DIR}/editor, shot/*, script, project/*; {PM_MOCK_DIR}/editor (editor.mdx,
  timeline.mdx, video_play.mdx, menus.mdx), {PM_MOCK_DIR}/shot; {MOCK_CODE_DIR}/editor; the production
  editor in {PRODUCTION_CODE_DIR}/p/editor and act3ai-appclient.
* Motion idea: the editor row's chat typing a change ("change the set to a Maui beach, she carries a
  surfboard"), the pane flash, and the timeline scroll.

A.6  WRITING RULES
-------------------
* The goal sentences under each step title: three sentences or fewer. 18 words or fewer per sentence.
  The more succinct, the better.
* Those sentences say: what you are trying to get done next, what to look for, and what to click or do
  to move forward.
* The detail section below the screenshot may be longer, but stays very clear: what this page is, what
  to focus on, the decision (if any) and how to make it, and why you are going where you go next.
* Use the product's real button and page names, written exactly as the screen shows them.
* Plain words. Second person ("you"). No hype words in the instructions.
* Use "ACT 3 AI" as the product name. Use "Assistant Director Team", never "Level 2", if it comes up.
* Film terms (beat, scene, shot, act, first frame, take, storyboard) are used correctly, the way a
  screenwriter and a cinematographer use them.
* Step labels in the rail: a few words each, no more than three lines tall.

A.7  GRAPHICS AND MOTION
-------------------------
* Match the homepage: its dark ground with the faint rule lines, the warm yellow accent, the type
  families the rows use, the framed screenshots. Read the approved homepage rows and copy their visual
  language. These are marketing-level graphics.
* Motion is allowed and welcome where it teaches, especially in the editor: typing into the chat
  window, a cursor moving to a button and clicking it, a pane flashing when it updates, a view switching,
  the timeline scrolling. Reuse the homepage editor (the shared editor_anim kit) for those.
* Motion must never pull the eye away from the instruction. Slow, short loops. No motion behind the
  goal sentences. Off under prefers-reduced-motion, and paused when off screen.
* A plain screenshot with one callout is fine for a step that needs no motion.
* Tools: whatever made the homepage rows (hand-built HTML, CSS and JS, Claude Design HTML from the key
  pages, Claude Motion style animation). Keep each page light enough to load fast.

A.8  FILES AND URLS
--------------------
* {GUIDES_DIR}/index.html                       copy of guide 0
* {GUIDES_DIR}/0_step_by_step_guide/page_1.html  guide 0 (table of contents)
* {GUIDES_DIR}/_shared/                          guide.css, guide.js, editor_anim/, header/footer
* {GUIDES_DIR}/{n}_{name}/page_{N}.html           one page per step
* {GUIDES_DIR}/{n}_{name}/img/                    that guide's screenshots
* {GUIDES_DIR}/{n}_{name}/anim/                   that guide's animation scripts (if any)
* Live: https://act3ai.com/step_guides/{n}_{name}/page_{N}.html
* Use relative links between guide pages (../2_import_script/page_1.html) so the same files work on
  localhost and on act3ai.com.
* Each page gets a real <title> ("Import a Script, Step 3 · ACT 3 AI"), a meta description, a canonical
  URL on act3ai.com, and the site favicon.




====================================================================
====================================================================
  APPENDIX B: BRYAN'S ORIGINAL REQUEST (verbatim, 2026-10-19)
====================================================================
====================================================================

We need to create a number of pages on what to do, step by step, in a number of step-by-step walkthroughs.

0) Step-by-Step Guide: This has a number of buttons, and it'll be a primary button with a few words and a right arrow on the right side. It's a primary button with a background color and white text. To the right of it will be maybe up to 12 words, and that'll be one of the ones below. Hitting that button will open up that one.

#1) Creating account. Then starting a new project
#2) Creating a new project: Import Script
#3: Create new project (empty script)
#4): Create new project with AI Screenwriter creating your script

#5) Getting the storyboard built
#6) Improving a first frame: Editor => First Frame (image builder) => improve and generate => Return to editor
#7) Build videos & Improve script & move through timeline

Besides the number 01, the rest of them, we want to have. This is going to be kind of like the marketing-level graphics. See our main home page. We don't need to have animation, and we don't want to have that be too distracting. We can have animation, actually, especially when it comes to the editor. We can reuse the editor that we use on the home page and then animate whether typing into the chat window, using a cursor, clicking a button, or whatever.

The layout of the pages, everything besides the 0 number (the table of contents one), is going to be where we have the steps along the left. That will generally be no more than 20% of the width of the screen, and we'll have a big, wide area on the right side.

We'll have small text on top, which says which step they're in, and that'll be the number 1 through number 7 below. It'll have the title of it, and it'll have a left-facing chevron on the left side of the text. Clicking will go back to the table of contents number 0 above.

Then you'll have bigger text under there, which is the name of the step they're on right now. That left list will be a number of steps. We try not to be more than three rows tall. Try to be succinct. Each row there is a step. They could be numbered, with one of them selected so the background fill is more dominant and the text is white.

Under the title, we can have up to three sentences. It should be focused on what your goal is to try to get accomplished next, what you look for, and what you click on or do to advance forward to accomplish that. Three sentences or less. Make sentences not too long: 18 words per sentence or less. The more succinct, the better.

Under that, it ends up being a screenshot, and you can use that directory down below the design/key_pages/1/search under there, based on what screen they're going to be staring at. You want to be showing that right below those three sentences and try to make it the full width if possible. If it ends up being too much of the height, you don't necessarily have to, but probably try to make it the full width of this air space.

Underneath it, you can have more text to explain more about what you are trying to do, or guidance or guidelines. You're giving them a guide at the stage. Maybe it matters if they got a decision to make: what's the decision to make? We want to be succinct on top, then have more detail down below, but be very, very clear on clear guidance. Have them understand the page they're looking at, what they should be focused on doing, and why they're where they're going and why.

When the prompt file runs, it can assign a different agent for each one of the numbered items above. Each path can be designed separately.

When on the web, the StockySources website, we should make sure all these pages are created and placed under

./step_guides/1_{name}/
./step_guides/{number}_{name}/page_1.html

You're creating HTML because you want to utilize graphics and motion. You can use Claude Design, Claude Motion, whatever was used to create our marketing homepage. Was great

The production code is underneath the directory below. That's also a great way to find out which page follows which page.
~/BGit/all/film/code/

This directory under here is PM files, and they're great at explaining what page does what, often what comes after what page.
~/BGit/all/app/pm/film/ui/mock/v4/

These are often the codes that go with that PM work above. It often helps explain what page goes after what. Reading the code is very useful.
~/BGit/all/app/code/film/ui/mock/v4/

Below is a directory of images.
~/BGit/all/film/design/key_pages/

Interpretation notes (added when this prompt was written, for the agents):
* "Besides the number 01" means every guide except guide 0 gets the walkthrough layout and the
  marketing-level graphics.
* "the StockySources website" is a transcription slip for the Docusaurus website: this repo, act3ai.com.
* "design/key_pages/1/search under there" means search under {KEY_PAGES_DIR} for the right screen.
* "not more than three rows tall" is read as: each step label in the rail stays within three lines.
* "this air space" means the wide right-hand area.




====================================================================
  APPENDIX C: BRYAN'S FOLLOW-UP (verbatim, 2026-10-19)
====================================================================

Now carry out that prompt file. Add to it that the More menu, when you pull it down, should have a step-by-step guide, and that click goes to the end, the number 01, the table of contents.

Also, every single guide should be designed as a number of steps, and on the right side should be a Continue with the right chevron. On the right side, it's a primary button with yellow text and white text. Make sure that button exists above the screenshot and also below the screenshot. Clicking the button goes to the next. It'll move the step selection to the one down below.

Below the right, the next page, you can create different HTML pages for each one of those, so each step on the left can have that. When you get to the end, it can go back to the number 0 table of contents.

Update the prompt file so it has all this information in there and is improved in all those ways, and then carry it out.

Interpretation notes:
* "the number 01, the table of contents" is guide 0.
* "a primary button with yellow text and white text" is read as a yellow-filled primary button with
  white text (A.2 item 2b). The guide 0 buttons use the same yellow primary style so the site has one
  primary button.
* Every step is its own page; the last step's Continue returns to guide 0.
