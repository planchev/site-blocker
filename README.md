# Site Blocker

A simple Chrome extension (Manifest V3) that blocks websites by domain. When you visit a blocked site, you see a "blocked" page instead.

## Features

- Block any domain via the popup UI
- Auto-fills the current site's domain for quick blocking
- Blocked sites sync across Chrome profiles via `chrome.storage.sync`
- Uses `declarativeNetRequest` for efficient, native-level blocking

## Install

1. Go to `chrome://extensions` and enable **Developer Mode**
2. Click **Load unpacked** and select this folder
3. Click the extension icon to add or remove blocked sites
