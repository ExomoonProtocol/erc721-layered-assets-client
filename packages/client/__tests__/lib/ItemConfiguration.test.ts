import { AssetsClient } from "../../src/lib/AssetsClient";
import {
  ItemConfiguration,
  ItemConfigurationStatus,
} from "../../src/lib/ItemConfiguration";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("ItemConfiguration class", () => {
  let client: AssetsClient;
  let client2: AssetsClient;

  beforeEach(() => {
    HttpServerMock.instance.clearTemporary();

    HttpServerMock.instance.addTemporaryResponseMappings([
      {
        url: "https://example.com",
        filePath: path.resolve(__dirname, "../assets/1/"),
      },
    ]);

    client = new AssetsClient({
      baseUrl: "https://example.com",
      useCache: true,
    });

    HttpServerMock.instance.addTemporaryResponseMappings([
      {
        url: "https://example2.com",
        filePath: path.resolve(__dirname, "../assets/2/"),
      },
    ]);

    client2 = new AssetsClient({
      baseUrl: "https://example2.com",
      useCache: true,
    });
  });

  describe("load method", () => {
    it("Should load item configuration", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      expect(itemConfiguration.status).toBe(ItemConfigurationStatus.Ready);
    });
  });

  describe("setVariation method", () => {
    it("Should set variation with a speciic color", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });

    it("Should set variation with color without specifying a color", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color");
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });

    it("Should set variation with no color", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Custom 1");
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });

    it("Should throw an error if trying to set color for a variation that doesn't support it", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      expect(() =>
        itemConfiguration.setVariation("Background", "Custom 1", "Blue")
      ).toThrow();
    });
  });

  describe("removeVariation method", () => {
    it("Should remove variation", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");

      itemConfiguration.removeVariation("Cover");
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });

    it("Should throw an error if trying to remove a required variation", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");

      expect(() => itemConfiguration.removeVariation("Background")).toThrow();
    });

    it("Should throw an error if trying to remove a variation that doesn't exist", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      expect(() => itemConfiguration.removeVariation("Cover")).toThrow();
      expect(() =>
        itemConfiguration.removeVariation("Unknown Trait")
      ).toThrow();
    });
  });

  describe("getTraitsUrls method", () => {
    it("Should get trait urls - single trait", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });

    it("Should get trait urls - multiple traits", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });

    it("Should get trait urls - multiple traits with conditional rendering", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });
  });

  describe("renderMetadata method", () => {
    it("Should render metadata", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");
      expect(itemConfiguration.renderMetadata().serialize()).toMatchSnapshot();
    });
  });

  describe("buildFromLayersDataString method", () => {
    it("Should build item configuration from layers data string", async () => {
      const itemConfiguration =
        await ItemConfiguration.buildFromLayersDataString("0x00", client2);

      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });
  });
});
