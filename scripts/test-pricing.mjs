import assert from "node:assert/strict";
import test from "node:test";
import { won, wonDigits } from "../src/lib/pricing.ts";

test("금액을 줄여 써도 만·천·백 자리의 값이 유지된다", () => {
  for (const [amount, label] of [
    [0, "0원"], [1100, "1천1백원"], [13400, "1만3천4백원"],
    [16500, "1만6천5백원"], [28400, "2만8천4백원"], [30000, "3만원"],
    [44000, "4만4천원"], [50800, "5만8백원"], [88000, "8만8천원"],
    [99000, "9만9천원"], [264000, "26만4천원"], [690000, "69만원"],
  ]) {
    assert.equal(won(amount), label);
    assert.equal(wonDigits(amount) + "원", label);
  }
});

test("잘못된 금액을 반올림해 표시하지 않는다", () => {
  for (const amount of [-1, 88.8, NaN, Infinity]) assert.throws(() => won(amount), RangeError);
});
