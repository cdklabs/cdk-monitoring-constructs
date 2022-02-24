import { Hello } from "../lib";

test("hello", () => {
  expect(new Hello().sayHello()).toBe("hello, world!");
});
