const pages = [
  ["Home", "index.html", "Home"],
  ["Explore", "explore.html", "Explore"],
  ["Support", "donos.html", "Creator support"],
  ["Launch", "launch.html", "Launch"],
  ["Flow", "flow.html", "Capital flow"],
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const pageTitles = {
  "index.html": "Home · Trendify",
  "explore.html": "Explore · Trendify",
  "donos.html": "Creator Support · Trendify",
  "launch.html": "Launch · Trendify",
  "flow.html": "Capital Flow · Trendify",
  "docs.html": "Docs · Trendify",
};
const textReplacements = [
  [/Launch a token\. Back the stream\./gi, "Launch a token. Back TikTok creators."],
  [/Back the stream\./gi, "Back TikTok creators."],
  [/^Donos$/gi, "Creator support"],
  [/What is dono\?/gi, "What is Trendify?"],
  [/Funding is the start\. Delivery is the dono\./gi, "Funding starts support. Delivery completes it."],
  [/Support a streamer/gi, "Support a TikTok creator"],
  [/Top streamers/gi, "Top TikTok creators"],
  [/Streamer payouts/gi, "TikTok creator payouts"],
  [/streamer being live/gi, "TikTok account being active"],
  [/is offline/gi, "has no recent TikTok activity"],
  [/@\s*twitch_username/gi, "@tiktok_creator"],
  [/twitch_username/gi, "tiktok_creator"],
  [/@your_streamer/gi, "@tiktok_creator"],
  [/@donotoyou/gi, "@trendify"],
  [/@donodotyou/gi, "@trendify"],
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
  [/\bdono\b/gi, "Trendify"],
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

document.title = pageTitles[currentPage] || "Trendify";
const description = document.querySelector('meta[name="description"]');
if (description) {
  description.content = "Trendify launches community tokens that turn creator fees into transparent support for TikTok creators.";
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
  brand.innerHTML = brand.closest(".sidebar-account")
    ? '<img class="trendify-wordmark" src="assets/trendify-wordmark.jpg" alt="Trendify">'
    : '<img class="project-logo" src="assets/trendify-mark.jpg" alt="Trendify logo"><span class="tiktok-brand-name">Trendify</span>';
}

for (const logo of document.querySelectorAll('img[alt="Trendify"]')) {
  if (logo.closest(".sidebar-bottom")) {
    const replacement = document.createElement("span");
    replacement.className = "tiktok-footer-logo";
    replacement.innerHTML = '<img class="trendify-wordmark" src="assets/trendify-wordmark.jpg" alt="Trendify">';
    logo.replaceWith(replacement);
  } else {
    const replacement = document.createElement("img");
    replacement.className = "project-logo";
    replacement.src = "assets/trendify-mark.jpg";
    replacement.alt = "Trendify logo";
    logo.replaceWith(replacement);
  }
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
    links[0].href = "https://x.com/trendify";
    links[0].setAttribute("aria-label", "Trendify on X");
  }
  if (links[1]) {
    links[1].href = "https://www.tiktok.com/@trendify";
    links[1].setAttribute("aria-label", "Trendify on TikTok");
  }
}

for (const accountLink of document.querySelectorAll(".sidebar-account")) {
  accountLink.href = "https://x.com/trendify";
  accountLink.setAttribute("aria-label", "Trendify on X");
}

function initializeWalletConnector() {
  const walletTriggers = [...document.querySelectorAll("button")].filter(
    (button) => button.matches(".wallet-button") || /connect wallet/i.test(button.textContent),
  );
  if (!walletTriggers.length) return;

  const modal = document.createElement("div");
  modal.className = "wallet-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="wallet-modal-backdrop" data-wallet-close></div>
    <section class="wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title">
      <button class="wallet-dialog-close" type="button" aria-label="Close wallet dialog" data-wallet-close>×</button>
      <img class="project-logo" src="assets/trendify-mark.jpg" alt="Trendify logo">
      <h2 id="wallet-dialog-title">Connect wallet</h2>
      <p>Choose a wallet to continue with Trendify.</p>
      <div class="wallet-options">
        <button class="wallet-option" type="button" data-wallet="metamask">
          <img class="wallet-option-icon" src="assets/metamask-logo.svg" alt="" aria-hidden="true">
          <span><strong>MetaMask</strong><small>Ethereum wallet</small></span>
          <span aria-hidden="true">›</span>
        </button>
        <button class="wallet-option" type="button" data-wallet="phantom">
          <img class="wallet-option-icon" src="assets/phantom-logo.svg" alt="" aria-hidden="true">
          <span><strong>Phantom</strong><small>Solana wallet</small></span>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <p class="wallet-dialog-status" role="status" aria-live="polite"></p>
    </section>
  `;
  document.body.append(modal);

  const dialog = modal.querySelector(".wallet-dialog");
  const status = modal.querySelector(".wallet-dialog-status");
  const metaMaskOption = modal.querySelector('[data-wallet="metamask"]');
  const phantomOption = modal.querySelector('[data-wallet="phantom"]');
  let announcedMetaMask = null;
  let lastFocused = null;

  function getMetaMask() {
    const ethereum = window.ethereum;
    return announcedMetaMask
      || ethereum?.providers?.find((provider) => provider.isMetaMask)
      || (ethereum?.isMetaMask ? ethereum : null);
  }

  function getPhantom() {
    return window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null);
  }

  function refreshAvailability() {
    const metaMaskHint = metaMaskOption.querySelector("small");
    const phantomHint = phantomOption.querySelector("small");
    if (metaMaskHint) metaMaskHint.textContent = getMetaMask()
      ? "Extension detected · Ethereum"
      : "Not detected · Install extension";
    if (phantomHint) phantomHint.textContent = getPhantom()
      ? "Extension detected · Solana"
      : "Not detected · Install extension";
  }

  function shortenAddress(address) {
    return address.length > 12 ? `${address.slice(0, 6)}…${address.slice(-4)}` : address;
  }

  function updateWalletButtons(wallet, address) {
    const label = `${wallet} ${shortenAddress(address)}`;
    for (const trigger of walletTriggers) {
      const text = trigger.querySelector("span") || trigger;
      text.textContent = label;
      trigger.classList.add("is-connected");
      trigger.setAttribute("aria-label", `${wallet} wallet connected: ${address}`);
      trigger.disabled = false;
    }
  }

  function setStatus(message, state = "info") {
    status.textContent = message;
    status.dataset.state = state;
  }

  function setInstallStatus(wallet, url) {
    status.replaceChildren(
      `${wallet} is not available in this browser. Open Trendify in Chrome or Edge with the extension enabled. `,
    );
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `Install ${wallet}`;
    status.append(link);
    status.dataset.state = "error";
  }

  function openModal(event) {
    lastFocused = event.currentTarget;
    modal.hidden = false;
    document.body.classList.add("wallet-modal-open");
    setStatus("");
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    refreshAvailability();
    dialog.querySelector("[data-wallet]")?.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("wallet-modal-open");
    lastFocused?.focus();
  }

  async function connectMetaMask() {
    const provider = getMetaMask();
    if (!provider) {
      setInstallStatus("MetaMask", "https://metamask.io/download/");
      return;
    }
    try {
      setStatus("Confirm the request in MetaMask…");
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts?.[0]) throw new Error("No account returned");
      updateWalletButtons("MetaMask", accounts[0]);
      setStatus("MetaMask connected.", "success");
      window.setTimeout(closeModal, 500);
    } catch (error) {
      const message = error?.code === 4001
        ? "Connection request rejected."
        : error?.code === -32002
          ? "A MetaMask connection request is already open."
          : "Could not connect MetaMask. Check that the extension is unlocked and allowed on this site.";
      setStatus(message, "error");
    }
  }

  async function connectPhantom() {
    const provider = getPhantom();
    if (!provider) {
      setInstallStatus("Phantom", "https://phantom.com/download");
      return;
    }
    try {
      setStatus("Confirm the request in Phantom…");
      const response = await provider.connect();
      const address = response?.publicKey?.toString() || provider.publicKey?.toString();
      if (!address) throw new Error("No public key returned");
      updateWalletButtons("Phantom", address);
      setStatus("Phantom connected.", "success");
      window.setTimeout(closeModal, 500);
    } catch (error) {
      setStatus(
        error?.code === 4001
          ? "Connection request rejected."
          : "Could not connect Phantom. Check that the extension is unlocked and allowed on this site.",
        "error",
      );
    }
  }

  walletTriggers.forEach((trigger) => {
    trigger.disabled = false;
    trigger.addEventListener("click", openModal);
  });
  modal.querySelectorAll("[data-wallet-close]").forEach((button) => button.addEventListener("click", closeModal));
  modal.querySelector('[data-wallet="metamask"]').addEventListener("click", connectMetaMask);
  modal.querySelector('[data-wallet="phantom"]').addEventListener("click", connectPhantom);
  window.addEventListener("eip6963:announceProvider", (event) => {
    const detail = event.detail;
    if (detail?.provider?.isMetaMask || detail?.info?.rdns === "io.metamask") {
      announcedMetaMask = detail.provider;
      refreshAvailability();
    }
  });
  window.addEventListener("phantom#initialized", refreshAvailability);
  window.addEventListener("solana#initialized", refreshAvailability);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  const metaMask = getMetaMask();
  metaMask?.request({ method: "eth_accounts" }).then((accounts) => {
    if (accounts?.[0]) updateWalletButtons("MetaMask", accounts[0]);
  }).catch(() => {});
  const phantom = getPhantom();
  if (phantom?.isConnected && phantom.publicKey) updateWalletButtons("Phantom", phantom.publicKey.toString());
  window.dispatchEvent(new Event("eip6963:requestProvider"));
  refreshAvailability();
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
  status.className = "trendify-form-status";
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
    localStorage.setItem("trendify-token-draft", JSON.stringify(draft));
    submitButton.textContent = "Draft created";
    setStatus("Token draft saved in this browser. Connect the production wallet backend to submit it on-chain.", "success");
  });

  updatePreview();
}

initializeLaunchForm();
initializeWalletConnector();

const topTikTokCreators = [
  { name: "Khaby Lame", handle: "khaby.lame", ticker: "KHABY", followers: "162.8M", avatar: "khaby-lame.jpg" },
  { name: "Charli D'Amelio", handle: "charlidamelio", ticker: "CHARLI", followers: "159.3M", avatar: "charli-damelio.jpg" },
  { name: "MrBeast", handle: "mrbeast", ticker: "MRBEAST", followers: "140.1M", avatar: "mrbeast.jpg" },
  { name: "Bella Poarch", handle: "bellapoarch", ticker: "BELLA", followers: "91.7M", avatar: "bella-poarch.jpg" },
  { name: "Addison Rae", handle: "addisonre", ticker: "ADDISON", followers: "87.8M", avatar: "addison-rae.jpg" },
  { name: "Willie Salim", handle: "williesalim", ticker: "WILLIE", followers: "87M", avatar: "willie-salim.jpg" },
  { name: "Zach King", handle: "zachking", ticker: "ZACH", followers: "86.9M", avatar: "zach-king.jpg" },
  { name: "Kimberly Loaiza", handle: "kimberly.loaiza", ticker: "KIM", followers: "83.4M", avatar: "kimberly-loaiza.jpg" },
  { name: "BTS", handle: "bts_official_bighit", ticker: "BTS", followers: "80.8M", avatar: "bts.jpg" },
  { name: "Dwayne Johnson", handle: "therock", ticker: "ROCK", followers: "79.7M", avatar: "dwayne-johnson.jpg" },
  { name: "Will Smith", handle: "willsmith", ticker: "WILL", followers: "78.2M", avatar: "will-smith.jpg" },
  { name: "Domelipa", handle: "domelipa", ticker: "DOME", followers: "75.4M", avatar: "domelipa.jpg" },
  { name: "Billie Eilish", handle: "billieeilish", ticker: "BILLIE", followers: "74.9M", avatar: "billie-eilish.jpg" },
  { name: "Meicy Villia", handle: "vilmeijuga", ticker: "MEICY", followers: "73.7M", avatar: "meicy-villia.jpg" },
  { name: "CZN Burak", handle: "cznburak", ticker: "BURAK", followers: "73.5M", avatar: "czn-burak.jpg" },
  { name: "Lamine Yamal", handle: "lamine.yamal", ticker: "YAMAL", followers: "69.7M", avatar: "lamine-yamal.jpg" },
  { name: "Jason Derulo", handle: "jasonderulo", ticker: "DERULO", followers: "66.3M", avatar: "jason-derulo.jpg" },
  { name: "Kylie Jenner", handle: "kyliejenner", ticker: "KYLIE", followers: "59.7M", avatar: "kylie-jenner.jpg" },
  { name: "Aliev Omar", handle: "omari.to", ticker: "OMARI", followers: "59.5M", avatar: "aliev-omar.jpg" },
  { name: "Selena Gomez", handle: "selenagomez", ticker: "SELENA", followers: "58.6M", avatar: "selena-gomez.jpg" },
];

function initializeTopTikTokCreators() {
  const grid = document.querySelector(".explore-token-grid");
  const template = grid?.querySelector(".token-card");
  if (!grid || !template || grid.querySelector(".trendify-added-creator")) return;

  topTikTokCreators.forEach((creator, index) => {
    const card = template.cloneNode(true);
    const profileUrl = `https://www.tiktok.com/@${creator.handle}`;
    const avatarUrl = `assets/creators/${creator.avatar}`;
    card.classList.add("trendify-added-creator");
    card.dataset.creatorRank = String(index + 1);

    for (const link of card.querySelectorAll("a")) {
      link.href = profileUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.removeAttribute("data-discover");
    }

    const artLink = card.querySelector(".token-art-link");
    if (artLink) artLink.setAttribute("aria-label", `View ${creator.name} on TikTok`);

    const artwork = card.querySelector(".token-card-art .token-image");
    if (artwork) {
      artwork.src = avatarUrl;
      artwork.alt = `${creator.name} artwork`;
      artwork.loading = "lazy";
      artwork.dataset.imageState = "loaded";
    }

    const recipient = card.querySelector(".token-recipient-pill");
    const recipientName = recipient?.querySelector(":scope > span:last-child");
    const recipientAvatar = recipient?.querySelector(".avatar");
    if (recipientName) recipientName.textContent = creator.name;
    if (recipientAvatar) {
      recipientAvatar.src = avatarUrl;
      recipientAvatar.alt = `${creator.name} portrait`;
      recipientAvatar.dataset.imageState = "loaded";
    }

    const title = card.querySelector(".token-card-title");
    const titleName = title?.querySelector("h3");
    const titleTicker = title?.querySelector("span");
    if (titleName) titleName.textContent = creator.name;
    if (titleTicker) titleTicker.textContent = creator.ticker;

    const figureValues = card.querySelectorAll(".token-card-figures strong");
    figureValues.forEach((value) => { value.textContent = "$0"; });
    const figureGroups = card.querySelectorAll(".token-card-figures > span");
    if (figureGroups[0]) {
      figureGroups[0].title = "Trendify community token is not launched yet.";
      figureGroups[0].setAttribute("aria-label", "Market cap $0. Token not launched.");
    }

    const statusLines = card.querySelectorAll(".token-funding-wait");
    if (statusLines[0]) statusLines[0].textContent = `Global creator #${index + 1} · ${creator.followers} TikTok followers.`;
    if (statusLines[1]) statusLines[1].textContent = "Trendify community token ready to launch.";

    const contract = card.querySelector(".token-contract");
    const contractText = contract?.querySelector("span");
    if (contract) {
      contract.setAttribute("aria-label", `Copy @${creator.handle}`);
      contract.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(`@${creator.handle}`);
        if (contractText) contractText.textContent = "Copied";
      });
    }
    if (contractText) contractText.textContent = `@${creator.handle}`;

    grid.insertBefore(card, template);
  });

  const count = document.querySelector(".results-count");
  if (count) count.textContent = "Showing 44 of 58";
}

initializeTopTikTokCreators();

const navigation = document.createElement("nav");
navigation.className = "static-mobile-nav";
navigation.setAttribute("aria-label", "Mobile navigation");

for (const [label, href, desktopLabel] of pages) {
  const link = document.createElement("a");
  link.href = href;
  const icon = document.querySelector(`.nav-link[aria-label="${desktopLabel}"] svg`)?.cloneNode(true);
  if (icon) link.append(icon);
  const text = document.createElement("span");
  text.textContent = label;
  link.append(text);
  if (href === currentPage) link.setAttribute("aria-current", "page");
  navigation.append(link);
}

document.body.append(navigation);