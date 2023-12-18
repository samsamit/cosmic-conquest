import { describe, expect, test } from "bun:test";
import { createProjectile } from "./projectile.model";

describe("projectile", () => {
  test("move", () => {
    const projectile = createProjectile({
      position: { x: 0, y: 0 },
      direction: "N",
      speed: 1,
      mass: 1,
    });
    const distance = 1;
    const expected = { x: 0, y: -1 };
    const actual = projectile.move(distance).position;
    expect(actual).toEqual(expected);
  });

  test("getHitbox", () => {
    const projectile = createProjectile({
      position: { x: 0, y: 0 },
      direction: "N",
      speed: 1,
      mass: 1,
    });
    const expected = [{ x: 0, y: 0 }];
    const actual = projectile.getHitbox();
    expect(actual).toEqual(expected);
  });
});
