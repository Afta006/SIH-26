# OceanEmbed – SIH 2026

## 1. Project Information

- **Project Title:** OceanEmbed – Satellite Embedding-Based Deep Learning for Subsurface Ocean Temperature Reconstruction
- **PS ID:** [Enter your official SIH PS ID]
- **PS Title:** [Enter the official SIH Problem Statement Title]
- **Category:** Software
- **Theme:** [Enter the official SIH Theme]

## 2. Problem Statement

Satellite observations provide extensive information about the ocean surface, but direct observations of subsurface ocean conditions remain sparse.

ARGO floats and research vessels provide valuable subsurface measurements, but their spatial coverage is limited across the vast ocean.

This creates a gap between the availability of large-scale surface observations and our ability to understand the temperature structure beneath the ocean surface.

## 3. Proposed Solution

OceanEmbed uses a CNN-based deep learning approach to reconstruct subsurface ocean temperature profiles from surface ocean and satellite-derived variables.

The current Proof of Concept focuses on the Bay of Bengal and reconstructs temperature at 15 standardized depths from the surface down to 1000 meters.

The platform provides an interactive web interface where users can select a location and date and visualize the reconstructed temperature profile.

## 4. Key Features

- Interactive ocean map
- Location selection through map or manual coordinates
- Date-based reconstruction
- CNN-based subsurface temperature prediction
- Temperature profile visualization up to 1000 meters
- Comparison with GLORYS reference profiles
- Independent validation using ARGO profiles
- Random Forest baseline comparison
- Interactive web-based platform
- Backend prediction database
- Geospatial prediction lookup

## 5. Technology Stack

- **Frontend:** React, Vite, JavaScript, Leaflet, Recharts
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Machine Learning:** Python, CNN, Random Forest
- **Data Sources:** Copernicus Marine Service GLORYS12, ERA5, ARGO
- **Deployment:** Web-based cloud deployment

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
      CNN Reconstruction
              |
              v
 Subsurface Temperature Profile
          0 – 1000 m
              |
              v
       ARGO Validation
              |
              v
      Web Visualization
