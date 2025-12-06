export type ParseErrorType = "syntax" | "semantic" | "validation";

export class PlantUmlParseError extends Error {
  line: number;
  type: ParseErrorType;

  constructor(line: number, message: string, type: ParseErrorType = "syntax") {
    super(message);
    this.line = line;
    this.type = type;
    this.name = "PlantUmlParseError";
  }
}
