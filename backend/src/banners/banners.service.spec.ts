import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { BannerEntity } from "./banner.entity";
import { BannersRepository } from "./banners.repository";
import { BannersService } from "./banners.service";

describe("BannersService", () => {
  let service: BannersService;
  let readAll: jest.MockedFunction<() => Promise<BannerEntity[]>>;
  let writeAll: jest.MockedFunction<(list: BannerEntity[]) => Promise<void>>;

  beforeEach(async () => {
    readAll = jest.fn();
    writeAll = jest.fn(async () => {
      /* persisted in tests via mock.calls */
    });
    const moduleRef = await Test.createTestingModule({
      providers: [
        BannersService,
        {
          provide: BannersRepository,
          useValue: {
            readAll,
            writeAll,
          },
        },
      ],
    }).compile();

    service = moduleRef.get(BannersService);
  });

  it("findPage returns slice sorted by id ascending", async () => {
    readAll.mockResolvedValue([
      {
        id: 3,
        name: "c",
        imageBase64: "Yw==",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
      {
        id: 1,
        name: "a",
        imageBase64: "YQ==",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ]);
    const page = await service.findPage(0, 1);
    expect(page.total).toBe(2);
    expect(page.items).toHaveLength(1);
    expect(page.items[0].id).toBe(1);
  });

  it("create appends banner with new id and persists", async () => {
    readAll.mockResolvedValue([]);
    const created = await service.create({
      name: " New ",
      imageBase64: "ZGF0YQ==",
    });
    expect(created.id).toBe(1);
    expect(created.name).toBe(" New ");
    expect(writeAll).toHaveBeenCalledTimes(1);
    const saved = writeAll.mock.calls[0][0];
    expect(saved).toHaveLength(1);
    expect(saved[0]?.name).toBe(" New ");
  });

  it("update replaces fields when banner exists", async () => {
    readAll.mockResolvedValue([
      {
        id: 1,
        name: "old",
        imageBase64: "b2xk",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ]);
    const updated = await service.update(1, {
      name: "new",
      imageBase64: "bmV3",
    });
    expect(updated.name).toBe("new");
    expect(updated.imageBase64).toBe("bmV3");
    expect(writeAll).toHaveBeenCalled();
  });

  it("findOne throws when id is missing", async () => {
    readAll.mockResolvedValue([]);
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("remove filters out banner and persists", async () => {
    readAll.mockResolvedValue([
      {
        id: 1,
        name: "a",
        imageBase64: "YQ==",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        name: "b",
        imageBase64: "Yg==",
        createdAt: "2020-01-01T00:00:00.000Z",
      },
    ]);
    await service.remove(1);
    const saved = writeAll.mock.calls[0][0];
    expect(saved).toHaveLength(1);
    expect(saved[0]?.id).toBe(2);
  });
});
