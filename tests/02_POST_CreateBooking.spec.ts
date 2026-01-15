/*
TC -> create booking
request type -> POST
request body -> JSON

*/


import{test,expect} from "@playwright/test"
import fs from 'fs';

test("Create POST request using JSON FILE body @POST", async ({request}) =>{
    //payload to send with POST request from JSON file
    const jsonFile = "./testdata/post_request_body.json";
    const jsonBody:any = JSON.parse(fs.readFileSync(jsonFile,'utf-8'));
  

    // send POST request from json file
    //const response = await request.post("https://restful-booker.herokuapp.com/booking",{data:body}); 
    //instead of writting the BaseURL in every test, we can specify it on the playwright.config.ts file (line 29) and in the request specify only the endpoint
    const response = await request.post("/booking",{data:jsonBody});
    
    //extract the body response to validate the fields
    const responseBody = await response.json();
    console.log(responseBody)

    //validate StatusCode 200 OK
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200)
    //validate the attributes of the json response body
    expect(responseBody).toHaveProperty("bookingid")
    expect(responseBody).toHaveProperty("booking")
    expect(responseBody).toHaveProperty("booking.additionalneeds")

    //extract the data from the json response body using JSONPATH method
    //jsonpathfinder.com helps to extract the path
    //VALIDATE THE RESPONSE fields from the json file
    const bookingOjbect = responseBody.booking;
    expect(bookingOjbect).toMatchObject({
        "firstname": jsonBody.firstname,
        "lastname": jsonBody.lastname,
        "totalprice": jsonBody.totalprice,
        "depositpaid": jsonBody.depositpaid,
        "additionalneeds": jsonBody.additionalneeds
    }); 

    //validate nested json ojbect
    expect(bookingOjbect.bookingdates).toMatchObject({
        "checkin": jsonBody.bookingdates.checkin,
        "checkout": jsonBody.bookingdates.checkout
    });

})



