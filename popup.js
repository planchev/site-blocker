const input = document.getElementById("domain-input");
const addBtn = document.getElementById("add-btn");
const siteList = document.getElementById("site-list");

function normalizeDomain(raw) {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/\/.*$/, "");
  return d;
}

async function getSites() {
  const data = await chrome.storage.sync.get({ blockedSites: [] });
  return data.blockedSites;
}

async function saveSites(sites) {
  await chrome.storage.sync.set({ blockedSites: sites });
}

function render(sites) {
  siteList.innerHTML = "";
  sites.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.addEventListener("click", () => removeSite(domain));
    li.appendChild(btn);
    siteList.appendChild(li);
  });
}

async function addSite() {
  const domain = normalizeDomain(input.value);
  if (!domain) return;
  const sites = await getSites();
  if (sites.includes(domain)) {
    input.value = "";
    return;
  }
  sites.push(domain);
  await saveSites(sites);
  input.value = "";
  render(sites);
}

async function removeSite(domain) {
  let sites = await getSites();
  sites = sites.filter((s) => s !== domain);
  await saveSites(sites);
  render(sites);
}

addBtn.addEventListener("click", addSite);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addSite();
});

getSites().then(render);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]?.url) {
    try {
      const domain = new URL(tabs[0].url).hostname.replace(/^www\./, "");
      input.value = domain;
      input.select();
    } catch {}
  }
});
