# MedClinic & Your Health Pharmacy — Project State & Handover Notes

> **Last Updated**: October 15, 2026  
> **Status**: Ready for Owner Presentation & Production Deployment  
> **Location**: GRA Federal Housing Estate, Onitsha, Anambra State  

---

## 📌 How to Resume After PC Restart

When you restart your PC and open the project in the IDE:
1. Open this chat and simply type:
   > **"I just restarted my PC. Please read `PROJECT_HANDOVER_NOTES.md` and continue where we left off."**
2. I will immediately read this document and restore full context.
3. Start the dev servers in two terminals:
   - **Terminal 1 (Server)**:
     ```bash
     cd server
     npm run dev
     ```
     *(Runs on `http://localhost:5000` with MongoDB Connected)*
   - **Terminal 2 (Client)**:
     ```bash
     cd client
     npm run dev
     ```
     *(Runs on `http://localhost:5173` with LAN network host enabled)*

---

## 🏥 Key Pharmacy & Business Details

- **Lead Pharmacist**: Pharm. Chinedu Nwankwo (PCN Reg # `PCN-88421`)
- **Facility**: Your Health Diagnostic Centre Ltd & Your Health Pharmacy
- **Registered Premises**: 1 Nwankwo Chinedu Crescent, Off Ogbatuluenyi Street, FHE 3-3, Onitsha, Anambra State
- **Official Telephone Lines**:
  - `0803 733 4924`
  - `0702 505 1669` (Official WhatsApp & Line: `https://wa.me/2347025051669`)
  - `0806 444 4654`
- **Official Working Hours**:
  - **Monday to Saturday**: `7:00 AM – 9:00 PM`
  - **Sunday**: `12:00 PM – 9:00 PM`
- **Coverage Areas**: FHE 3-3 Area, GRA, Nkwelle Ezunaka, Fegge, Woliwo, Awka Road, Inland Town
- **Core Specialized Services**: Health & Vaccine Advocacy, Medicine Use & Safety (MTM), Pediatric/Adult/Geriatric Drug Safety, Terminal Illness Drug Care, Mental Health, Pregnant Women Drug Safety, Preventive Healthy Living.

---

## 🚀 Recent Implementations & Fixes

1. **Google OAuth 2.0 Integration**:
   - Google Client ID: `534423448246-r2dpn2cuki4d329ejk7e57tam8ug8aem.apps.googleusercontent.com`
   - Secure login & registration for patients.
   - **Role Protection**: Newly registered Google accounts strictly default to `patient` role. They cannot see Pharmacist administrative banners, pending consultation approvals, or clinical counters.
2. **Mobile Background Scroll Bleed Fixed**:
   - Mobile sidebar navigation drawer locks body scroll with `touch-none` and `overscroll-contain` so background pages don't scroll while the sidebar is open.
3. **PWA Mobile App Installation & Banner**:
   - Created `client/public/manifest.json` and linked in `index.html` with mobile meta tags.
   - Refactored `InstallAppBanner.jsx` to use `sessionStorage` instead of permanent `localStorage` (so dismissing it only hides it for that session, and it resets on new session or logout).
   - Added interactive **"Install MedClinic" Modal** with step-by-step guides for Android (Chrome), iOS (Safari), and Desktop.
   - Added an on-demand **"Install Mobile App"** button in `Sidebar.jsx`.
4. **Onitsha Doorstep Courier Card Layout**:
   - Restructured the order cards in `PharmacistDashboard.jsx` with a responsive full-width bottom action bar:
     - Left: Document inspection (`Order Details`, `View Rx Slip`, `Print Receipt`).
     - Right: Courier status and communication (`Status Badge`, `Confirm Delivery`, `WhatsApp`, `Send Refill Alert`).
   - Clean spacing with `pb-24` clearance to avoid collision with the floating chat button.
5. **Interprofessional Workflow Mapped**:
   - Full 5-pillar collaboration model between Doctors and the Pharmacist (e-Prescription routing, NAFDAC MAS authenticity counter-checking, MTM peer referrals back to doctors, shared patient health records, closed-loop refill adherence).

6. **Doctor Portal Interactive Practice Analytics**:
   - Upgraded all 4 analytics cards in `DoctorPortalHome.jsx` to interactive, responsive cards with hover micro-animations and dedicated modals:
     - **Total Patients Seen (128)**: Opens the **Patient Clinical Registry Modal** with real-time search, demographic tags, clinical conditions, Onitsha neighborhoods, EMR status, and e-prescriptions history.
     - **Patient Satisfaction (4.9 ★)**: Opens the **Patient Reviews Modal** with overall 4.9 rating, star distribution percentages (5-star: 91%), and verified patient reviews from GRA Onitsha, 3-3 Area, and Fegge.
     - **Telemed Calls (42)**: Opens the **Telemedicine Hub & Logs Modal** showing average call length, stability rating, past video/audio consult records, and a quick **"Launch Instant Virtual Telemed Room"** button.
     - **Today's Queue**: Smoothly scrolls down to `#today-queue-section` with an eye-catching purple focus ring.
7. **Production Deployment & CI/CD Readiness**:
   - Initialized Git repository on `main` branch with clean initial commit.
   - Configured `.gitignore` to safely guard secrets (`.env`), build artifacts, and dependencies.
   - Added `client/vercel.json` for single-page application (SPA) client-side routing on Vercel.
   - Centralized all 40+ client API requests through `client/src/config/api.js` (`API_BASE_URL`), allowing seamless transition between local development (`localhost:5000`) and production cloud hosting.

---

## 🌐 Continuous Deployment (GitHub → Vercel & Render)

### Step 1: Push Local Git Repository to GitHub
Create a new GitHub repository (e.g., `medclinic`) at [github.com/new](https://github.com/new), then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/medclinic.git
git push -u origin main
```

### Step 2: Deploy Backend to Render (Free Web Service)
1. Log in to [render.com](https://render.com) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your `medclinic` GitHub repository.
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables (from your `server/.env`):
   - `MONGO_URI`: `mongodb://buchychristen_db_user:...@cluster0...` *(Already connected to MongoDB Atlas!)*
   - `EMAIL_USER`: `buchychristen@gmail.com`
   - `EMAIL_PASS`: `iwll tpty nqtk yxjq`
   - `JWT_SECRET`: `medclinic_secret_jwt_key_2026_super_secure`
   - `GOOGLE_CLIENT_ID`: `534423448246-r2dpn2cuki4d329ejk7e57tam8ug8aem.apps.googleusercontent.com`
5. Click **Create Web Service**. You will receive your live backend URL (e.g. `https://medclinic-server.onrender.com`).

### Step 3: Deploy Frontend to Vercel (Free Next-Gen Hosting)
1. Log in to [vercel.com](https://vercel.com) and click **Add New** $\rightarrow$ **Project**.
2. Import your `medclinic` GitHub repository.
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com`
5. Click **Deploy**. In under 60 seconds you will receive your live production domain (e.g. `https://medclinic.vercel.app`)!

### Step 4: Automatic Continuous Deployment (CI/CD)
Whenever you make any change or bug fix in the code, simply run:
```bash
git add .
git commit -m "Describe your update"
git push
```
GitHub will automatically signal Vercel and Render to redeploy the live application within 60 seconds without downtime!
