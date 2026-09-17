const pages = [
  ["Home", "index.html"],
  ["Explore", "explore.html"],
  ["Support", "donos.html"],
  ["Launch", "launch.html"],
  ["Flow", "flow.html"],
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const pageTitles = {
  "index.html": "Home · TikTok Creator Launchpad",
  "explore.html": "Explore · TikTok Creator Launchpad",
  "donos.html": "Creator Support · TikTok Creator Launchpad",
  "launch.html": "Launch · TikTok Creator Launchpad",
  "flow.html": "Capital Flow · TikTok Creator Launchpad",
  "docs.html": "Docs · TikTok Creator Launchpad",
};
const textReplacements = [
  [/Launch a token\. Back the stream\./gi, "Launch a token. Back TikTok creators."],
  [/Back the stream\./gi, "Back TikTok creators."],
  [/^Donos$/gi, "Creator support"],
  [/What is dono\?/gi, "What is TikTok Creator Launchpad?"],
  [/Funding is the start\. Delivery is the dono\./gi, "Funding starts support. Delivery completes it."],
  [/Support a streamer/gi, "Support a TikTok creator"],
  [/Top streamers/gi, "Top TikTok creators"],
  [/Streamer payouts/gi, "TikTok creator payouts"],
  [/streamer being live/gi, "TikTok account being active"],
  [/is offline/gi, "has no recent TikTok activity"],
  [/@\s*twitch_username/gi, "@tiktok_creator"],
  [/twitch_username/gi, "tiktok_creator"],
  [/@your_streamer/gi, "@tiktok_creator"],
  [/@donotoyou/gi, "@toklaunch"],
  [/Chat Cat/gi, "TikTok Star"],
  [/^CHAT$/gi, "TOK"],
  [/\bchat\b/gi, "comments and likes"],
  [/gifted subs/gi, "creator rewards"],
  [/gift sub/gi, "creator reward"],
  [/\bTwitch\b/gi, "TikTok"],
  [/\bKick\b/gi, "TikTok"],
  [/\blivestreamers\b/gi, "TikTok creators"],
  [/\blivestreamer\b/gi, "TikTok creator"],
  [/\blivestreams\b/gi, "TikTok videos"],
  [/\blivestream\b/gi, "TikTok video"],
  [/\bstreamers\b/gi, "TikTok creators"],
  [/\bstreamer\b/gi, "TikTok creator"],
  [/\bstreaming\b/gi, "TikTok creation"],
  [/\bstreams\b/gi, "TikTok videos"],
  [/\bstream\b/gi, "TikTok video"],
  [/\bdonations\b/gi, "creator support"],
  [/\bdonation\b/gi, "creator support"],
  [/\bgifts\b/gi, "creator support"],
  [/\bgift\b/gi, "support"],
  [/\bdono['’]d\b/gi, "supported"],
  [/\bdonos\b/gi, "creator support"],
  [/\bdono\b/gi, "TikTok Launchpad"],
  [/TikTok creator is live/gi, "TikTok creator is active"],
  [/live-status/gi, "account activity"],
  [/\bchannel\b/gi, "TikTok account"],
];

function rewriteText(value) {
  return textReplacements.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  );
}

document.title = pageTitles[currentPage] || "TikTok Creator Launchpad";
const description = document.querySelector('meta[name="description"]');
if (description) {
  description.content = "Launch community tokens that turn creator fees into transparent support for TikTok creators.";
}

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (walker.nextNode()) textNodes.push(walker.currentNode);
for (const node of textNodes) {
  if (!node.parentElement?.closest("script, style")) node.nodeValue = rewriteText(node.nodeValue);
}

for (const element of document.querySelectorAll("[aria-label], [alt], [title], [placeholder]")) {
  for (const attribute of ["aria-label", "alt", "title", "placeholder"]) {
    if (element.hasAttribute(attribute)) {
      element.setAttribute(attribute, rewriteText(element.getAttribute(attribute)));
    }
  }
}

for (const link of document.querySelectorAll('a[href*="twitch.tv/"]')) {
  const username = new URL(link.href).pathname.split("/").filter(Boolean)[0];
  if (username) link.href = `https://www.tiktok.com/@${username}`;
}

for (const brand of document.querySelectorAll(".brand")) {
  brand.innerHTML = '<span class="tiktok-logo" aria-hidden="true">t</span><span class="tiktok-brand-name">TOKLAUNCH</span>';
}

for (const logo of document.querySelectorAll('img[alt="TikTok Launchpad"]')) {
  const replacement = document.createElement("span");
  replacement.className = "tiktok-footer-logo";
  replacement.innerHTML = '<span class="tiktok-logo" aria-hidden="true">t</span><span>TOKLAUNCH</span>';
  logo.replaceWith(replacement);
}

for (const icon of document.querySelectorAll('img[alt="TikTok"]')) {
  const replacement = document.createElement("span");
  replacement.className = "tiktok-platform-icon";
  replacement.setAttribute("aria-label", "TikTok");
  replacement.textContent = "t";
  icon.replaceWith(replacement);
}

for (const illustration of document.querySelectorAll(".hero-coin")) {
  const replacement = document.createElement("span");
  replacement.className = `${illustration.className} tiktok-floating-icon`;
  replacement.setAttribute("aria-hidden", "true");
  replacement.textContent = illustration.classList.contains("hero-coin-fees") ? "♥" : "♫";
  illustration.replaceWith(replacement);
}

const navigation = document.createElement("nav");
navigation.className = "static-mobile-nav";
navigation.setAttribute("aria-label", "Mobile navigation");

for (const [label, href] of pages) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  link.dataset.icon = label;
  if (href === currentPage) link.setAttribute("aria-current", "page");
  navigation.append(link);
}

document.body.append(navigation);