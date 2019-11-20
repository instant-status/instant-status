export const isRequestAuthenticated = request => {
  if (request.token === process.env.BEARER_TOKEN) {
    return true;
  }
  return false;
};
