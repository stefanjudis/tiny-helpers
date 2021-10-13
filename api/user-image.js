const got = require('got');

module.exports = async (req, res) => {
  try {
    const { user, size } = req.query;
    const GITHUB_URL = `https://github.com/${user}.png${
      size ? `?size=${size}` : ''
    }`;
    const imageRequest = got(GITHUB_URL);

    const [imageResponse, imageBuffer] = await Promise.all([
      imageRequest,
      imageRequest.buffer(),
    ]);

    res.setHeader('Cache-Control', 's-maxage=43200');
    res.setHeader('content-type', imageResponse.headers['content-type']);
    res.send(imageBuffer);
  } catch (error) {
    if (error.message.includes('404')) {
      res.status(404);
      return res.send('Not found');
    }

    res.status(500);
    res.send(error.message);
  }
};
