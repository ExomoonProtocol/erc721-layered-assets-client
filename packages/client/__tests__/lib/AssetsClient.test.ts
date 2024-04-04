import { AssetsClient } from "../../src/lib/AssetsClient";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("AssetsClient", () => {
  afterEach(() => {
    HttpServerMock.instance.clearTemporary();
  });

  describe("fetchCollectionInfo method", () => {
    it("Should fetch collectionInfo", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const collectionInfo = await client.fetchCollectionInfo({});
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
      await client.fetchCollectionInfo({});
      HttpServerMock.instance.clearTemporary();
      const collectionInfo = await client.fetchCollectionInfo({});
      expect(collectionInfo).toMatchSnapshot("a1 - collectionInfo cached");
    });
  });

  describe("fetchTraits method", () => {
    it("Should fetch traits", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const traits = await client.fetchTraits();
      expect(traits).toMatchSnapshot("a1 - traits");
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
      await client.fetchTraits({});
      HttpServerMock.instance.clearTemporary();
      const traits = await client.fetchTraits({});
      expect(traits).toMatchSnapshot("a1 - traits cached");
    });
  });

  describe("fetchAssetsObject method", () => {
    it("Should fetch assets", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const assets = await client.fetchAssetsObject();
      expect(assets).toMatchSnapshot("a1 - assets");
    });

    it("Should fetch assets with cache", async () => {
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
      await client.fetchAssetsObject({});
      HttpServerMock.instance.clearTemporary();
      const assets = await client.fetchAssetsObject({});
      expect(assets).toMatchSnapshot("a1 - assets cached");
    });
  });
});
