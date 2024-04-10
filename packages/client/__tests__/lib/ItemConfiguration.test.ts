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
  let client3: AssetsClient;
  let client4: AssetsClient;

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

    HttpServerMock.instance.addTemporaryResponseMappings([
      {
        url: "https://example3.com",
        filePath: path.resolve(__dirname, "../assets/3/"),
      },
    ]);

    client3 = new AssetsClient({
      baseUrl: "https://example3.com",
      useCache: true,
    });

    HttpServerMock.instance.addTemporaryResponseMappings([
      {
        url: "https://example4.com",
        filePath: path.resolve(__dirname, "../assets/4/"),
      },
    ]);

    client4 = new AssetsClient({
      baseUrl: "https://example4.com",
      useCache: true,
    });
  });

  describe("load method", () => {
    it("Should load item configuration", async () => {
      const itemConfiguration = new ItemConfiguration(client);
      await itemConfiguration.load();
      expect(itemConfiguration.status).toBe(ItemConfigurationStatus.Ready);
    });

    it("Should load initial item configuration", async () => {
      const itemConfiguration = new ItemConfiguration(client2);
      await itemConfiguration.load();
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
      expect(itemConfiguration.status).toBe(ItemConfigurationStatus.Ready);
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });

    it("Should get error if required trait is missing in initial configuration", async () => {
      const itemConfiguration = new ItemConfiguration(client4);

      await expect(itemConfiguration.load()).rejects.toThrow();
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

  describe("historyUndo method", () => {
    it("Should undo the last change", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");
      const previousTraitConfigurations = itemConfiguration.traitConfigurations;

      itemConfiguration.historyUndo();
      expect(itemConfiguration.traitConfigurations).toEqual(
        previousTraitConfigurations
      );
    });

    it("Should do nothing if there is no operation to undo", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      const previousTraitConfigurations = itemConfiguration.traitConfigurations;

      itemConfiguration.historyUndo();

      expect(itemConfiguration.traitConfigurations).toEqual(
        previousTraitConfigurations
      );
    });
  });

  describe("historyRedo method", () => {
    it("Should redo the last change", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");

      const previousTraitConfigurations = itemConfiguration.traitConfigurations;

      itemConfiguration.historyUndo();

      itemConfiguration.historyRedo();
      expect(itemConfiguration.traitConfigurations).toEqual(
        previousTraitConfigurations
      );
    });

    it("Should do nothing if there is no operation to redo", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");

      itemConfiguration.historyUndo();
      itemConfiguration.historyRedo();
      const previousTraitConfigurations = itemConfiguration.traitConfigurations;

      itemConfiguration.historyRedo();
      expect(itemConfiguration.traitConfigurations).toEqual(
        previousTraitConfigurations
      );
    });

    it("Should redo multiple changes", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");

      const previousTraitConfigurations = itemConfiguration.traitConfigurations;

      itemConfiguration.historyUndo();
      itemConfiguration.historyUndo();

      itemConfiguration.historyRedo();
      itemConfiguration.historyRedo();
      expect(itemConfiguration.traitConfigurations).toEqual(
        previousTraitConfigurations
      );
    });
  });

  describe("removeVariation method", () => {
    it("Should remove variation", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
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
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      expect(() => itemConfiguration.removeVariation("Cover")).toThrow();
      expect(() =>
        itemConfiguration.removeVariation("Unknown Trait")
      ).toThrow();
    });
  });

  describe("buildRandomItemConfiguration", () => {
    it("should build configuration with all required traits and some optional ones", async () => {
      const randomMock = jest.spyOn(global.Math, "random");
      randomMock.mockReturnValueOnce(0.2); // Pick the first variation of background
      randomMock.mockReturnValueOnce(0.6); // Pick background color
      randomMock.mockReturnValueOnce(0.4); // Decides if shape should be included
      randomMock.mockReturnValueOnce(0.4); // Pick a variation of shape
      randomMock.mockReturnValueOnce(0.2); // Decides if cover should be included
      randomMock.mockReturnValueOnce(0.3); // Pick a variation of cover
      randomMock.mockReturnValueOnce(0.6); // Pick cover color

      const itemConfiguration =
        await ItemConfiguration.buildRandomItemConfiguration(client2);

      // Match the snapshot
      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();

      randomMock.mockRestore();
    });
  });

  describe("getTraitsUrls method", () => {
    it("Should get trait urls - single trait", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });

    it("Should get trait urls - multiple traits", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });

    it("Should get trait urls - multiple traits with conditional rendering", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
      await itemConfiguration.load();
      itemConfiguration.setVariation("Shape", "Circle");
      itemConfiguration.setVariation("Background", "Single Color", "Blue");
      itemConfiguration.setVariation("Cover", "Custom Cover 1");
      expect(itemConfiguration.getTraitsUrls()).toMatchSnapshot();
    });
  });

  describe("renderMetadata method", () => {
    it("Should render metadata", async () => {
      const itemConfiguration = new ItemConfiguration(client3);
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
        await ItemConfiguration.buildFromLayersDataString("0x00", client3);

      expect(itemConfiguration.traitConfigurations).toMatchSnapshot();
    });
  });
});
