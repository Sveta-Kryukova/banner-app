import { InternalServerErrorException } from "@nestjs/common";
import { describe, expect, it } from "@jest/globals";
import { parseStoredBanners } from "./banner-parsing";

describe("parseStoredBanners", () => {
  it("throws when root JSON is not an array", () => {
    expect(() => parseStoredBanners({})).toThrow(InternalServerErrorException);
  });

  it("returns empty array for empty JSON array", () => {
    expect(parseStoredBanners([])).toEqual([]);
  });

  it("parses valid rows and assigns sequential ids when missing", () => {
    const result = parseStoredBanners([
      { id: 2, name: "B", imageBase64: "YmI=", createdAt: "2020-01-01T00:00:00.000Z" },
      { name: "A", imageBase64: "YWE=", createdAt: "2021-01-01T00:00:00.000Z" },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 2,
      name: "B",
      imageBase64: "YmI=",
    });
    expect(result[1]).toMatchObject({
      id: 3,
      name: "A",
      imageBase64: "YWE=",
    });
  });

  it("skips invalid or incomplete objects", () => {
    const result = parseStoredBanners([
      null,
      { name: "X" },
      { name: "Ok", imageBase64: "abcd", createdAt: "2020-01-01T00:00:00.000Z" },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Ok");
  });
});
