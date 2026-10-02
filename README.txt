CLINICAL PHOTO CAPTURE — PWA TRIAL BUILD
HITH / District Nursing
=========================================================

WHAT THIS IS
------------
A proof-of-concept Progressive Web App (PWA) demonstrating privacy-preserving
clinical photography using the browser's getUserMedia API. Photos are captured
entirely in memory and never saved to the device's camera roll or filesystem.

This build uses a SIMULATED upload (2-second delay). The Graph API stub in
index.html must be replaced with real MSAL authentication and Graph API calls
before production use.


HOW TO TRIAL ON A MOBILE DEVICE
---------------------------------
IMPORTANT: getUserMedia (camera API) only works over HTTPS or localhost.
Opening index.html directly from Files will NOT work — the camera will be blocked.

You need to serve these files over a local or remote web server.

OPTION 1 — Easiest: Use your computer as a local server
  1. Install Node.js if not already installed (nodejs.org)
  2. Open Terminal, navigate to this folder:
       cd path/to/clinical-photo-pwa
  3. Run:
       npx serve .
  4. Note the local IP address shown (e.g. http://192.168.1.5:3000)
  5. Make sure your phone and computer are on the same Wi-Fi
  6. On your phone, open Safari (iOS) or Chrome (Android) and go to that address
  7. Allow camera access when prompted

OPTION 2 — GitHub Pages (free, public HTTPS, easiest for sharing)
  1. Create a free GitHub account at github.com
  2. Create a new repository, upload these files
  3. Go to Settings → Pages → Deploy from main branch
  4. Access at https://[your-username].github.io/[repo-name]/
  5. Share that URL with any device for testing

OPTION 3 — Netlify Drop (instant, no account needed)
  1. Go to app.netlify.com/drop
  2. Drag the entire clinical-photo-pwa folder onto the page
  3. Get an instant HTTPS URL — valid for 1 hour on free plan

OPTION 4 — VS Code Live Server with HTTPS tunnel
  If you use VS Code, install the "Live Server" extension and
  use ngrok or Cloudflare Tunnel to expose it over HTTPS.


ADD TO HOME SCREEN (makes it feel like a native app)
------------------------------------------------------
iOS Safari:   Share button → "Add to Home Screen"
Android Chrome: Menu (⋮) → "Add to Home Screen" or "Install app"


FILES IN THIS PACKAGE
----------------------
  index.html      Main application (all HTML, CSS, JS in one file)
  manifest.json   PWA metadata (name, icons, display mode)
  sw.js           Service worker (shell caching only — never caches photos)
  icon-192.svg    App icon (home screen, 192×192)
  icon-512.svg    App icon (splash screen, 512×512)
  README.txt      This file


WHAT TO TEST ON MOBILE
------------------------
✓ Form validation (required fields)
✓ Camera opens correctly (rear camera by default)
✓ Flip camera button (front/rear)
✓ Photo capture → preview → metadata badges
✓ Confirm photo does NOT appear in Photos/Gallery app
✓ Upload simulation (progress bar, success screen)
✓ "New Photo" resets cleanly
✓ Add to Home Screen and reopen from home screen icon
✓ Landscape + portrait orientation


PRODUCTION READINESS CHECKLIST
--------------------------------
Before go-live, the following must be completed:

[ ] Replace uploadToSharePoint() stub with real Microsoft Graph API call
    - MSAL authentication (Azure AD / Entra ID — SVHM tenant)
    - PUT to SharePoint drive for binary upload
    - PATCH to list item fields for metadata columns (UR, site, type, etc.)

[ ] Configure SharePoint library columns:
    UR (text), PatientName (text), DOB (date), BodySite (choice),
    PhotoType (choice), Clinician (text), ClinicalNotes (multiline text),
    CapturedDateTime (datetime), UploadedBy (person — auto from token)

[ ] Privacy & governance sign-off from SVHM Privacy Officer
[ ] IT Security review (BYOD policy, Intune MAM if applicable)
[ ] Legal/Health Records Act compliance check
[ ] Consent workflow for clinical photography
[ ] Staff training and acceptable use policy
[ ] Pilot with a small HITH/DN cohort before broad rollout
[ ] Incident response plan if device with patient data is lost


PRIVACY ARCHITECTURE SUMMARY
------------------------------
- getUserMedia() → camera stream in JS memory (never touches filesystem)
- canvas.toBlob() → Blob object (heap only, no disk write)
- URL.createObjectURL() → temporary preview URL
- After upload: URL.revokeObjectURL() + blob = null → GC frees memory
- Service worker: caches HTML/JS shell only, never intercepts photo data
- No localStorage, sessionStorage, or IndexedDB used

Residual BYOD risks (cannot be eliminated technically):
- Screenshots taken by staff (device-level, unpreventable)
- Teams app caching (mitigated via Intune MAM app protection policies)


QUESTIONS / FURTHER DEVELOPMENT
---------------------------------
Built as a proof-of-concept for SVHM HITH / District Nursing.
Contact your clinical informatics or digital health team to progress
the production implementation.
