export function getImgUrl(url?: string) {
  if (!url) return '';

  if (url.startsWith('http')) {
    return url;
  }

  return `http://192.168.188.199:8009${url}`;
}