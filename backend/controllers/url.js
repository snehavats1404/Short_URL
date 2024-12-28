const shortid = require('shortid');
const URL = require('../models/url');

// Controller for generating a shortened URL
async function handleGenerateshortURL(req, res) {
  const body = req.body;

  // Validate input
  if (!body.url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Generate a unique short ID
    const generatedShortID = shortid();

    // Create and save the new shortened URL
    const newUrl = await URL.create({
      shortid: generatedShortID,
      redirectURL: body.url,
      visitHistory: [], // Initialize visit history
      createdBy: req.user._id, // Associate the URL with the logged-in user
    });

    // Respond with the created short URL
    return res.json({
      shortid: newUrl.shortid,
      originalURL: newUrl.redirectURL,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
}

// Controller for fetching analytics of a specific shortened URL
async function handleGetAnalytics(req, res) {
  const shortid = req.params.shortid;

  try {
    // Find the URL by short ID
    const result = await URL.findOne({ shortid });

    // If the URL doesn't exist
    if (!result) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Respond with analytics data (click count and visit history)
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

module.exports = {
  handleGenerateshortURL,
  handleGetAnalytics,
};
