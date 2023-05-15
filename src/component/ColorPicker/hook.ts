export function unsignedValidate(value: string, prevent: Function) {
  let validate = Number(value);
  if (Number.isNaN(validate) || validate < 0) prevent();
}
