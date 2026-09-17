const pages = [
  ["Home", "index.html"],
  ["Explore", "explore.html"],
  ["Support", "donos.html"],
  ["Launch", "launch.html"],
  ["Flow", "flow.html"],
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const pageTitles = {
  "index.html": "Home · TokPad",
  "explore.html": "Explore · TokPad",
  "donos.html": "Creator Support · TokPad",
  "launch.html": "Launch · TokPad",
  "flow.html": "Capital Flow · TokPad",
  "docs.html": "Docs · TokPad",
};
const textReplacements = [
  [/Launch a token\. Back the stream\./gi, "Launch a token. Back TikTok creators."],
  [/Back the stream\./gi, "Back TikTok creators."],
  [/^Donos$/gi, "Creator support"],
  [/What is dono\?/gi, "What is TokPad?"],
  [/Funding is the start\. Delivery is the dono\./gi, "Funding starts support. Delivery completes it."],
  [/Support a streamer/gi, "Support a TikTok creator"],
  [/Top streamers/gi, "Top TikTok creators"],
  [/Streamer payouts/gi, "TikTok creator payouts"],
  [/streamer being live/gi, "TikTok account being active"],
  [/is offline/gi, "has no recent TikTok activity"],
  [/@\s*twitch_username/gi, "@tiktok_creator"],
  [/twitch_username/gi, "tiktok_creator"],
  [/@your_streamer/gi, "@tiktok_creator"],
  [/@donotoyou/gi, "@tokpad"],
  [/@donodotyou/gi, "@tokpad"],
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
  [/\bdono\b/gi, "TokPad"],
  [/TikTok creator is live/gi, "TikTok creator is active"],
  [/TikTok TikTok creator/gi, "TikTok creator"],
  [/live-status/gi, "account activity"],
  [/\bchannel\b/gi, "TikTok account"],
  [/TikTok\s+TikTok/gi, "TikTok"],
];

function rewriteText(value) {
  return textReplacements.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    value,
  );
}

document.title = pageTitles[currentPage] || "TokPad";
const description = document.querySelector('meta[name="description"]');
if (description) {
  description.content = "Launch community tokens that turn creator fees into transparent support for TikTok creators.";
}

const youtubeCandidates = new Set(
  document.querySelectorAll(
    ".lv-platform-soon img, .hero-platform-soon img, .public-platform-soon img",
  ),
);

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
  brand.innerHTML = '<span class="project-logo" role="img" aria-label="TokPad logo">😊</span><span class="tiktok-brand-name">TokPad</span>';
}

for (const logo of document.querySelectorAll('img[alt="TokPad"]')) {
  const replacement = document.createElement("span");
  replacement.className = "tiktok-footer-logo";
  replacement.innerHTML = '<span class="project-logo" role="img" aria-label="TokPad logo">😊</span><span>TokPad</span>';
  logo.replaceWith(replacement);
}

for (const icon of [...document.querySelectorAll("img[alt]")].filter(
  (image) => image.alt.toLowerCase() === "tiktok",
)) {
  const originalSource = icon.getAttribute("src") || "";
  let context = icon.parentElement;
  for (let depth = 0; context && depth < 2 && !/coming soon/i.test(context.textContent); depth += 1) {
    context = context.parentElement;
  }
  const isYouTube = youtubeCandidates.has(icon) || (
    /kick\.svg/i.test(originalSource) && Boolean(context && /coming soon/i.test(context.textContent))
  );
  const platform = isYouTube ? "YouTube" : "TikTok";
  const replacement = document.createElement("img");
  replacement.className = "tiktok-platform-icon";
  replacement.src = isYouTube ? "assets/youtube-logo.png" : "assets/tiktok-logo.png";
  replacement.alt = platform;
  icon.replaceWith(replacement);

  if (isYouTube) {
    const platformText = document.createTreeWalker(context, NodeFilter.SHOW_TEXT);
    while (platformText.nextNode()) {
      platformText.currentNode.nodeValue = platformText.currentNode.nodeValue.replace(/TikTok/g, "YouTube");
    }
  }
}

for (const illustration of document.querySelectorAll(".hero-coin")) {
  const replacement = document.createElement("span");
  replacement.className = `${illustration.className} tiktok-floating-icon`;
  replacement.setAttribute("aria-hidden", "true");
  replacement.textContent = illustration.classList.contains("hero-coin-fees") ? "♥" : "♫";
  illustration.replaceWith(replacement);
}

for (const socialGroup of document.querySelectorAll(".social-links")) {
  const links = [...socialGroup.querySelectorAll("a")];
  links.slice(2).forEach((link) => link.remove());
  if (links[0]) {
    links[0].href = "https://x.com/tokpad";
    links[0].setAttribute("aria-label", "TokPad on X");
  }
  if (links[1]) {
    links[1].href = "https://www.tiktok.com/@tokpad";
    links[1].setAttribute("aria-label", "TokPad on TikTok");
  }
}

function initializeLaunchForm() {
  const form = document.querySelector(".lv-form");
  if (!form) return;

  const fields = [...form.querySelectorAll("input, textarea")];
  const fileInput = fields.find((field) => field.type === "file");
  const nameInput = fields.find((field) => field.placeholder === "TikTok Star");
  const tickerInput = fields.find((field) => field.placeholder === "TOK");
  const descriptionInput = fields.find((field) => field.tagName === "TEXTAREA");
  const xInput = fields.find((field) => field.type === "url");
  const creatorInput = fields.find((field) => field.placeholder === "tiktok_creator");
  const uploadButtons = form.querySelectorAll(".lv-upload, .lv-inline-action");
  const submitButton = form.querySelector('button[type="submit"]');
  const previewImage = document.querySelector(".lv-preview-cover img");
  const previewTitle = document.querySelector(".lv-preview-title");
  const previewStory = document.querySelector(".lv-preview-story");
  const beneficiary = document.querySelector(".lv-beneficiary");
  const formActions = submitButton?.parentElement;

  if (!fileInput || !nameInput || !tickerInput || !descriptionInput || !creatorInput || !submitButton) return;

  form.noValidate = true;

  const status = document.createElement("p");
  status.className = "tokpad-form-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  formActions?.prepend(status);

  for (const button of uploadButtons) {
    button.addEventListener("click", () => fileInput.click());
  }

  function setStatus(message, state = "info") {
    status.textContent = message;
    status.dataset.state = state;
  }

  function updatePreview() {
    const tokenName = nameInput.value.trim() || "Token name";
    const ticker = tickerInput.value.trim().replace(/^\$/, "").toUpperCase().slice(0, 10) || "TICKER";
    const creator = creatorInput.value.trim().replace(/^@/, "") || "tiktok_creator";
    const titleName = previewTitle?.querySelector("strong") || previewTitle?.firstElementChild;
    const titleTicker = previewTitle?.querySelector("span") || previewTitle?.lastElementChild;

    if (titleName) titleName.textContent = tokenName;
    if (titleTicker) titleTicker.textContent = `$${ticker}`;
    if (previewStory) {
      previewStory.textContent = descriptionInput.value.trim() || "Your token description will appear here.";
      previewStory.classList.toggle("is-placeholder", !descriptionInput.value.trim());
    }
    if (beneficiary) {
      const handle = beneficiary.querySelector("strong");
      if (handle) handle.textContent = `@${creator}`;
    }
  }

  function handleArtwork() {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      fileInput.value = "";
      setStatus("Choose a PNG, JPG or WebP image.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      fileInput.value = "";
      setStatus("Artwork must be no larger than 2 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (previewImage) {
        previewImage.src = reader.result;
        previewImage.alt = `${nameInput.value.trim() || "Token"} artwork preview`;
      }
      for (const button of uploadButtons) button.classList.add("has-artwork");
      setStatus("Artwork added.", "success");
    });
    reader.readAsDataURL(file);
  }

  for (const field of [nameInput, tickerInput, descriptionInput, creatorInput]) {
    field.addEventListener("input", updatePreview);
  }
  tickerInput.addEventListener("input", () => {
    tickerInput.value = tickerInput.value.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 10);
  });
  creatorInput.addEventListener("input", () => {
    creatorInput.value = creatorInput.value.replace(/^@/, "").replace(/[^a-z0-9_]/gi, "").slice(0, 25);
    updatePreview();
  });
  fileInput.addEventListener("change", handleArtwork);

  submitButton.disabled = false;
  submitButton.textContent = "Create token draft";
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = [];
    if (!fileInput.files?.[0]) missing.push("artwork");
    if (!nameInput.value.trim()) missing.push("token name");
    if (!tickerInput.value.trim()) missing.push("ticker");
    if (!creatorInput.value.trim()) missing.push("TikTok creator");
    if (missing.length) {
      setStatus(`Complete: ${missing.join(", ")}.`, "error");
      return;
    }

    if (nameInput.value.trim().length < 2 || tickerInput.value.trim().length < 2) {
      setStatus("Token name and ticker must contain at least 2 characters.", "error");
      return;
    }
    if (!/^[a-z0-9_]{3,25}$/i.test(creatorInput.value.trim())) {
      setStatus("Enter a valid TikTok username using letters, numbers or underscores.", "error");
      return;
    }
    if (xInput?.value.trim() && !/^https:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/.+/i.test(xInput.value.trim())) {
      setStatus("Enter a valid X profile link.", "error");
      return;
    }

    const draft = {
      name: nameInput.value.trim(),
      ticker: tickerInput.value.trim(),
      description: descriptionInput.value.trim(),
      xUrl: xInput?.value.trim() || "",
      creator: creatorInput.value.trim().replace(/^@/, ""),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("tokpad-token-draft", JSON.stringify(draft));
    submitButton.textContent = "Draft created";
    setStatus("Token draft saved in this browser. Connect the production wallet backend to submit it on-chain.", "success");
  });

  updatePreview();
}

initializeLaunchForm();

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