# SIH 2026 Submission Guide

Use this checklist before submitting the OceanEmbed GitHub repository link.

## Required Repository Content

- Actual OceanEmbed source code is present in `src/`.
- `README.md` explains the project clearly.
- PS ID and PS title are included.
- Problem statement and proposed solution are explained.
- Key features are listed.
- Technology stack is listed.
- System architecture is documented.
- Setup and run instructions are provided.
- Team members and roles are mentioned.
- Important project screenshots are included.
- Final PPT/presentation is placed in `submission/` whenever practical.
- If the PPT is too large for GitHub, an accessible Google Drive/OneDrive viewer link is added to `submission/PRESENTATION.md`.
- Demo video link is added to `submission/DEMO.md`.
- Repository is public and accessible to reviewers.
- All submitted external links are publicly accessible.

## Recommended Structure

```text
SIH-26/
├── README.md
├── SUBMISSION_GUIDE.md
├── submission/
│   ├── PRESENTATION.md
│   └── DEMO.md
├── src/
├── docs/
│   └── architecture.md
├── assets/
│   └── screenshots/
│       └── README.md
├── .gitignore
└── LICENSE
```

### What Goes Where?

| Item | Location |
|---|---|
| Source code | `src/` |
| Architecture / technical documentation | `docs/` |
| Project screenshots | `assets/screenshots/` |
| Final PPT / presentation | `submission/` |
| Demo video link | `submission/DEMO.md` |
| Project overview | `README.md` |

## Presentation

Upload the final SIH presentation to the `submission/` folder whenever the file size is suitable for GitHub.

Use a clear filename such as:

`OceanEmbed_SIH2026_Presentation.pptx`

If the PPT is too large for GitHub, upload it to Google Drive or OneDrive and put the publicly accessible viewer link in:

`submission/PRESENTATION.md`

Make sure the external link can be opened without requesting permission.

## Demo Video

The demo video should be linked through:

`submission/DEMO.md`

The video should demonstrate the actual working OceanEmbed platform and its main functionality.

### Recommended Demo Flow

1. Brief introduction to the problem.
2. Introduction to the OceanEmbed solution.
3. Open the deployed platform.
4. Show the Bay of Bengal study region.
5. Select a location on the map.
6. Select a date.
7. Run the reconstruction.
8. Display the predicted subsurface temperature profile.
9. Compare the CNN prediction with the GLORYS reference.
10. Show the validation/results section.
11. Briefly explain the impact and scalability.

Make sure the video is accessible without requesting permission.

## Screenshots / Prototype Photos

Put important OceanEmbed screenshots in:

`assets/screenshots/`

Recommended screenshots include:

- Homepage
- Live Demo section
- Ocean map
- Location selection
- Manual coordinate selection
- Date selection
- Reconstruction result
- Predicted vs GLORYS reference profile
- Validation results
- Important platform features

Include the most useful final screenshots rather than random development screenshots.

## Architecture Documentation

The technical architecture is documented in:

`docs/architecture.md`

The architecture documentation covers:

- Data sources
- Data preprocessing
- Spatial and temporal grid
- CNN reconstruction model
- Random Forest baseline
- ARGO validation
- Backend API
- MongoDB database
- React frontend
- Prediction workflow
- Visualization
- Deployment
- Scalability

## Installation

The README should contain the actual installation instructions required to run the project locally.

For the current web application:

```bash
git clone https://github.com/Afta006/SIH-26.git
cd SIH-26
npm install
```

Any additional configuration required by the project should be documented in the README.

## Run

Start the development server using:

```bash
npm run dev
```

The application will start locally and provide access to the OceanEmbed web interface.

## Project Validation

The project documentation should clearly mention the current validation setup.

The current Proof of Concept covers:

- **Region:** Bay of Bengal
- **Latitude:** 10°N – 15°N
- **Longitude:** 80°E – 85°E
- **Time Period:** January – April 2023
- **Depth Range:** 0 – 1000 meters
- **Standardized Depths:** 15
- **Independent ARGO Profiles:** 33

The CNN-based approach achieved approximately **0.40°C RMSE**, compared with approximately **0.60°C RMSE** for the Random Forest baseline.

## Do Not Upload

Never upload:

- Passwords
- API keys
- Access tokens
- `.env` files containing secrets
- Database credentials
- Private credentials
- Authentication secrets
- Personal access tokens
- Other confidential information

Use `.gitignore` to prevent sensitive files from being committed.

## README Should Answer

The README should clearly answer:

1. What problem is OceanEmbed solving?
2. What is the proposed solution?
3. How does OceanEmbed work?
4. Which technologies are used?
5. What data sources are used?
6. What is the study region?
7. How can a reviewer run the project?
8. What does the final output look like?
9. What are the model results?
10. What are the important features?
11. What is the expected impact?
12. How can the system be scaled?
13. What is the future scope?

## Public Accessibility

Before submission, make sure the GitHub repository is set to **Public**.

All submitted links should also be accessible to reviewers without requiring:

- GitHub login
- Google Drive permission
- YouTube private access
- Any other special authorization

## Before Submission

Open the repository in a private/incognito browser window or while logged out.

Verify that reviewers can access:

- Source code
- README
- Submission guide
- Architecture documentation
- Screenshots
- Final PPT
- Demo video
- Deployed website
- Any other submitted links

## Security Check

Before pushing the final version, check the repository for accidentally committed secrets.

Look for files and values such as:

```text
.env
.env.local
password
api_key
apikey
token
secret
mongodb+srv
```

Make sure no real credentials, passwords, API keys, database credentials, or private access information are present.

## Final Checklist

- [ ] Repository is Public
- [ ] Source code is present in `src/`
- [ ] `README.md` is complete
- [ ] `SUBMISSION_GUIDE.md` is present
- [ ] PS ID is added
- [ ] PS Title is added
- [ ] SIH Theme is added
- [ ] Architecture documentation is present
- [ ] Screenshots are uploaded
- [ ] Final PPT is uploaded or linked
- [ ] Demo video is uploaded or linked
- [ ] Deployed website is accessible
- [ ] All submitted links are public
- [ ] No `.env` or secret credentials are committed
- [ ] Installation instructions work
- [ ] Project runs successfully
- [ ] Repository has been checked in incognito/logged-out mode
- [ ] Final GitHub repository URL is ready for submission
