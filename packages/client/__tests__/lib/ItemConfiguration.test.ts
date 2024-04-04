import { AssetsClient } from "../../src/lib/AssetsClient";
import {
  ItemConfiguration,
  ItemConfigurationStatus,
} from "../../src/lib/ItemConfiguration";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("ItemConfiguration class", () => {
  let client: AssetsClient;

  afterEach(() => {
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
});
