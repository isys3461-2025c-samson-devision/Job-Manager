export function saveSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function loadSession(key) {
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function deleteSession(key) {
  sessionStorage.removeItem(key);
}
