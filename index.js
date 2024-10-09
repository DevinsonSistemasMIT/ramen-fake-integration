import express from 'express';
import morgan from 'morgan';
import crypto from 'node:crypto';

import { validateSignature } from './middlewares.js';
import { sign } from './utils.js';

const PORT = 3001;
const TOKEN = 'test_token';

const player = {
  id: '1-en',
  username: 'player',
  balance: 100.0,
  currency: 'USD',
  lang: 'en',
  session_token: 'abc123',
};

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(validateSignature(TOKEN));

app.post('/balance', (req, res) => {
  if (!req.body.session_token) {
    return res.json({
      error: 6,
      message: 'the field session_token is required',
    });
  }

  if (req.body.session_token !== player.session_token) {
    return res.json({
      error: 3,
      message: `the player ${req.body.session_token} was not found`,
    });
  }

  const resBody = {
    error: 0,
    balance: player.balance,
    external_id: player.id,
    session_token: player.session_token,
    currency: player.currency,
    lang: player.lang,
    username: player.username,
  };

  sign(resBody, TOKEN);

  return res.json(resBody);
});

app.post('/credit', (req, res) => {
  if (!req.body.external_id) {
    return res.json({
      error: 6,
      message: 'the field external_id is required',
    });
  }

  if (req.body.external_id !== player.id) {
    return res.json({
      error: 3,
      message: `the player ${req.body.external_id} was not found`,
    });
  }

  if (!req.body.currency) {
    return res.json({
      error: 6,
      message: 'the field currency is required',
    });
  }

  if (req.body.currency !== player.currency) {
    return res.json({
      error: 5,
      message: `the currency ${req.body.currency} does not match with the player currency`,
    });
  }

  if (!req.body.timestamp) {
    return res.json({
      error: 6,
      message: 'the field timestamp is required',
    });
  }

  if (!Number(req.body.timestamp)) {
    return res.json({
      error: 6,
      message: 'the field timestamp must be numeric',
    });
  }

  if (!req.body.amount) {
    return res.json({
      error: 6,
      message: 'the field amount is required',
    });
  }

  const amount = Number(req.body.amount);

  if (Number.isNaN(amount)) {
    return res.json({
      error: 6,
      message: 'the field amount must be numeric',
    });
  }

  player.balance += amount;

  const resBody = {
    error: 0,
    balance: player.balance,
    currency: player.currency,
    transaction_id: crypto.randomUUID(),
  };

  sign(resBody, TOKEN);

  return res.json(resBody);
});

app.post('/debit', (req, res) => {
  if (!req.body.external_id) {
    return res.json({
      error: 6,
      message: 'the field external_id is required',
    });
  }

  if (req.body.external_id !== player.id) {
    return res.json({
      error: 3,
      message: `the player ${req.body.external_id} was not found`,
    });
  }

  if (!req.body.currency) {
    return res.json({
      error: 6,
      message: 'the field currency is required',
    });
  }

  if (req.body.currency !== player.currency) {
    return res.json({
      error: 5,
      message: `the currency ${req.body.currency} does not match with the player currency`,
    });
  }

  if (!req.body.timestamp) {
    return res.json({
      error: 6,
      message: 'the field timestamp is required',
    });
  }

  if (!Number(req.body.timestamp)) {
    return res.json({
      error: 6,
      message: 'the field timestamp must be numeric',
    });
  }

  if (!req.body.amount) {
    return res.json({
      error: 6,
      message: 'the amount is required',
    });
  }

  const amount = Number(req.body.amount);

  if (Number.isNaN(amount)) {
    return res.json({
      error: 6,
      message: 'the field amount must be numeric',
    });
  }

  player.balance -= amount;

  const resBody = {
    error: 0,
    balance: player.balance,
    currency: player.currency,
    transaction_id: crypto.randomUUID(),
  };

  sign(resBody, TOKEN);

  return res.json(resBody);
});

app.post('/refund', (req, res) => {
  if (!req.body.external_id) {
    return res.json({
      error: 6,
      message: 'the field external_id is required',
    });
  }

  if (req.body.external_id !== player.id) {
    return res.json({
      error: 3,
      message: `the player ${req.body.external_id} was not found`,
    });
  }

  if (!req.body.transaction_id) {
    return res.json({
      error: 6,
      message: 'the field transaction_id is required',
    });
  }

  if (!req.body.currency) {
    return res.json({
      error: 6,
      message: 'the field currency is required',
    });
  }

  if (req.body.currency !== player.currency) {
    return res.json({
      error: 5,
      message: `the currency ${req.body.currency} does not match with the player currency`,
    });
  }

  if (!req.body.timestamp) {
    return res.json({
      error: 6,
      message: 'the field timestamp is required',
    });
  }

  if (!Number(req.body.timestamp)) {
    return res.json({
      error: 6,
      message: 'the field timestamp must be numeric',
    });
  }

  if (!req.body.amount) {
    return res.json({
      error: 6,
      message: 'the amount is required',
    });
  }

  const amount = Number(req.body.amount);

  if (Number.isNaN(amount)) {
    return res.json({
      error: 6,
      message: 'the field amount must be numeric',
    });
  }

  player.balance = !Number(req.body.transaction_id[0])
    ? player.balance - amount
    : player.balance + amount;

  const resBody = {
    error: 0,
    balance: player.balance,
    currency: player.currency,
    transaction_id: crypto.randomUUID(),
  };

  sign(resBody, TOKEN);

  return res.json(resBody);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
