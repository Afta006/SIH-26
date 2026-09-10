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
       CNN Embedding
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
