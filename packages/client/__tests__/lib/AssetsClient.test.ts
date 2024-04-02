import { AssetsClient } from "../../src/lib/AssetsClient";
import { HttpServerMock } from "../HttpServerMock";
import path from "path";

describe("AssetsClient", () => {
  afterEach(() => {
    HttpServerMock.instance.clearTemporary();
  });

  describe("getCollectionInfo method", () => {
    it("Should read", async () => {
      HttpServerMock.instance.addTemporaryResponseMappings([
        {
          url: "https://example.com/collection.json",
          filePath: path.resolve(__dirname, "../assets/1/collection.json"),
          fileEncoding: "utf-8",
        },
      ]);

      const client = new AssetsClient({ baseUrl: "https://example.com" });
      const result = await client.getCollectionInfo();
      console.log(result);
      // expect(result).toEqual({
      //   name: "test",
      //   version: "1.0.0",
      // });
    });
  });
});
