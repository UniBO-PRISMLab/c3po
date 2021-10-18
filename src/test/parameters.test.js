const { test } = require("jest-circus");
const tdFactory = require("../factory/tdFactory").default;

const mockParameterTests = [];
const factoryMockParameterTests = (operation, expect) => ({
  operation: operation,
  expect: expect,
});

mockParameterTests.push(
  factoryMockParameterTests(
    {
      tags: ["pet"],
      summary: "Update an existing pet",
      description: "Update an existing pet by Id",
      operationId: "updatePet",
      requestBody: {
        description: "Update an existent pet in the store",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Pet" },
          },
          "application/xml": {
            schema: { $ref: "#/components/schemas/Pet" },
          },
          "application/x-www-form-urlencoded": {
            schema: { $ref: "#/components/schemas/Pet" },
          },
        },
        required: true,
      },
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/xml": {
              schema: { $ref: "#/components/schemas/Pet" },
            },
            "application/json": {
              schema: { $ref: "#/components/schemas/Pet" },
            },
          },
        },
        400: { description: "Invalid ID supplied" },
        404: { description: "Pet not found" },
        405: { description: "Validation exception" },
      },
      security: [{ petstore_auth: ["write:pets", "read:pets"] }],
    },
    false
  )
);
mockParameterTests.push(
  factoryMockParameterTests(
    {
      tags: ["pet"],
      summary: "Finds Pets by tags",
      description:
        "Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.",
      operationId: "findPetsByTags",
      parameters: [
        {
          name: "tags",
          in: "query",
          description: "Tags to filter by",
          required: false,
          explode: true,
          schema: { type: "array", items: { type: "string" } },
        },
      ],
      responses: {
        200: {
          description: "successful operation",
          content: {
            "application/xml": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Pet" },
              },
            },
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Pet" },
              },
            },
          },
        },
        400: { description: "Invalid tag value" },
      },
      security: [{ petstore_auth: ["write:pets", "read:pets"] }],
    },
    true
  )
);
mockParameterTests.push(
  factoryMockParameterTests(
    {
      tags: ["pet"],
      summary: "Updates a pet in the store with form data",
      description: "",
      operationId: "updatePetWithForm",
      parameters: [
        {
          name: "petId",
          in: "path",
          description: "ID of pet that needs to be updated",
          required: true,
          schema: { type: "integer", format: "int64" },
        },
        {
          name: "name",
          in: "query",
          description: "Name of pet that needs to be updated",
          schema: { type: "string" },
        },
        {
          name: "status",
          in: "query",
          description: "Status of pet that needs to be updated",
          schema: { type: "string" },
        },
      ],
      responses: { 405: { description: "Invalid input" } },
      security: [{ petstore_auth: ["write:pets", "read:pets"] }],
    },
    true
  )
);
describe("isParameter test", () => {
  mockParameterTests.forEach((mockParameterTest, i) => {
    it(`isParameter - #${i + 1}`, () => {
      expect(tdFactory.isParameters(mockParameterTest.operation)).toBe(
        mockParameterTest.expect
      );
    });
  });
});

//there are *far* better ways to do a deep copy
const mockMandatoryParameterTests = JSON.parse(JSON.stringify(mockParameterTests));

mockMandatoryParameterTests[1].expect = false;

describe("isMandatoryParameters()", () => {
  mockMandatoryParameterTests.forEach((mockParameterTest, i) => {
    it(`isMandatoryParameters #${i + 1}`, () => {
      expect(tdFactory.isMandatoryParameters(mockParameterTest.operation)).toBe(
        mockParameterTest.expect
      );
    });
  });
});
