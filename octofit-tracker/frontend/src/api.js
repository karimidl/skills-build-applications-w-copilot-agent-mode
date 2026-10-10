const codespaceName =
  import.meta.env.VITE_CODESPACE_NAME ||
  window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/)?.[1]

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000')

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed (${response.status} ${response.statusText})`)
  }

  return response.json()
}
