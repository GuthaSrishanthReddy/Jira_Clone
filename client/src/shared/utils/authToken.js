export const getStoredAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
};

export const storeAuthToken = token => {
  try {
    localStorage.setItem('authToken', token);
  } catch {}
};

export const removeStoredAuthToken = () => {
  try {
    localStorage.removeItem('authToken');
  } catch {}
};
