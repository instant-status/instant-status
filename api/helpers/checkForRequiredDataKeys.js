const checkForRequiredDataKeys = (ctxBody, requiredDataKeys) => {
  let hasAllRequiredDataKeys = true;
  let missingDataKeys = [];

  requiredDataKeys.forEach((dataKey) => {
    if (typeof ctxBody[dataKey] === 'undefined') {
      hasAllRequiredDataKeys = false;
      missingDataKeys.push(dataKey);
    }
  });

  return {
    hasAllRequiredDataKeys: hasAllRequiredDataKeys,
    missingDataKeys: missingDataKeys,
    message: `Missing required keys: [${missingDataKeys.join(', ')}]`,
  };
};

export default checkForRequiredDataKeys;
