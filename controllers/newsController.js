const axios = require('axios');

async function getNews(req, res) {
    try {
        const preferences = req.user.preferences.join(' OR ') || 'technology';
        const apiKey = process.env.NEWS_API_KEY;
    
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: preferences,
            apiKey,
            pageSize: 10,
          }
        });
    
        res.status(200).json({ news: response.data.articles });
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch news' });
      }
}

module.exports = { getNews };
