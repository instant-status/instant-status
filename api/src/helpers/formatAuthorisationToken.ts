const formatAuthorisationToken = (value: string) => {
  if (value) {
    return value.replace('Bearer ', '');
  }
  return '';
};

export default formatAuthorisationToken;
