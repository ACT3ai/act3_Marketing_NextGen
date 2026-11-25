---
title: "Prompt: Summary by AI table"
slug: /training/p_table_training_calc
format: md
---


You will output the file: table_training.html
* The goal is to output an HTML table. It will generally be 50% of the width of a browser page. Design the content to be appropriate for that.
* Nothing underneath the table. Above the table there is exactly one short line: the Choose Your Model line (see the section "Line Above the Table: Choose Your Model"). Nothing else above it.
* Before you pick columns or write any cell, read Appendix A (Who the Customer Is and What They Need From This Table) and Appendix B (Honesty Rules: Never Say "No Training" When Some Training Can Happen) at the bottom of this file. Every column and every cell must answer the customer's question described there.
* The question this table answers is TRAINING: does anyone use what the filmmaker sends, or what is made for them, to train or improve AI models? It is NOT about who owns the output. Ownership has its own page and its own table (https://act3ai.com/docs/ownership_of_output). Do not bring ownership columns, ownership wording or ownership verdicts into this table.

===============================
Line Above the Table: Choose Your Model
===============================
* Put one short line directly above the table, inside table_training.html (above the table element, inside the same wrapper div). It is a reminder, not content: one brief sentence, no tooltip, no heading, small text so it does not push the table down.
* The visible wording: "For many features you choose the AI model, so you can avoid one whose training terms you don't accept." with "you choose the AI model" as the link.
* Link target: the AI Providers section of the ACT 3 AI Terms of Service: /docs/legal/terms-of-service#25-ai-providers-and-other-third-party-services (live: https://act3ai.com/docs/legal/terms-of-service#25-ai-providers-and-other-third-party-services). Section 2.5(d) there is "Your choice of AI Provider". If that section is renumbered or renamed, update the anchor here and in the HTML.
* Why it is there: the filmmaker's main lever over training is which model runs their work. Some steps (script analysis, chat, image description) use a model ACT 3 AI picks; the rows say which.
* Keep it one line at 50% page width. Do not add more sentences.

===============================
List of Columns
===============================
* We want the columns to be the most it'll fit. The last column is a little wider than most; keep the others narrow.
* From the second until the second from the last column, they are wide enough for 24 characters.
* Each cell is allowed to be two lines tall, but not more: about 24 characters on the first line and 24 on the second. Think about spaces. Choose the words carefully.
  * Every cell has a tooltip: hover anywhere in the cell (tap on a phone) and it shows a fuller explanation, with the section of the provider's document it comes from. Find the words that explain it best in the visible space; the tooltip carries the detail.
* Pick the columns 2 through second-to-last for this question. Think of it as an attorney advising a filmmaker who is about to send an unreleased script, the faces and voices of real actors, and footage to an AI filmmaking product. They need to know whether any company in the chain trains AI on that material, keeps it, or lets people look at it. Pick the columns they would want to see.
* Column headers: words a non-attorney filmmaker understands, that are also legally accurate; the best combination of the two.
* Act as an attorney who specialises in data protection, confidentiality and AI training terms for film, TV, audio and video productions, including actors' likeness and voice rights (for example union digital-replica rules) and studio confidentiality requirements for unreleased work.
* The columns used today (change them only if a better set answers the filmmaker's question):
  * "Trains on What You Send?": does the provider train or improve AI models on the inputs: your prompts, script text, reference pictures, faces, voice recordings, frames and footage that ACT 3 AI sends to run your request.
  * "Trains on What It Makes?": does it train on the outputs it generated for you (the video, picture, voice or text).
  * "Can Their Staff See It?": can people at the provider look at your material (for example safety or abuse review of flagged content).
  * "How Long They Keep It": how long the provider keeps what it was sent and made, and whether a zero-retention option exists and is in place for ACT 3 AI.
* Last Column: Title = "More". It gets the remainder of the space. It may wrap to two lines, not more; it truncates and the tooltip shows all of it. Put here what the filmmaker and their attorney need to know that the other columns did not show. Prioritise: most important first. Several short sentences, not a few long ones. Always include, when true: what ACT 3 AI has NOT proven (an opt-out not yet confirmed, a plan tier not confirmed), how to avoid this model (pick another model, or which feature uses it), and anything about real people's faces or voices.
* This prompt generates both what's visible and what you see on hover.

===============================
List of Rows
===============================
* Row 1 is always ACT 3 AI itself: what ACT 3 AI, Inc. does with your content. Answer from ACT 3 AI's Terms of Service Section 8 (AI Training) and Section 9 (Your Content) and its Privacy Policy, and from nothing else. The tooltip on the name names those sections.
* Then one row per AI system, in this order: most common first (the video, image and text models most films use), then the other text, image, video, voice and upscale models, then the hosting services (intermediaries) that pass your data to a model, then models ACT 3 AI runs on its own servers.
* Combine products of the same company into one row only when their training terms and ACT 3 AI's route to them are the same. When the route differs (for example a direct API versus through a hosting service, or a company API contract versus a staff member's own consumer subscription), the answer can differ: keep separate rows or say so in the cell.
* Include staff-only uses (for example a model only ACT 3 AI staff run on a project) and fallbacks (a model used only when another one declines a request). Your material still reaches them.

===============================
Row Headers
===============================

===============================
Column #1: Name
===============================
* 12 letters or less. Keep what's most recognisable.
* You can drop versions unless their training terms really differ.
* You can drop the company name, except where the product name alone is ambiguous (for example Grok text versus Grok Imagine). The tooltip carries the company, the full product names and what it does for you in ACT 3 AI.


===============================
Appendix A: Who the Customer Is and What They Need From This Table
===============================
* Take the customer's point of view. Every column choice, every visible cell and every tooltip answers the customer's real question (below), not some other question.

* Rule: ACT 3 AI's customers are NOT software companies reselling our API. It is easy to reason as if they build their own product on us; they do not. ACT 3 AI is the software company. Our customer uses our product interactively.
  * Restrictions in a provider's terms that bind ACT 3 AI as the API customer (business use only, no competing models, no reselling access) are not training answers. Leave them out unless they change whether the filmmaker's material is trained on.

* Who the customer is: an AI filmmaker using ACT 3 AI, our AI filmmaking software.
  * They write or import a script, upload pictures of actors, sets and props, record or clone voices, and generate first frames, shot videos, voices and edits.
  * Much of that material is sensitive: an unreleased script, the faces and voices of real actors (often under contract or union rules), a studio's footage.
  * What they want to know: does ACT 3 AI train AI on my material? Does any AI company that ACT 3 AI sends it to train on it, keep it, or look at it? Can I avoid the ones that do?

* The common scenarios:
  * A studio, streamer or financier asks: "Was our unreleased script or footage used to train anyone's AI?" The filmmaker needs a clear answer per model.
  * An actor (or their agent, or their union) asks: "Will my face or voice be used to train an AI model?" Voice and face are the most sensitive inputs.
  * The filmmaker wants to pick models for a confidential project so nothing is trained on.

* The chain to reason about, for every row:
  * The filmmaker -> ACT 3 AI (does not train on Your Content: Terms of Service Section 8) -> sometimes a hosting service (fal.ai, Atlas Cloud) -> the model's company.
  * The answer for a row is the answer for the WHOLE route ACT 3 AI actually uses. If the model's company does not train but the hosting service's terms, or the hosting service's own account with the model company, are not published, the row is not "No": say what is unknown.
  * The answer depends on ACT 3 AI's account: its plan tier (free versus paid, consumer versus business), and whether ACT 3 AI has turned off an opt-out setting. Say which tier the answer assumes, and whether ACT 3 AI's setting is confirmed.

* How the table must answer:
  * Write every cell from the filmmaker's seat, about their script, pictures, faces, voices and footage.
  * When a provider's terms cannot be read or verified, say so plainly ("Not published", "Unknown"). Never guess an answer to the training question.

===============================
Appendix B: Honesty Rules: Never Say "No Training" When Some Training Can Happen
===============================
* The worst error this table can make is to tell a filmmaker "No" when some training can happen. Be transparent. Say "No" only when the provider's current terms say it does not train on that data for the route and plan ACT 3 AI uses, with no exception that applies.
* Words to use, from safest to least safe for the filmmaker:
  * "No" only as above. Add the condition when there is one ("No (paid plan)").
  * "Only if opted in" when the terms say training needs the customer's explicit opt-in. Add whether ACT 3 AI has opted in (it should not have).
  * "Yes, unless opted out" when training is the default and an opt-out exists. Say whether ACT 3 AI's opt-out is CONFIRMED. If it is not confirmed, the visible cell says "Yes, unless opted out" and More says the opt-out is not yet confirmed. Never write "No" because an opt-out exists.
  * "Yes" when the terms allow training and there is no opt-out for this route.
  * "Depends on plan" when the answer changes with the tier, and say which tier ACT 3 AI uses if known.
  * "Unknown" or "Not published" when the terms are silent, cannot be read, or the route's account is not published.
* Exceptions count. If the terms say "we do not train, except on content flagged for safety review" or "except feedback you send us", the cell says "No, with exceptions" and the tooltip gives the exception.
* "Kept" and "seen by staff" are not training, but they are what an actor or a studio asks next. Answer them in their own columns; do not soften a "Yes" there.
* ACT 3 AI's own row says exactly what ACT 3 AI's Terms of Service promise (Section 8.1: we do not use Your Content to train, fine-tune or evaluate any AI model, ours or anyone else's; Section 8.2: aggregated or de-identified service usage data, not the creative substance, may be used to operate and improve the Service; Section 8.4: any future training program is opt-in). It must not promise more than those sections.
* ACT 3 AI's promise does not cover what an AI provider does with material ACT 3 AI sends it to run your request (Terms Section 8.3 and 9.4). Never let the ACT 3 AI row read as a promise about the providers.
* Do not use colour, ticks or crosses to suggest safety. Plain words.
