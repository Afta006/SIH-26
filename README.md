# OceanEmbed – SIH 2026

### Satellite Embedding-Based Deep Learning for Subsurface Ocean Temperature Reconstruction

## 1. Project Information

- **Project Title:** OceanEmbed – Satellite Embedding-Based Deep Learning for Subsurface Ocean Temperature Reconstruction
- **PS ID:** [ENTER OFFICIAL PS ID]
- **PS Title:** [ENTER OFFICIAL PS TITLE]
- **Category:** Software
- **Theme:** [ENTER OFFICIAL SIH THEME]

## 2. Problem Statement

Satellite observations provide extensive coverage of the ocean surface, but direct observations of subsurface ocean conditions remain sparse.

ARGO floats and research vessels provide valuable subsurface measurements, but their spatial coverage is limited across the vast ocean.

This creates a gap between the availability of large-scale surface observations and our ability to understand the temperature structure beneath the ocean surface.

OceanEmbed addresses this challenge by using surface ocean observations and deep learning to reconstruct subsurface ocean temperature profiles over large areas.

## 3. Proposed Solution

OceanEmbed is a CNN-based deep learning platform that reconstructs subsurface ocean temperature profiles using satellite and surface ocean observations.

The current Proof of Concept focuses on the Bay of Bengal and reconstructs temperature at 15 standardized depths from the surface down to 1000 meters.

The platform provides an interactive web interface where users can select a location and date and visualize the reconstructed subsurface temperature profile.

The system also compares the predicted profile with GLORYS reference data and evaluates the model using independent ARGO observations.

## 4. Key Features

- Interactive Bay of Bengal map
- Location selection through map
- Manual latitude and longitude selection
- Date-based reconstruction
- CNN-based subsurface temperature prediction
- Temperature profile visualization up to 1000 meters
- Comparison with GLORYS reference profiles
- Independent validation using ARGO profiles
- Random Forest baseline comparison
- Interactive web-based platform
- Backend prediction database
- Geospatial prediction lookup
- Deployed web application

## 5. Technology Stack

- **Frontend:** React, Vite, JavaScript
- **Visualization:** Leaflet, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Machine Learning:** Python, Convolutional Neural Network, Random Forest
- **Data Sources:** Copernicus Marine Service GLORYS12, ERA5, ARGO
- **Deployment:** Cloud-based web deployment

## 6. Architecture

See [docs/architecture.md](docs/architecture.md).

```text
Surface Ocean & Satellite Data
              |
              v
     Data Preprocessing
              |
              v
   Spatial & Temporal Grid
              |
              v
     CNN Reconstruction Model
              |
              v
 Subsurface Temperature Profile
          0 – 1000 m
              |
              v
        ARGO Validation
              |
              v
        Backend API
              |
              v
       MongoDB Database
              |
              v
       React Frontend
              |
              v
     Visualization / Results
```

## 7. Repository Structure

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

### What goes where?

| Item | Location |
|---|---|
| Source code | `src/` |
| Architecture / technical documentation | `docs/` |
| Project screenshots | `assets/screenshots/` |
| Final PPT / presentation | `submission/` |
| Demo video link | `submission/DEMO.md` |
| Project overview | `README.md` |

## 8. Final Presentation

The final SIH presentation is available through:

[submission/PRESENTATION.md](submission/PRESENTATION.md)

The presentation covers the problem statement, proposed solution, methodology, architecture, results, impact, scalability, and conclusion.

If the presentation file is too large for GitHub, a publicly accessible Google Drive or OneDrive viewer link is provided in `submission/PRESENTATION.md`.

## 9. Demo Video

The OceanEmbed demonstration video is available through:

[submission/DEMO.md](submission/DEMO.md)

The video demonstrates the working platform, including location selection, date selection, reconstruction, and subsurface temperature profile visualization.

## 10. Screenshots / Prototype

Important screenshots of the OceanEmbed platform are available in:

`assets/screenshots/`

These include important views such as:

- Homepage
- Live reconstruction demo
- Ocean map
- Location selection
- Temperature reconstruction
- Predicted vs reference temperature profile
- Validation results

See [assets/screenshots/README.md](assets/screenshots/README.md).

## 11. Installation

Clone the repository:

```bash
git clone https://github.com/Afta006/SIH-26.git
cd SIH-26
```

Install the required dependencies:

```bash
npm install
```

Additional project-specific configuration, if required, is documented within the project files.

## 12. Run

Start the application using:

```bash
npm run dev
```

The application will start locally and provide access to the OceanEmbed web interface.

The deployed version can also be accessed directly through the project deployment link provided below.

## 13. Study Region & Dataset

The current Proof of Concept focuses on the Bay of Bengal.

- **Latitude:** 10°N – 15°N
- **Longitude:** 80°E – 85°E
- **Time Period:** January – April 2023
- **Depth Range:** 0 – 1000 meters
- **Standardized Depths:** 15

### Input Variables

The model uses six surface variables:

- Sea Surface Salinity (SSS)
- Sea Surface Height (SSH)
- East-West Ocean Current
- North-South Ocean Current
- East-West Surface Wind
- North-South Surface Wind

### Data Sources

- Copernicus Marine Service GLORYS12
- ERA5
- ARGO observations

## 14. Model Performance

A Random Forest model was used as a baseline and compared with the CNN-based approach.

| Model | RMSE |
|---|---:|
| Random Forest | ~0.60°C |
| CNN | **~0.40°C** |

The initial CNN training was limited by the small number of daily observations.

A patch-based training approach was introduced to generate a much larger number of spatial training samples and improve model performance.

The final CNN model achieved approximately **0.40°C RMSE**, outperforming the Random Forest baseline of approximately **0.60°C RMSE**.

The model was also independently evaluated against **33 ARGO float profiles** that were not used during training.

## 15. Impact

OceanEmbed aims to complement sparse subsurface observations by using widely available surface observations to estimate ocean temperature profiles over larger areas.

Potential applications include:

- Marine research
- Fisheries and ocean resource management
- Climate monitoring
- Ocean forecasting
- Environmental monitoring
- Disaster monitoring

The platform makes subsurface temperature reconstruction easier to explore through an interactive web interface.

## 16. Scalability

The current implementation is a Proof of Concept for the Bay of Bengal.

With additional data and computational resources, the system can be extended to:

- Larger regions of the Bay of Bengal
- The North Indian Ocean
- Other ocean basins
- Longer time periods
- Higher spatial and temporal resolutions

## 17. Future Scope

- Expand coverage to the North Indian Ocean
- Extend the system to other ocean basins
- Incorporate longer historical datasets
- Improve reconstruction accuracy around the thermocline
- Integrate additional oceanographic variables
- Increase spatial and temporal resolution
- Improve real-time prediction capabilities
- Incorporate additional independent observations for validation

## 18. Deployed Platform

**OceanEmbed Live Platform:**

[ADD YOUR DEPLOYED WEBSITE LINK HERE]

## 19. Team

Developed as part of **Smart India Hackathon 2026 – Internal Round**.

Team member details and roles are provided as required in the SIH submission.

## Conclusion

OceanEmbed bridges the gap between extensive surface ocean observations and limited subsurface measurements by using deep learning to reconstruct ocean temperature profiles down to 1000 meters.

The platform combines oceanographic data, machine learning, backend infrastructure, and interactive visualization into a single web-based system.

**OceanEmbed — Bringing the unseen layers of the ocean closer to observation.**
