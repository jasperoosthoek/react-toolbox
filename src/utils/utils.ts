export const isEmpty = (value: unknown) =>
  value === undefined
  || value === null
  || value === false
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0);


export const snakeToCamelCase = (str: string) => str.replace(
  /([-_])(.)/g,
  (match, separator, char) => char.toUpperCase()
);

export const camelToSnakeCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insert underscore between lowercase and uppercase
    .replace(/([a-zA-Z])([0-9])/g, '$1_$2') // Insert underscore between letter and number
    .replace(/([0-9])([a-zA-Z])/g, '$1_$2') // Insert underscore between number and letter
    .toUpperCase();
};

export const pluralToSingle = (str: string) => {
  if (str.slice(-1) !== 's' && str.slice(-1) !== 'S') {
    // This string is not plural: keep it unaltered
    return str;
  } else if (str.slice(-3).toLowerCase() === 'ies') {
    // Handle special case of categories (case insensitive)
    const prefix = str.slice(0, -3);
    const lastChar = str.slice(-3, -2); // Get the character before 'ies'
    return `${prefix}${lastChar === lastChar.toUpperCase() ? 'Y' : 'y'}`;
  } else {
    // Standard plural
    return str.slice(0, -1);
  }
}

export const arrayToObject = <T extends any[]>(array: T, byKey: string) => Object.fromEntries(array.map(obj => [obj[byKey], obj]));

export const roundFixed = (str: string | number, decimals?: number) => parseFloat(`${str}`).toFixed(decimals || 0);
export const round = (str: string | number, decimals?: number) => parseFloat(parseFloat(`${str}`).toFixed(decimals || 0));

export type DownloadFileOptions = {
  headers?: Record<string, string>;
  fetchFn?: typeof fetch;
}

export const downloadFile = async (url: string, filename: string, options: DownloadFileOptions = {}) => {
  try {
    const fetchFn = options.fetchFn || fetch;
    const response = await fetchFn(url, {
      method: 'GET',
      headers: options.headers || {},
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};