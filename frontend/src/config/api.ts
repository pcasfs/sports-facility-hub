// VITE_ 환경변수는 브라우저에 공개되므로 비밀정보를 넣지 않습니다.
export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
).replace(/\/+$/, '');
