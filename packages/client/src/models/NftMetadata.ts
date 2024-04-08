import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { ModelsUtils } from "../utils";

/**
 * Attribute interface
 */
export interface IAttribute {
  /**
   * Trait type
   * @type {string}
   */
  trait_type: string;

  /**
   * Value
   * @type {string}
   */
  value: string;
}

/**
 * NFT Metadata interface
 */
export interface INftMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<IAttribute>;
}

/**
 * NFT Metadata class.
 * Supports variables substitution in name, description, image and attributes.
 */
@JsonObject()
export class NftMetadata implements INftMetadata {
  @JsonProperty()
  public name: string;

  @JsonProperty()
  public description: string;

  @JsonProperty()
  public image: string;

  @JsonProperty()
  public attributes: Array<IAttribute>;

  private _variables: Record<string, string | number>;

  constructor() {
    this.attributes = [];
    this._variables = {};
  }

  /**
   * Set a variable to be used in substitution
   * @param key Variable key
   * @param value Variable value
   * @returns void
   */
  public setVariable(key: string, value: string | number): void {
    if (!this._variables) {
      this._variables = {};
    }
    this._variables[key] = value;
  }

  /**
   * Get a variable value
   * @param key Variable key
   * @returns Variable value
   */
  public getVariable(key: string): string | number | undefined {
    if (!this._variables) {
      return undefined;
    }
    return this._variables[key];
  }

  /**
   * Get all variables
   * @returns Variables
   */
  public getVariables(): Record<string, string | number> {
    return this._variables;
  }

  /**
   * Set all variables
   * @param variables Variables
   * @returns void
   */
  public setVariables(variables: Record<string, string | number>): void {
    this._variables = variables;
  }

  /**
   * Substitute variables in text
   * @param text Text to substitute variables in
   * @returns Substituted text
   */
  private substitute(text: string): string {
    const regex = /{{([^}]+)}}/g;
    return text.replace(regex, (match, key) => {
      const value = this.getVariable(key);
      return value ? value.toString() : match;
    });
  }

  /**
   * Substitute variables in name, description, image and attributes
   * N.B. This method modifies the object: it substitutes variables in place, and does not return a new object.
   * @returns void
   */
  public substituteVariables(): void {
    if (!this._variables) {
      return;
    }
    this.name = this.substitute(this.name);
    this.description = this.substitute(this.description);
    this.image = this.substitute(this.image);
    this.attributes.forEach((attribute) => {
      attribute.value = this.substitute(attribute.value);
    });
  }

  /**
   * Serialize the object
   * @returns Serialized object
   */
  public serialize(): object {
    return ModelsUtils.instance.serializer.serialize(this) || {};
  }
}
