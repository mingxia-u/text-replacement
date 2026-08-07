import { ParsedDocument } from "./parser";
import { ReplaceRule } from "../types";

export function applyReplacements(document: ParsedDocument, rules: ReplaceRule[]): ParsedDocument {
  return {
    ...document,
    wordReplacements: rules
      .filter((rule) => rule.enabled && rule.source)
      .map(({ source, target }) => ({ source, target })),
  };
}
