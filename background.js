let pending = null;

async function applyRules() {
  // Debounce: if called multiple times quickly, only run the last one
  const token = (pending = {});
  await new Promise((r) => setTimeout(r, 50));
  if (pending !== token) return;

  try {
    const { blockedSites = [] } = await chrome.storage.sync.get({ blockedSites: [] });
    console.log("[SiteBlocker] blockedSites from storage:", blockedSites);

    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = existing.map((r) => r.id);
    console.log("[SiteBlocker] removing old rule IDs:", removeIds);

    const addRules = blockedSites.map((domain, i) => ({
      id: i + 1,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
      condition: {
        requestDomains: [domain],
        resourceTypes: ["main_frame"]
      }
    }));
    console.log("[SiteBlocker] adding rules:", JSON.stringify(addRules, null, 2));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: removeIds,
      addRules: addRules
    });

    const final = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("[SiteBlocker] active rules after update:", JSON.stringify(final, null, 2));
  } catch (err) {
    console.error("[SiteBlocker] applyRules error:", err);
  }
}

chrome.runtime.onInstalled.addListener(applyRules);
chrome.runtime.onStartup.addListener(applyRules);
chrome.storage.onChanged.addListener(applyRules);
