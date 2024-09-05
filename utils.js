import crypto from 'node:crypto';

export const createSignature = (data, token) => {
  const sortedData = Object.keys(data)
    .sort()
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  return crypto
    .createHash('md5')
    .update(JSON.stringify(sortedData) + token)
    .digest('hex');
};

export const sign = (data, token) => {
  data.signature = createSignature(data, token);
};

export const checkSignature = (data, token) => {
  const _data = { ...data };

  const _dataSignature = _data.signature;

  delete _data['signature'];

  return _dataSignature === createSignature(_data, token);
};
