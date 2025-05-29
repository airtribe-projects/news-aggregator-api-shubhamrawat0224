const axios = require('axios');

// Get news from News API based on user preferences.
async function getNews(req, res) {

    try {
      
        const apiKey = process.env.NEWS_API_KEY;
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: req.user.preferences.join(','),
                apiKey,
                pageSize: 10,
            }
        });

        const articles = response.data.articles;
        res.status(200).json({ news: articles});
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch news' });
    }
}

module.exports = {
    getNews
};
