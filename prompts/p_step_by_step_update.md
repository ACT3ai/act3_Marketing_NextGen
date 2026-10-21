Build (or update) the ACT 3 AI "Step-by-Step Guide" pages on the act3ai.com marketing site.

Guide 0 (table of contents) opens nine walkthroughs (guides 1-9). Each teaches a new filmmaker one path through the ACT 3 AI web app, one screen at a time: what to look at, what to click, and why. Hand-built HTML, marketing-level graphics, gentle motion, same look as our homepage.

Run from any directory; everything is found through the variables below. Re-running UPDATES the guides: re-read the product, keep what is still correct, fix what drifted. Never start over unless a guide is missing.

Appendix A (bottom) holds all background, layout, writing rules and the per-guide content plan. Every agent reads Appendix A in full before writing anything.


====================================================================
  VARIABLES
====================================================================

ROOT_DIR dir is ~/BGit

SITE_REPO_DIR dir is {ROOT_DIR}/act3/act3_Marketing_NextGen

SITE_STATIC_DIR dir is {SITE_REPO_DIR}/site/static

GUIDES_DIR dir is {SITE_STATIC_DIR}/step_guides
  * Everything this prompt builds goes here. Docusaurus copies site/static/ as-is, so {GUIDES_DIR}/2_import_script/page_1.html is served at https://act3ai.com/step_guides/2_import_script/page_1.html

SHARED_KIT_DIR dir is {GUIDES_DIR}/_shared
  * Read before writing a page:
    * TEMPLATE_page.html — copy for every step page (header, rail, both Continue buttons, screenshot frame, detail section, Back, footer).
    * guide.css, guide.js — layout and behavior (classes .g-*).
    * anim/anim.js (+ anim.css) — GuideAnim, the screenshot animator: cursor, click, ring, typing into a box, chat post and AI reply, flash, region swap, whole-screen swap (fit "contain" for another-shaped screenshot), progress bar, sparkles, zoom, caption, dropdown menu (hl a menu-bar trigger, menu, menuHover a row). Its header comment is the API. Works on ANY screenshot in that image's pixel coordinates.
    * GuideAnim.EDITOR (in anim.js) — the homepage editor screenshot, 5504 x 3072 space, with boxes of its parts (input, post, log, script, toggle, firstFrame, timeline, ...). Images in {SHARED_KIT_DIR}/editor_anim/img/ (editor, storyboard, kitchen, beach).
    * On a phone the editor screenshot is small: use a { zoom: box } step or a cropped close-up under the full screenshot when the control is tiny.

GUIDE_IMG_DIR is the img/ dir inside each guide's own folder, e.g. {GUIDES_DIR}/5_storyboard/img/

PRODUCTION_CODE_DIR dir is {ROOT_DIR}/all/film/code
  * The real web app. Frontend {PRODUCTION_CODE_DIR}/p/act3ai-appclient, backend {PRODUCTION_CODE_DIR}/p/act3ai-appsrv. Routes and navigation show which page follows which.

PM_MOCK_DIR dir is {ROOT_DIR}/all/app/pm/film/ui/mock/v4
  * PM specs for every v4 page: what it does, what comes after it.
  * NEW_PROJECT_FLOW_FILE is file {PM_MOCK_DIR}/new_project/flow.md (ORDER of the New Project wizard, every Continue and Back; §1 Import Script path, §5 Empty Script path, §8 AI Screenwriter lane)
  * NEW_PROJECT_SPEC_FILE is file {PM_MOCK_DIR}/new_project/new_project.mdx (outranks flow.md for the AI Screenwriter path and the progress tabs)

MOCK_CODE_DIR dir is {ROOT_DIR}/all/app/code/film/ui/mock/v4
  * WIZARD_STEPS, nextStep(), prevStep() in {MOCK_CODE_DIR}/new_project/wizard_kit/wizardKit.tsx are the truth for wizard order.
  * Claude Design HTML per page: {MOCK_CODE_DIR}/{page}/{version}/{dark|light}/index.html and {MOCK_CODE_DIR}/{page}/out/claude_design_{dark|light}.html
  * {MOCK_CODE_DIR}/render-html-jpeg.mjs renders one of those to a JPEG.

KEY_PAGES_DIR dir is {ROOT_DIR}/all/film/design/key_pages
  * Screenshots of every key page, one folder per page (or area/page), numbered version folders inside. Index: {KEY_PAGES_DIR}/pages.csv (row, rel_path, full_path, has_in, has_spec, highest_version).
  * {KEY_PAGES_DIR}/CLAUDE.md, DESIGN.md, global_design_input_by_human.md explain the folder and design rules.
  * SMALL_ACT3_FILE is file {ROOT_DIR}/all/film/Small_ACT3.md (product summary).

HOMEPAGE_ROWS_DIR dir is {ROOT_DIR}/all/film/marketing/ACT3_marketing_Home/act3/rows
  * Each row's approved variation is in {ROOT_DIR}/all/film/marketing/ACT3_marketing_Home/act3/summary_sections.csv (column variation_approved), at {HOMEPAGE_ROWS_DIR}/{directory}/v/{variation}/ as row.html + row.css + row.js + planning.md.
  * EDITOR_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_4_editor_proof (real editor: chat typing, script import, storyboard switch, timeline scroll; its needs.txt says what each demonstration point animates).
  * CHAT_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_2_ai_chat (AI chat typing).
  * HERO_ROW_DIR dir is {HOMEPAGE_ROWS_DIR}/row_1_hero
  * Always read summary_sections.csv for the CURRENT approved variation numbers.

SITE_TEMPLATE_CSS is file {SITE_REPO_DIR}/site/css/v4-template.css (colors, type, spacing tokens --v4t-*)

SITE_NAV_FILE is file {SITE_REPO_DIR}/site/data/siteNav.ts (the one source of site navigation; read for link targets; edit only per STAGE 2b)

STATUS_FILE is file {SITE_REPO_DIR}/prompts/step_guides_status.md

THE_DATE_TIME_STRING is the string "{Date}_{Time}_" where it uses "_" instead of any special characters, so it is purely alphanumeric or underscores.

THE_LOG_FILE is the file ~/T/_Log/{THE_DATE_TIME_STRING}_step_guides.log

REPORT_FILE is file ~/to/ACT3_step_guides_update.md

PREVIEW_URL_BASE is the value http://localhost:3000/step_guides
LIVE_URL_BASE is the value https://act3ai.com/step_guides

THE_GUIDES (number, folder, short button label, line beside the button):
  0  0_step_by_step_guide   (the table of contents; no walkthrough layout)
  1  1_create_account       Create Account      Create your account, then start your first project.
  2  2_import_script        Import a Script     Bring in your screenplay and watch it become a film.
  3  3_empty_script         Empty Script        Start a new project from a blank script.
  4  4_ai_screenwriter      AI Screenwriter     Let the AI Screenwriter write your script with you.
  5  5_storyboard           Storyboard          Get the storyboard built for every shot.
  6  6_first_frame          Improve First Frame Perfect a shot's first frame, then return to the editor.
  7  7_build_videos         Build Videos        Build videos, improve the script, move through the timeline.
  8  8_character_photos     Character from Photos  Add a character from your photos, then refine the look.
  9  9_character_ai         AI-Built Character  Add a character and let ACT 3 AI draw the look.
  * An agent may tighten folder names and labels, but keep the leading number and the button line at 12 words or fewer. If a folder is renamed, fix every link to it.

Create THE_LOG_FILE if missing. Append a line at every stage boundary.


====================================================================
  HARD RULES (pass every one to every agent you start)
====================================================================

* Never create, edit or append to ANY CLAUDE.md. If one goes stale, put exact proposed text under "CLAUDE.md suggestions" at the end of REPORT_FILE.
* Never create, switch or push git branches. Never git push. Never commit unless Bryan asks.
* Write only under {GUIDES_DIR}, plus STATUS_FILE, THE_LOG_FILE, REPORT_FILE. Every other VARIABLES directory is READ-ONLY.
* Outside {GUIDES_DIR}, the ONLY site code you may change is the More menu entry of STAGE 2b (SITE_NAV_FILE plus the few link renderers it needs). Never touch site/pages/ or generated files. Any other nav/footer change is a suggestion in REPORT_FILE with the exact change.
* Use rg, fd, ls (never macOS find/Spotlight). Use git --no-pager diff (never bare diff or difftool).
* External scripts only from cdnjs.cloudflare.com, cdn.jsdelivr.net/npm/ or unpkg.com, pinned to an exact version; prefer none (plain HTML, CSS, vanilla JS). Fonts as the homepage rows load them (Google Fonts link), one link per page, no duplicate faces.
* Every image a page shows is copied into that guide's img/ (compressed JPEG or WebP, long edge <=2400 px, <600 KB). Never reference a path outside {SITE_STATIC_DIR}.
* Never invent a button, page or feature. Every click a guide asks for must exist in the production code, the PM spec, or the screenshot shown. On disagreement follow A.4 and note it in REPORT_FILE.


====================================================================
  STAGE 0: READ IN
====================================================================

* Read Appendix A in full.
* Read SMALL_ACT3_FILE, {KEY_PAGES_DIR}/CLAUDE.md, DESIGN.md, global_design_input_by_human.md, pages.csv.
* Read NEW_PROJECT_SPEC_FILE and NEW_PROJECT_FLOW_FILE in full.
* Read SITE_TEMPLATE_CSS and SITE_NAV_FILE (targets for Get Started, Login, Plans).
* Read summary_sections.csv, then the approved variation of the hero, AI chat and editor rows (planning.md, row.html, row.css, row.js) and EDITOR_ROW_DIR/needs.txt.
* Look at the homepage (https://act3ai.com/, or `pnpm start` in {SITE_REPO_DIR} then http://localhost:3000/). This is the visual bar.
* If {GUIDES_DIR} exists, list it and read STATUS_FILE: this is an update run.
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".
* Output to stdout "  STEP GUIDES: read-in done. Building the shared kit next."
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".


====================================================================
  STAGE 1: STATUS FILE
====================================================================

* Read STATUS_FILE fresh from disk every time; write it back after every change.
* If missing, create:

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
  8     | 8_character_photos      |       | [     ]  | [     ] |
  9     | 9_character_ai          |       | [     ]  | [     ] |
  kit   | _shared                 |       | [     ]  | [     ] |

* Progress: [     ] never worked on · [IN-PR] in progress · [ DONE] built and verified.
* Update run: set every [ DONE] Progress back to [     ] (Progress column only, keep Notes) so each guide is re-checked against the current product.


====================================================================
  STAGE 2: THE SHARED KIT AND GUIDE 0 (lead session, before any agent starts)
====================================================================

The walkthroughs must look like one product: build common parts once here.

* Mark the kit row [IN-PR].
* {SHARED_KIT_DIR}/guide.css: the A.2 layout (rail, wide right area, crumb, title, goal sentences, screenshot frame, detail section, prev/next, mobile), the A.1 primary button, tokens from SITE_TEMPLATE_CSS and the homepage rows. Dark ground like the homepage.
* {SHARED_KIT_DIR}/guide.js: marks the current rail step, keyboard left/right for prev/next page, starts/stops animations on scroll into/out of view, all animation off under prefers-reduced-motion.
* {SHARED_KIT_DIR}/editor_anim/: a scoped copy of the homepage editor animation (EDITOR_ROW_DIR approved variation + chat typing from CHAT_ROW_DIR), drivable by a small per-page script (type into chat, move cursor, click, flash a pane, switch to storyboard, scroll timeline). Copy, never link, the row files; scope every CSS rule and id under one wrapper class.
* Header/footer: slim top bar with the ACT 3 AI logo (→ https://act3ai.com/), "Step-by-Step Guide" (→ guide 0), Get Started (same target as SITE_NAV_FILE); short footer with copyright. Homepage look.
* Guide 0 at {GUIDES_DIR}/0_step_by_step_guide/page_1.html exactly per A.1, plus {GUIDES_DIR}/index.html as a copy (fix relative paths) so /step_guides/ works.
* Build one placeholder walkthrough page with the kit, check it at 1440 px and 390 px, fix the kit until it matches A.2, then delete it.
* Mark guide 0 and kit [ DONE]; fill Pages.


====================================================================
  STAGE 2b: "STEP-BY-STEP GUIDE" IN THE MORE MENU (lead session)
====================================================================

* The site's "More" dropdown shows "Step-by-Step Guide", opening /step_guides/0_step_by_step_guide/page_1.html
* Add it to MORE_NAV in SITE_NAV_FILE directly above Articles. Articles MUST stay last (SEO invariant).
* The guides are static files, not Docusaurus routes: the link must be a plain <a href> with a full page load (no @docusaurus/Link, no data-v4-spa SPA navigation, or the router 404s). Give NavItem a flag (e.g. `plain: true`, "a static file outside the SPA") and honor it everywhere MORE_NAV is drawn: site/components/v4/V4Link.tsx (and V4Header.tsx that passes it), site/components/v4/rowTransforms.ts linkHtml() (homepage hero's More menu), and NAVBAR_ITEMS in docusaurus.config.ts (`href`, same tab). Small change, surrounding code's style.
* Check on / , /about, a docs page's phone drawer, and the mobile menu: entry shows above Articles and opens guide 0.


====================================================================
  STAGE 3: ONE AGENT PER GUIDE (guides 1 through 9, in parallel)
====================================================================

* Start one agent per guide 1-9 at once (Agent tool, one message). If agents are unavailable, do the guides one at a time, in order.
* Each brief: this prompt file path, its guide number, and:
  * Read this prompt in full including Appendix A. Obey every HARD RULE. Never write a CLAUDE.md, never tell anything you start to write one.
  * Set your row [IN-PR] in STATUS_FILE (read fresh, write right after).
  * Work only in {GUIDES_DIR}/{your folder}/. Use {SHARED_KIT_DIR} unchanged; if it truly lacks something, add it in your folder and say so (other agents use the kit).
  * Trace your path (A.5 gives start, end, where to look). Read PM specs, mock code and production code for every screen. List the screens in order: what the filmmaker sees, the decision, the exact control to move on, where it goes.
  * One step = one page = page_N.html (page_1.html first). Aim for 4-8 steps; merge screens with no decision, split a screen with two decisions.
  * Per step pick the screenshot (A.3) and copy it into img/.
  * Write each page per A.2 layout and A.6 writing rules, with your guide's full rail, current step selected.
  * Motion where it teaches (A.7); editor steps use {SHARED_KIT_DIR}/editor_anim/.
  * Continue above AND below the screenshot opens the next step (rail selection moves down one); on the LAST step Continue returns to guide 0. The last page may also carry a Get Started button in its detail section.
  * Run the STAGE 4 checks on your pages, then set [ DONE], fill Pages and Notes.
  * Final message: page list with one-line summaries, product disagreements, screens with no usable screenshot, anything added outside the kit.


====================================================================
  STAGE 4: VERIFY EVERYTHING (lead session, after all agents finish)
====================================================================

* In {SITE_REPO_DIR}: `pnpm build` must pass. Then `pnpm serve` (or `pnpm start`) and open every page under PREVIEW_URL_BASE in a real browser.
* Every page:
  * No console errors, no 404 for any image, script, style or font.
  * Every link works: TOC buttons, back chevron, rail, both Continue buttons (last step's → guide 0), Back, header, footer, the More menu entry. A small link-walker script in the scratchpad is fine.
  * Layout at 1440, 1024 and 390 px: rail <=20 percent on desktop, no horizontal scroll on a phone, screenshot full width of the right area unless too tall (A.2).
  * A.6: at most three goal sentences of at most 18 words each (count them; a script is fine).
  * Animations start on view, stop off view, off under prefers-reduced-motion.
  * Looks close enough to the homepage to sit beside it.
* Screenshot guide 0 and page_1 of each walkthrough (desktop) into the scratchpad and look at every one.
* Fix what fails, inside the guide folder when it belongs there.
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".
* Output to stdout "  STEP GUIDES: all guides built and verified."
* Output to stdout "==-+--====-+--====-+--====-+--====-+--====-+--====-+--==".


====================================================================
  STAGE 5: REPORT
====================================================================

* REPORT_FILE: summary on top (built/changed), then per guide its page list, then details. Up to five URLs Bryan will most want (guide 0 and the most changed pages), as PREVIEW_URL_BASE and LIVE_URL_BASE links (live after the next push to main).
* List every product disagreement (spec vs code vs screenshot), every missing screenshot, and suggested navigation changes (where the site should link to guide 0).
* End with "CLAUDE.md suggestions" if any CLAUDE.md went stale. Don't commit; tell Bryan the guides are ready to review and commit.




====================================================================
  APPENDIX A: BACKGROUND, LAYOUT, AND THE CONTENT PLAN
====================================================================

A.0  WHAT THESE PAGES ARE FOR
------------------------------
* ACT 3 AI is an AI filmmaking web app: script, then cinematography, then video. Beats, Acts, Scenes, Shots mean what they mean to a screenwriter and cinematographer. Think like a cinematographer describing a shot, first frame or storyboard.
* A new filmmaker doesn't know where to start. The guides show what to do next, what to look for, what to click, and why.
* Marketing-quality pages: make the product look as good as the homepage while staying calm enough to learn from. No animation that distracts from the instruction.
* Static HTML under /step_guides/ on the Docusaurus marketing site ({SITE_REPO_DIR}, act3ai.com), for full control of graphics and motion. Path pattern ./step_guides/{number}_{name}/page_{N}.html, page_1.html first.

A.1  GUIDE 0: THE STEP-BY-STEP GUIDE (table of contents)
---------------------------------------------------------
* Title "Step-by-Step Guide", one short line under it saying what the guides are.
* A vertical list of rows, one per guide 1-9 in order. Each: a PRIMARY BUTTON on the left (same yellow primary as the walkthrough Continue, A.2 item 2b: yellow fill, white text, the THE_GUIDES short label, right arrow on its right side) and up to 12 words of description to its right.
  * All buttons the same width so descriptions line up. Clicking the button (or row) opens that guide's page_1.html.
* No rail. A little marketing polish (soft background graphic, hover lift) is fine, but it is a menu first.
* Phone: description wraps under its button.

A.2  THE WALKTHROUGH PAGE LAYOUT (guides 1-9, every page)
------------------------------------------------------------------
Two columns.

LEFT: THE STEP RAIL (<=20 percent of width; sticky on desktop)
* Top, small text: the guide, e.g. "#2 Import a Script", with a LEFT-FACING CHEVRON on its left; clicking goes to guide 0.
* Under it, bigger: the current step's name.
* Then the numbered step list (1, 2, 3 ...). Labels succinct: at most three lines tall, ideally one or two. Current step: primary-color fill, white text; others quiet. Clicking a step opens its page.

RIGHT: THE WIDE AREA, top to bottom
1. Step title (large).
2. Up to THREE sentences: the goal, what to look for, what to click or do to move forward (A.6).
2b. CONTINUE button, right-aligned, between the sentences and the screenshot.
   * Primary button: site yellow fill (--v4t-yellow #eebc3c, hover --v4t-yellow-hi), white text "Continue", right-facing chevron on its right.
   * Keep white text readable: bold, plus a soft dark text shadow or slightly deeper gold toward the bottom. Never swap to dark text.
   * Opens page_{N+1}.html (rail selection moves down one); on the last step opens guide 0.
3. The SCREENSHOT of what the reader sees in this step, full width of the right area (narrower only if otherwise the sentences and image top don't fit together on a laptop screen). Thin rim and shadow (like the homepage editor row). A callout (ring, arrow, pulse) may point at the control.
3b. Second CONTINUE, right-aligned, directly under the screenshot (identical to 2b).
4. MORE DETAIL under it: what this page is, what to focus on, why the reader goes where they go next. If there's a decision, name it, give the options, say which to pick when. Short on top, more detail below, always very clear.
5. Bottom: quiet "Back" text link to the previous step on the left (step 1's Back → guide 0); Continue once more on the right only if the detail section is long.

Every rail step has its own page (page_1.html, page_2.html ... in order).

PHONE WIDTH
* Rail collapses to the top: chevron crumb, current step name, step list as a compact horizontal strip (or a "Step 3 of 6" control that opens it). Right column full width. 16 px side gutters, no horizontal page scroll.

A.3  SCREENSHOTS: WHERE THEY COME FROM AND HOW TO PICK
-------------------------------------------------------
* Source: {KEY_PAGES_DIR}. Map the screen to its folder with pages.csv, use its highest numbered version folder.
* In a version folder prefer: claude_design_dark.jpg, nb_pro_dark.jpg, then light versions (site is dark). *_full.jpg is the whole scrolling page; use only when the step is about something far down.
* in/ holds captures of the shipping product: use when no designed version exists or the step is about something only the shipping page shows.
* If the page's .mdx spec has a "Reference images" table, read it (says what each file really shows; some are misnamed). Never rename a file there.
* No image fits: render the matching Claude Design HTML with {MOCK_CODE_DIR}/render-html-jpeg.mjs, or screenshot the running mock; record which in Notes.
* Copy into the guide's img/ with a descriptive name (step_3_upload_script.jpg), compressed (HARD RULES). Meaningful alt text.

A.4  WHICH SOURCE WINS (code vs spec vs screenshot)
-----------------------------------------------------------------------------
* Production code ({PRODUCTION_CODE_DIR}) = what users see today.
* PM specs ({PM_MOCK_DIR}) and mock code ({MOCK_CODE_DIR}) = the next-generation design; best for what each page does and page order.
* Key-page screenshots = mostly next-generation designs.
* The guides teach the PM-spec flow, shown with key-page images (the product the site sells). Where production differs today, keep the words true for both if you can (name the goal, not a pixel) and list the gap in REPORT_FILE.

A.5  THE PATHS (start, end, and where to look)
-----------------------------------------------------
Starting points only; each agent confirms against code and specs and may merge, split or rename steps.

GUIDE 1: Create your account, then start a new project
* Path: act3ai.com Get Started, create account (or sign in), plan/credits screen if shown, Home, Start Creating ("Create New Project"), first wizard page (Starting Info: name the film, frame shape, type, organization).
* Look in: {KEY_PAGES_DIR}/create_account, signin, pay, home, new_project/starting_info; {PM_MOCK_DIR}/create_account, signin, home, new_project; production sign-up and home routes.
* Ends on Starting Info, pointing to guides 2, 3, 4 (the three ways to get a script).

GUIDE 2: Create a new project by importing a script
* Path: NEW_PROJECT_FLOW_FILE §1. Home, Starting Info, Script Create or Upload (Option 1 "Import Script"), Upload Script (Final Draft or PDF), Progress Script Import (beats, scenes, shots appear), Visual Options, Render Style, Plot (treatment), Character Overview, Character List, Character looks (Create Character Sheets or Upload Photos), character progress, Storyboards for the full film, storyboard progress, Film Build progress, the Editor.
* Look in: {KEY_PAGES_DIR}/new_project/*, {PM_MOCK_DIR}/new_project/*, {MOCK_CODE_DIR}/new_project/wizard_kit/wizardKit.tsx.
* Group the 14 wizard screens into readable steps (e.g. Name your film · Import the script · Watch it break down · Pick the look · Meet your cast · Storyboards and build · Open the editor).
* Motion: the editor row's Final Draft import (sheet slides up, sparkles flow into the script pane, pane flashes).

GUIDE 3: Create a new project with an empty script
* Path: NEW_PROJECT_FLOW_FILE §5. Option 2 "Start with Empty Script", the steps §5 lists, then the Editor with an empty script and how to start writing in the script pane or with the AI chat.
* Look in: guide 2's folders plus {KEY_PAGES_DIR}/script and {PM_MOCK_DIR}/script.

GUIDE 4: Create a new project with the AI Screenwriter writing your script
* Path: NEW_PROJECT_FLOW_FILE §8 and NEW_PROJECT_SPEC_FILE §3-§4 (they win). The AI Screenwriter option and its pages (idea, video type, duration, acts, beats, credit approval, script-writing progress), back into the wizard at Visual Options, then the Editor.
* Look in: {KEY_PAGES_DIR}/screenwriter_ai/*, {PM_MOCK_DIR}/screenwriter_ai/*, {MOCK_CODE_DIR}/screenwriter_ai, {KEY_PAGES_DIR}/story_arc/*.
* Explain Acts and Beats as a screenwriter would, one line each.

GUIDE 5: Getting the storyboard built
* STEP 1 IS FIXED (Bryan: "very, very critical"): from the Editor, pull down the View menu in the menu bar, choose Project Storyboard, screen transitions to the Storyboard. Animated: GuideAnim hl (View trigger), menu (the real View items in production order from act3ai-appclient MenuBarRadix.tsx), menuHover (Project Storyboard), click, then swap to GuideAnim.EDITOR.storyboard with fit "contain". All other steps follow it.
* Path: the wizard's Storyboards for the full film decision and progress wall, or from the Editor asking the chat "show me the storyboard", then the Storyboard page: read shot by shot, regenerate a frame you dislike, approve.
* Look in: {KEY_PAGES_DIR}/storyboarding/storyboard, new_project/storyboards_full_film, {PM_MOCK_DIR}/storyboarding, {PM_MOCK_DIR}/new_project/progress_storyboards, the editor row's storyboard demonstration point (its in/storyboard.jpg).
* Motion: editor animation typing "show me the storyboard" and switching views.

GUIDE 6: Improving a first frame
* Path: Editor, select a shot, open First Frame (Image Builder), improve prompt and references, generate, compare and pick, Return to Editor and see the new frame on the timeline.
* Look in: {KEY_PAGES_DIR}/editor, image_builder/first_frame, {PM_MOCK_DIR}/editor, {PM_MOCK_DIR}/image_builder/first_frame, {MOCK_CODE_DIR}/image_builder, {KEY_PAGES_DIR}/_stills (real first frames and takes, e.g. aberdeen_shot40_first_frame_v1.jpg).
* Explain why it matters: the first frame sets the composition, lighting and look the video shot starts from, so a better first frame means fewer video generations.

GUIDE 7: Build videos, improve the script, and move through the timeline
* Path: in the Editor, build the video for a shot (or scene), watch it render, review the take, ask the AI chat to change the script (a line, a set, an actor's action) and see the script pane update, move through the timeline (scenes, shots, from a 2-hour movie down to a few frames), play back.
* Look in: {KEY_PAGES_DIR}/editor, shot/*, script, project/*; {PM_MOCK_DIR}/editor (editor.mdx, timeline.mdx, video_play.mdx, menus.mdx), {PM_MOCK_DIR}/shot; {MOCK_CODE_DIR}/editor; production editor in {PRODUCTION_CODE_DIR}/p/editor and act3ai-appclient.
* Motion: the editor row's chat typing a change ("change the set to a Maui beach, she carries a surfboard"), pane flash, timeline scroll.

GUIDE 8: Add a new character from your photos
* Path from HOME: 1. click Characters (beside the current film). 2. Characters page (cast wall) opens. 3. Open one character and look at its character sheet. 4. Click create / add new character, upload photos (a headshot). 5. Let it render. 6. Show the five-view CHARACTER SHEET built from the headshot: shoulders-up headshot on the left beside full-body front, back, left, right views; show one character's view. 7. Click Edit: transition to the Image Builder for the character. 8. Make a change (e.g. new hairstyle), build, keep it.
* Animate: the Home click, upload, render, sheet appearing, Edit transition into the Image Builder.
* Look in: {KEY_PAGES_DIR}/home, characters/list_of_characters, characters/character_view_one, image_builder/character, new_project/character_image_upload; {PM_MOCK_DIR}/characters/*, {PM_MOCK_DIR}/image_builder/character, {PM_MOCK_DIR}/new_project/character_image_upload; production cast pages in act3ai-appclient (src/pages/v2/projects/[projectId]/cast/).

GUIDE 9: Add a new character and let ACT 3 AI generate the visuals
* Same start as guide 8 (Home, Characters, cast wall), but the character is described in words and ACT 3 AI generates the headshot and five-view sheet. Then review, and change it with Edit in the Image Builder if needed.
* Look in: guide 8's folders plus {KEY_PAGES_DIR}/new_project/character_prompt_to_build and new_project/character_overview.
* Guides 8 and 9 share first steps: keep those words and pictures identical.

A.6  WRITING RULES
-------------------
* Goal sentences under each title: <=3 sentences, <=18 words each, the more succinct the better. They say what to get done next, what to look for, what to click or do.
* Detail section may be longer but very clear: what the page is, what to focus on, the decision (if any) and how to make it, why you go where you go next.
* Real button and page names, exactly as on screen. Plain words, second person, no hype in instructions.
* Product name "ACT 3 AI". "Assistant Director Team", never "Level 2".
* Film terms (beat, scene, shot, act, first frame, take, storyboard) used as screenwriters and cinematographers use them.
* Rail labels: a few words, <=3 lines tall.

A.7  GRAPHICS AND MOTION
-------------------------
* Match the homepage: dark ground with faint rule lines, warm yellow accent, the rows' type families, framed screenshots. Copy the approved rows' visual language.
* Motion welcome where it teaches, especially in the editor (typing into chat, cursor to a button and click, pane flash on update, view switch, timeline scroll), via the shared editor_anim kit.
* Never pull the eye from the instruction: slow, short loops, nothing behind the goal sentences, off under prefers-reduced-motion, paused off screen. A plain screenshot with one callout is fine where no motion is needed.
* Tools: whatever made the homepage rows (hand-built HTML/CSS/JS, Claude Design HTML from the key pages, Claude Motion style). Pages load fast.

A.8  FILES AND URLS
--------------------
* {GUIDES_DIR}/index.html                       copy of guide 0
* {GUIDES_DIR}/0_step_by_step_guide/page_1.html  guide 0 (table of contents)
* {GUIDES_DIR}/_shared/                          guide.css, guide.js, editor_anim/, header/footer
* {GUIDES_DIR}/{n}_{name}/page_{N}.html           one page per step
* {GUIDES_DIR}/{n}_{name}/img/                    that guide's screenshots
* {GUIDES_DIR}/{n}_{name}/anim/                   that guide's animation scripts (if any)
* Live: https://act3ai.com/step_guides/{n}_{name}/page_{N}.html
* Relative links between guide pages (../2_import_script/page_1.html) so the same files work on localhost and act3ai.com.
* Each page: a real <title> ("Import a Script, Step 3 · ACT 3 AI"), a meta description, a canonical act3ai.com URL, the site favicon.
