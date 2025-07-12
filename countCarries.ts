export function countCarries(num1: number, num2: number) {
  const digits_1 = String(num1).split("").reverse();
  const digits_2 = String(num2).split("").reverse();

  const [largestDigits, lowestDigits] =
    digits_1.length > digits_2.length
      ? [digits_1, digits_2]
      : [digits_2, digits_1];

  let carry = 0;
  let carryCount = 0;

  largestDigits.forEach((digit, i) => {
    const sum = Number(digit) + Number(lowestDigits[i]) + carry;

    if (sum >= 10) {
      carry = 1;
      carryCount++;
    } else {
      carry = 0;
    }
  });

  return carryCount;
}
