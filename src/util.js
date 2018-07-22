exports.handleRatelimit = function handleRatelimit(handler, res) {
  if (typeof handler === 'function') {
    handler({
      limit: res.headers['x-ratelimit-limit'],
      remaining: res.headers['x-ratelimit-remaining'],
      reset: res.headers['x-ratelimit-reset'],
    });
  } else {
    throw new Error('Ratelimit Reached.');
  }
  return res.headers['x-ratelimit-reset'];
};
