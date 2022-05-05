
export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);


export const snakeToCamelCase = str => str.replace(
  /([-_][a-z])/g,
  (group) => group
    .replace('-', '')
    .replace('_', '')
);

export const camelToSnakeCase = str => (str
    .split(/(?=[A-Z])/)
    .map(x => x.toUpperCase())
    .join('_')
);

export const pluralToSingle = str => {
  if (str.slice(-1) !== 's') {
    // This string is not plural: keep it unaltered
    return str;
  } else if (str.slice(-3) === 'ies') {
    // Handle special case of categories
    return `${str.slice(0, -3)}y`;
  } else if (str.slice(-3) === 'IES') {
    // Same but in upper case
    return `${str.slice(0, -3)}Y`;
  } else {
    // Standard plural
    return str.slice(0, -1);
  }
}

export const arrayToObject = (array, byKey) => Object.fromEntries(array.map(obj => [obj[byKey], obj]));

export const roundFixed = (str, decimals) => parseFloat(str).toFixed(decimals);
export const round = (str, decimals) => parseFloat(parseFloat(str).toFixed(decimals));

