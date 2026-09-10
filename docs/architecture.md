# System Architecture

## High-level flow

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

## Components

### Data Sources

OceanEmbed uses surface ocean and atmospheric variables from established oceanographic datasets.

The current system uses:

- Sea Surface Salinity (SSS)
- Sea Surface Height (SSH)
- East-West Ocean Current
- North-South Ocean Current
- East-West Surface Wind
- North-South Surface Wind

The primary data sources include Copernicus Marine Service GLORYS12 and ERA5. ARGO observations are used for independent validation.

### Data Preprocessing

The raw datasets are processed and aligned to a common spatial and temporal grid.

The preprocessing pipeline includes data cleaning, spatial alignment, temporal alignment, standardization, and preparation of input samples for the deep learning model.

The target temperature profiles are represented at 15 standardized depths from the surface to 1000 meters.

### CNN Reconstruction Model

The CNN-based model learns the relationship between surface ocean conditions and subsurface temperature structure.

Patch-based training is used to generate a large number of spatial training samples from the available daily observations.

The model produces a complete subsurface temperature profile for the selected location.

### Random Forest Baseline

A Random Forest model is used as a baseline for comparison with the CNN approach.

The CNN achieves approximately 0.40°C RMSE compared with approximately 0.60°C RMSE for the Random Forest baseline.

### ARGO Validation

Independent ARGO float profiles are used to evaluate the reconstructed temperature profiles.

A total of 33 independent ARGO profiles were used for validation and were not used during model training.

### Backend API

The backend handles requests from the frontend and retrieves the required prediction data.

It provides endpoints for:

- Project metadata
- Location and date-based prediction lookup
- Validation results

The backend also handles communication with the prediction database.

### MongoDB Database

MongoDB stores the precomputed prediction results and related project data.

Geospatial indexing enables efficient retrieval of predictions for a selected geographic location.

### React Frontend

The React-based frontend provides the interactive user interface.

Users can:

- Select a location on the map
- Enter latitude and longitude manually
- Select a date
- Request a reconstruction
- View the predicted temperature profile
- Compare the prediction with the GLORYS reference profile

### Visualization

The reconstructed temperature profile is displayed as a depth-versus-temperature chart.

The platform allows users to visually compare the CNN prediction with the reference profile from the surface down to 1000 meters.

## Data Flow

```text
User selects Location + Date
              |
              v
        React Frontend
              |
              v
         Backend API
              |
              v
      MongoDB Prediction DB
              |
              v
     Nearest Grid Lookup
              |
              v
   Predicted Temperature Profile
              |
              v
        React Frontend
              |
              v
      Interactive Chart
```

## Model Development & Validation Flow

```text
Surface Variables
       |
       v
Data Preprocessing
       |
       v
Patch-based Training Data
       |
       +------------------+
       |                  |
       v                  v
 Random Forest           CNN
   Baseline           Reconstruction
       |                  |
       +--------+---------+
                |
                v
          Model Evaluation
                |
                v
       Independent ARGO Data
                |
                v
        Validation Results
```

## Current Study Configuration

- **Study Region:** Bay of Bengal
- **Latitude:** 10°N – 15°N
- **Longitude:** 80°E – 85°E
- **Time Period:** January – April 2023
- **Depth Range:** 0 – 1000 meters
- **Standardized Depths:** 15
- **Independent ARGO Profiles:** 33

## Model Performance

The CNN-based approach was compared against a Random Forest baseline.

| Model | RMSE |
|---|---:|
| Random Forest | ~0.60°C |
| CNN | **~0.40°C** |

The CNN model uses patch-based training to generate a larger number of spatial training samples from the available observations.

## Deployment

The OceanEmbed platform consists of a React frontend, backend API, and MongoDB prediction database.

The deployed platform allows users to select a location and date and explore the reconstructed subsurface temperature profile through an interactive web interface.

## Scalability

The architecture is designed to support expansion beyond the current Proof of Concept.

With additional data and computational resources, the system can be extended to:

- Larger regions of the Bay of Bengal
- The North Indian Ocean
- Other ocean basins
- Longer time periods
- Higher spatial and temporal resolutions
