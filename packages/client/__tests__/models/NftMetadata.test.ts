import { NftMetadata } from "../../src/models/NftMetadata";

describe("NftMetadata class", () => {
  let nftMetadata: NftMetadata;

  beforeEach(() => {
    nftMetadata = new NftMetadata();
  });

  describe("setVariable method", () => {
    it("Should set a variable", () => {
      nftMetadata.setVariable("key", "value");
      expect(nftMetadata.getVariable("key")).toBe("value");
    });

    it("Should replace a variable", () => {
      nftMetadata.setVariable("key", "value");
      nftMetadata.setVariable("key", "value2");
      expect(nftMetadata.getVariable("key")).toBe("value2");
    });
  });

  describe("getVariable method", () => {
    it("Should get a variable", () => {
      nftMetadata.setVariable("key", "value");
      expect(nftMetadata.getVariable("key")).toBe("value");
    });

    it("Should return undefined if variable does not exist", () => {
      expect(nftMetadata.getVariable("key")).toBeUndefined();
    });
  });

  describe("getVariables method", () => {
    it("Should get all variables", () => {
      nftMetadata.setVariable("key", "value");
      expect(nftMetadata.getVariables()).toEqual({ key: "value" });
    });

    it("Should return an empty object if there are no variables", () => {
      expect(nftMetadata.getVariables()).toEqual({});
    });
  });

  describe("setVariables method", () => {
    it("Should set all variables", () => {
      nftMetadata.setVariables({ key: "value" });
      expect(nftMetadata.getVariables()).toEqual({ key: "value" });
    });

    it("Should replace all variables", () => {
      nftMetadata.setVariables({ key: "value" });
      nftMetadata.setVariables({ key2: "value2" });
      expect(nftMetadata.getVariables()).toEqual({ key2: "value2" });
    });
  });

  describe("substitute method (private)", () => {
    it("Should substitute variables in text", () => {
      nftMetadata.setVariable("key", "value");
      // @ts-ignore
      expect(nftMetadata.substitute("{{key}}")).toBe("value");
    });

    it("Should not substitute missing variables in text", () => {
      // @ts-ignore
      expect(nftMetadata.substitute("{{key}}")).toBe("{{key}}");
    });
  });

  describe("substituteVariables method", () => {
    it("Should substitute variables in name, description, image and attributes", () => {
      nftMetadata.setVariables({ key: "value" });
      nftMetadata.name = "{{key}}";
      nftMetadata.description = "{{key}}";
      nftMetadata.image = "{{key}}";
      nftMetadata.attributes = [{ trait_type: "key", value: "{{key}}" }];
      nftMetadata.substituteVariables();
      expect(nftMetadata.name).toBe("value");
      expect(nftMetadata.description).toBe("value");
      expect(nftMetadata.image).toBe("value");
      expect(nftMetadata.attributes).toEqual([
        { trait_type: "key", value: "value" },
      ]);
    });

    it("Should not substitute missing variables in name, description, image and attributes", () => {
      nftMetadata.name = "{{key}}";
      nftMetadata.description = "{{key}}";
      nftMetadata.image = "{{key}}";
      nftMetadata.attributes = [{ trait_type: "key", value: "{{key}}" }];
      nftMetadata.substituteVariables();
      expect(nftMetadata.name).toBe("{{key}}");
      expect(nftMetadata.description).toBe("{{key}}");
      expect(nftMetadata.image).toBe("{{key}}");
      expect(nftMetadata.attributes).toEqual([
        { trait_type: "key", value: "{{key}}" },
      ]);
    });
  });
});
