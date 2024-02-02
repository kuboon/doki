import { test, Doki } from "./doki.js"
import { assertEquals } from "https://deno.land/std@0.214.0/assert/mod.ts";

Deno.test("isoweek 2022-12-31", () => {
  const d = new Date("2022-12-31");
  const iso = test.getISOWeek(d);
  assertEquals(iso.year, 2022);
  assertEquals(iso.week, 52);
});
Deno.test({
  name: "isoweek 2022-01-02",
  fn() {
    const d = new Date("2022-01-02");
    const iso = test.getISOWeek(d);
    assertEquals(iso.year, 2022);
    assertEquals(iso.week, 0);
  }
});
Deno.test({
  name: "isoweek 2022W52",
  fn() {
    const d = test.getDateFromISOWeek(2022, 52);
    assertEquals(d.toISOString(), "2022-12-26T00:00:00.000Z");
  }
});
Deno.test("isoweek 2023W00", () => {
  const d = test.getDateFromISOWeek(2023, 0);
  assertEquals(d.toISOString(), "2022-12-26T00:00:00.000Z");
});
Deno.test({
  name: "isoweek 2023W01",
  fn() {
    const d = test.getDateFromISOWeek(2023, 1);
    assertEquals(d.toISOString(), "2023-01-02T00:00:00.000Z");
  }
});
Deno.test({
  name: "isoweek 2022W01",
  fn() {
    const d = test.getDateFromISOWeek(2022, 1);
    assertEquals(d.toISOString(), "2022-01-03T00:00:00.000Z");
  }
});
