export function getImgUrl(url?: string) {
  if (!url) return '';

  if (url.startsWith('http')) {
    return url;
  }

  return `http://localhost:8009${url}`;
}