
You will output the file: table_ownership.html
* The goal is to output an HTML table. It will generally be 50% of the width of a browser page. Design the content to be appropriate for that. 
* Don't have anything above the table and nothing underneath the table. 
* Before you pick columns or write any cell, read Appendix A (Who the Customer Is and What They Need From This Table) at the bottom of this file. Every column and every cell must answer the customer's question described there.

===============================
List of Columns
===============================
* We want the columns to be the most it'll fit. We'll have a description called the last. It's a little bit wider than most, but try to keep them narrow. 
* From the second until the second from the last column, we want them to be wide enough for 24 characters. 
* Each row is allowed to be two rows tall, but not more. When I said 24 characters wide, it may well have 24 characters on the first row, then 24 characters on the second row. Think spaces. You'll want to be smart about the words you put in there.
  * We'll have it so that when you hover over the tires anywhere in the cell, or over anything in that cell, we'll be able to have a tooltip. That explains a lot more, but try to find the words that best explain it in that space. 
* Pick the column values for numbers 2 through the second-to-last. Think of it as an attorney advising somebody trying to make a movie or use the output of our product for TV. They need to make sure they have ownership of the output of what we do and can understand what they do get and what they don't get. Pick the columns based on what they would want to see. 
* We want the column headers to be ones that a non-attorney customer can best understand, that are also best to be legally accurate, and the best combination between the two. 
* Act as an attorney around intellectual property ownership, specializing in ownership for audio, movies, TV, video, and content, especially in being able to buy and sell assets and verify their ownership. 
* Last Column: Title = "More". this will get the remainder of the space. It can again get wrapped into two rows, but not more. It'll truncate. Whatever we want to get information in here that the customer and the attorney will want to know and see that wasn't visible in the other columns. If they were covered in the other columns well enough, they become low priority or less needed in this column. Things that weren't clear or visible in the other columns should be shown here. The more important they are to the customer and their attorney, the higher the priority. Prioritize them. You make this into a number of sentences. At a certain point, this will get truncated, and the user will be able to see the full amount when they hover over it. By prioritizing the more important things and the concepts they should learn before other concepts, put the more important things earlier in this series of sentences. Try to communicate the information, but be succinct. We want them to see more sentences, not less, with earlier sentences being too verbose. 
* Every cell will have a tooltip when you hot hover. For the first column, they can see the company name and the fuller versions. If multiple products are combined into one (let's say Nana Banana Pro and Nana Banana Two), the hot hover tooltip text can communicate that. 
* This prompt is generating the output: both what's visible and then what you hot-hover over. 



===============================
List of Rows
===============================


===============================
Row Headers
===============================

===============================
Column #1: Name
===============================
* When it comes to the video, we want to use 12 letters or less. Keep what's most recognizable. 
* You can drop versions unless they really are different. Unless Nana
  Banana Pro versus Nana Banana Two really have different legal terms when they're from the same company, you can have them in a single row.
  *   You can drop the company name, except for Imagine. That's used in different places. We need to keep the company name in there. You're trying to find the 12 letters






===============================
Appendix A: Who the Customer Is and What They Need From This Table
===============================
* It is important to take into account, from the point of view of the customer, what they need in the output of this table. Every column choice, every visible cell and every tooltip must be written to answer the customer's real question (below), not some other question.

* Rule: It's easy to get the reasoning and the writing wrong by thinking that the customers of ACT 3 AI are making software products: using our APIs, building their own product, and selling it to other people who call through them to us to generate videos. They are NOT doing that.
  * Earlier write-ups made exactly this mistake. They said things like "Our customers are allowed to use it for business, not consumer." That sentence treats our customers as software companies selling access to businesses or consumers. It is the wrong frame.
  * It is very easy to think ACT 3 AI customers use us as an API to generate videos and resell that as a service. That is not the goal.
  * The correct frame: ACT 3 AI is the software company. Our customer uses our product interactively, as a customer. They are not a business selling access to their own software.

* Who the customer is: an AI filmmaker using ACT 3 AI, our AI filmmaking software.
  * They create a movie, a video or a TV show with our software.
  * They download that movie, plus its first frames and images, and possibly the audio of what was spoken.
  * What they want to know: do they own that video, movie, script, images and audio that we created for them, that they made as an AI filmmaker using our software? Are they able to own it?

* The common scenario: the customer wants to sell their movie to Netflix (or another studio, streamer, broadcaster or distributor).
  * Netflix wants to know that the customer owns the video, the audio and the images inside that movie.
  * Netflix needs to be able to buy it without somebody else owning the video track, the audio track or the images.

* What the customer needs to read from this table: do they get to own the video, the audio and the images that they paid to get generated, and can they sell the finished film? We answer that from each provider's terms of service.

* The chain to reason about, for every row (example: Google Omni; also e.g. Seedance from ByteDance / BytePlus):
  * The provider (e.g. Google) -> ACT 3 AI, the provider's direct customer and a software company -> our customer, the filmmaker, who used ACT 3 AI and downloads the video they generated.
  * The video was generated first by the provider's model. ACT 3 AI made that happen: we built the prompts, did a lot of other work and supplied input content.
  * Do the provider's terms, with ACT 3 AI as their direct customer, let OUR customer own their movie, sell it to Netflix and say that they own it? Does the license (e.g. Google Omni's) allow that or not?
  * Restrictions in a provider's terms that are about how ACT 3 AI, the API customer, runs its software (e.g. "for business purposes, not consumer use", "no building competing models", "no reselling API access") are about ACT 3 AI. Do not present them to the filmmaker as limits on owning or selling their film. Mention them only where they actually change whether the filmmaker can own or sell the output.

* How the table must answer:
  * Columns 2 through second-to-last should be the questions this filmmaker (and their entertainment attorney, and Netflix's clearance team) actually ask: Do I own it? Can I sell or license the finished film? Does the provider, or anyone else, keep rights in it? Who stands behind it if someone claims infringement?
  * Write every cell in that kind of way: answer from the filmmaker's seat, about their downloaded video, audio and images, and about selling the film.
  * When a provider's terms cannot be read or verified, say so plainly. Never guess an answer to the ownership question.
