const pages = [
  ["Home", "index.html"],
  ["Explore", "explore.html"],
  ["Donos", "donos.html"],
  ["Launch", "launch.html"],
  ["Flow", "flow.html"],
];

const currentPage = location.pathname.split("/").pop() || "index.html";
const navigation = document.createElement("nav");
navigation.className = "static-mobile-nav";
navigation.setAttribute("aria-label", "Mobile navigation");

for (const [label, href] of pages) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (href === currentPage) link.setAttribute("aria-current", "page");
  navigation.append(link);
}

document.body.append(navigation);