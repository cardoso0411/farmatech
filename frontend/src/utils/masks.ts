function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

export function maskCpf(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function maskRg(value: string) {
  const digits = digitsOnly(value).slice(0, 9);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return digits.replace(/^(\d{2})(\d+)/, '$1.$2');
  return digits.replace(/^(\d{2})(\d{3})(\d{0,4})/, (_match, a, b, c) =>
    c ? `${a}.${b}.${c}` : `${a}.${b}`
  );
}

export function maskCnpj(value: string) {
  const digits = digitsOnly(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function maskCep(value: string) {
  const digits = digitsOnly(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function maskPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 10);

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }

  if (digits.length <= 6) {
    return digits.replace(/^(\d{2})(\d+)/, '($1) $2');
  }

  return digits.replace(/^(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
}

export function maskMobilePhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }

  if (digits.length <= 7) {
    return digits.replace(/^(\d{2})(\d+)/, '($1) $2');
  }

  return digits.replace(/^(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
}
