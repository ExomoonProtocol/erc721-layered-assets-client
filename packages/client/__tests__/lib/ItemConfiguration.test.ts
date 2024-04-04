import { AssetsClient } from "../../src/lib/AssetsClient";
import {
  ItemConfiguration,
  ItemConfigurationStatus,
} from "../../src/lib/ItemConfiguration";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("ItemConfiguration class", () => {
  let client: AssetsClient;

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
});
