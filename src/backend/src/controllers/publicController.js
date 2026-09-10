import Prediction from '../models/Prediction.js'

// NOTE: these three endpoints intentionally return plain JSON (including
// on errors: { error: "..." }), NOT the { success, data } / { success,
// message } envelopes the rest of this backend uses. The frontend was
// built against this exact raw shape — changing it breaks every fetch()
// call on the frontend side. Errors are handled locally (try/catch)
// instead of throwing ApiError, so they don't pass through the global
// errorHandler's different response format.

export const getMeta = async (req, res) => {
  try {
    const count = await Prediction.countDocuments()
    if (count === 0) {
      return res.json({ available: false })
    }

    const dateAgg = await Prediction.aggregate([
      { $group: { _id: null, minDate: { $min: '$date' }, maxDate: { $max: '$date' } } },
    ])

    const boundsAgg = await Prediction.aggregate([
      {
        $group: {
          _id: null,
          minLon: { $min: { $arrayElemAt: ['$location.coordinates', 0] } },
          maxLon: { $max: { $arrayElemAt: ['$location.coordinates', 0] } },
          minLat: { $min: { $arrayElemAt: ['$location.coordinates', 1] } },
          maxLat: { $max: { $arrayElemAt: ['$location.coordinates', 1] } },
        },
      },
    ])

    const sample = await Prediction.findOne().lean()

    res.json({
      available: true,
      date_min: dateAgg[0].minDate,
      date_max: dateAgg[0].maxDate,
      lat_min: boundsAgg[0].minLat,
      lat_max: boundsAgg[0].maxLat,
      lon_min: boundsAgg[0].minLon,
      lon_max: boundsAgg[0].maxLon,
      depths: sample.depths,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load metadata.' })
  }
}

export const getPredict = async (req, res) => {
  try {
    const { date, lat, lon } = req.query

    if (!date || lat === undefined || lon === undefined) {
      return res.status(400).json({ error: 'date, lat, and lon query params are required.' })
    }

    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
      return res.status(400).json({ error: 'lat and lon must be numbers.' })
    }

    const match = await Prediction.findOne({
      date,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lonNum, latNum] },
        },
      },
    }).lean()

    if (!match) {
      return res.status(404).json({
        error: 'No prediction found for that date — check /api/meta for the supported range.',
      })
    }

    res.json({
      date: match.date,
      lat: match.location.coordinates[1],
      lon: match.location.coordinates[0],
      depths: match.depths,
      predicted_temp: match.predicted_temp,
      actual_temp: match.actual_temp,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Prediction lookup failed.' })
  }
}

// Static, already-computed evaluation numbers — never change at runtime,
// so served directly rather than round-tripping through MongoDB.
const RESULTS = {
  rf_rmse_overall: 0.6,
  cnn_rmse_overall: 0.4,
  argo_profiles_used: 33,
  argo_validation: {
    depths: [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000],
    rmse: [0.441, 0.257, 0.209, 0.181, 0.267, 0.441, 0.695, 1.093, 1.437, 1.218, 0.813, 0.267, 0.133, 0.148, 0.132],
  },
}

export const getResults = async (req, res) => {
  res.json(RESULTS)
}
