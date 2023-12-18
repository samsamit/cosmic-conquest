import { describe, expect, test } from "bun:test";
import {
  getForwardPosition,
  getOppositeDirection,
  isTurnAllowed,
} from "./movement.logic";

describe("movement", () => {
  test("getForwardPosition", () => {
    const position = { x: 0, y: 0 };
    const direction = "N";
    const distance = 1;
    const expected = { x: 0, y: -1 };
    const actual = getForwardPosition(position, direction, distance);
    expect(actual).toEqual(expected);
  });
  test("isTurnAllowed", () => {
    const start = "N";
    const end = "S";
    const maxTurnRadius = 3;
    const expected = false;
    const actual = isTurnAllowed(start, end, maxTurnRadius);
    expect(actual).toEqual(expected);
  });
  test("getOppositeDirection", () => {
    expect(getOppositeDirection("N")).toEqual("S");
    expect(getOppositeDirection("SW")).toEqual("NE");
  });
});
