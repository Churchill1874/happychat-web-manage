// src/utils/date.ts
export function calcAge(birth?: string): string {
  if (!birth) return '-';

  const birthDate = new Date(birth);
  if (Number.isNaN(birthDate.getTime())) return '-';

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // 还没过生日，年龄 -1
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? `${age} 岁` : '-';
}
