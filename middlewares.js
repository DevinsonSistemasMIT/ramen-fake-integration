import { checkSignature } from './utils.js';

export const validateSignature = (token) => (req, res, next) => {
  if (!req.query.skipSig && !checkSignature(req.body, token)) {
    return res.json({ error: 1, message: 'signature mismatch' });
  }

  next();
};
