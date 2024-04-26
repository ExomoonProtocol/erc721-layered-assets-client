import { AssetsClient } from "../../src/lib/AssetsClient";
import { ConditionalRenderingConfig } from "../../src/models";
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

  describe("getTraitImageUrl method", () => {
    it("Should get trait image url of a normal variation with color", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const url = client.getTraitImageUrl({
        traitName: "Background",
        variationName: "Single Color",
        colorName: "Blue",
      });
      expect(url).toBe(
        "https://example.com/traits/Background/Single Color/Blue.png"
      );
    });

    it("Should get trait image url of a normal variation without color", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const url = client.getTraitImageUrl({
        traitName: "Background",
        variationName: "Custom 1",
      });
      expect(url).toBe(
        "https://example.com/traits/Background/Custom 1/Custom 1.png"
      );
    });

    it("Should get trait image url with conditional rendering config", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/2/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const url = client.getTraitImageUrl({
        traitName: "Cover",
        variationName: "Rectangle",
        conditionalTraitConfig: new ConditionalRenderingConfig({
          traitName: "Shape",
          variationName: "Rectangle",
        }),
      });
      expect(url).toBe(
        "https://example.com/traits/Cover/Shape_Rectangle/Rectangle/Rectangle.png"
      );
    });

    it("Should throw an error if trait not found", async () => {
      const client = new AssetsClient({ baseUrl: "https://example.com" });
      expect(() =>
        client.getTraitImageUrl({
          traitName: "Background",
          variationName: "Single Color",
          colorName: "Blue",
        })
      ).toThrow("Trait Background not found");
    });
  });

  describe("getPreviewImageUrl method", () => {
    it("Should get preview image url of a normal variation", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/1/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const url = client.getPreviewImageUrl({
        traitName: "Background",
        variationName: "Single Color",
      });
      expect(url).toBe(
        "https://example.com/traits/Background/Single Color/thumbnail.png"
      );
    });

    it("Should get preview image with conditional rendering config", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/2/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const url = client.getPreviewImageUrl({
        traitName: "Cover",
        variationName: "Rectangle",
        conditionalTraitConfig: new ConditionalRenderingConfig({
          traitName: "Shape",
          variationName: "Rectangle",
        }),
      });
      expect(url).toBe(
        "https://example.com/traits/Cover/Shape_Rectangle/Rectangle/thumbnail.png"
      );
    });
  });

  describe("getTraitsGroups method", () => {
    it("Should get traits groups", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com",
          filePath: path.resolve(__dirname, "../assets/2/"),
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      await client.fetchAssetsObject();
      const groups = client.getTraitsGroups();
      expect(groups).toMatchSnapshot();
    });
  });
});
