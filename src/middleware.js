import rateLimit from 'express-rate-limit';

export const validateApiKey = (parsedConfig) => (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !parsedConfig.data.apiKeys.includes(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

export const limiter = rateLimit({
  windowMs: 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again later.' }, 
});

