import { AssetsClient } from "../../src/lib/AssetsClient";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("AssetsClient", () => {
  afterEach(() => {
    HttpServerMock.instance.clearTemporary();
  });

  describe("getCollectionInfo method", () => {
    it("Should fetch collectionInfo", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const collectionInfo = await client.getCollectionInfo({});
      expect(collectionInfo).toMatchSnapshot("a1 - collectionInfo");
    });

    it("Should fetch collectionInfo with cache", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({
        baseUrl: "https://example.com",
        useCache: true,
      });
      await client.getCollectionInfo({});
      HttpServerMock.instance.clearTemporary();
      const collectionInfo = await client.getCollectionInfo({});
      expect(collectionInfo).toMatchSnapshot("a2 - collectionInfo");
    });
  });

  describe("getTraits method", () => {
    it("Should fetch traits", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const traits = await client.getTraits({});
      expect(traits).toMatchSnapshot("a3 - traits");
    });

    it("Should fetch traits with cache", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({
        baseUrl: "https://example.com",
        useCache: true,
      });
      await client.getTraits({});
      HttpServerMock.instance.clearTemporary();
      const traits = await client.getTraits({});
      expect(traits).toMatchSnapshot("a4 - traits");
    });
  });
});
