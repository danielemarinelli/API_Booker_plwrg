/*
    Pre-requisites:
    install package below with following command:
        npm install --save-dev playwright ajv

    AJV is used for JSON Schema validation
*/
import { test, expect } from "@playwright/test";
import Ajv from 'ajv'
import fs from 'fs';

test("JSON Schema validation @SCHEMA", async ({ request }) => {

    const resp = await request.get("https://mocktarget.apigee.net/json",
        { ignoreHTTPSErrors: true });
    const respBody = await resp.json();
    console.log(respBody)

    // Validate the response against the Schema Validation
    // from postman launch a GET to understand the response body
    // tool to retrive the schema --->   https://transform.tools/json-to-json-schema
    
    const schema = {
        "type": "object",
        "properties": {
            "firstName": {
                "type": "string"
            },
            "lastName": {
                "type": "string"
            },
            "city": {
                "type": "string"
            },
            "state": {
                "type": "string"
            }
        },
        "required": [
            "firstName",
            "lastName",
            "city",
            "state"
        ]
    };

    const ajv = new Ajv();    // create Ajv object
    const val = ajv.compile(schema)   // returns a function ValidateFunction
    let isvalid = val(respBody);    // return a boolean, checks if the response body follows the schema or not
    expect(isvalid).toBeTruthy();

});



test("JSON Schema validation - from file @SCHEMA", async ({ request }) => {

    const resp = await request.get("https://jsonplaceholder.typicode.com/posts/1",
        { ignoreHTTPSErrors: true });
    const respBody = await resp.json();
    console.log(respBody)

    // Validate the response against the Schema Validation
    // from postman launch a GET to understand the response body
    // tool to retrive the schema --->   https://transform.tools/json-to-json-schema
    const filePath="./testdata/JSON_Schema.json"
    const schema=JSON.parse(fs.readFileSync(filePath,'utf-8'));

    const ajv = new Ajv();    // create Ajv object
    const val = ajv.compile(schema)   // returns a function ValidateFunction
    let isvalid = val(respBody);    // return a boolean, checks if the response body follows the schema or not
    expect(isvalid).toBeTruthy();

});






