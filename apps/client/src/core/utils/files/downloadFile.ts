export async function downloadFile(fileName: string) {
  const response = await fetch(`files/${encodeURIComponent(fileName)}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw await response.json();
  }

  return response.text();
}
