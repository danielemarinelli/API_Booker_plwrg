/*
TC -> create booking
request type -> POST
request body -> Static on header

*/


import{test,expect} from "@playwright/test"

test("Create POST request using static body @POST", async ({request}) =>{
    //payload to send with POST request
    let body ={
        "firstname": "Josh",
        "lastname": "Allen",
        "totalprice": 17,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2025-01-12",
            "checkout": "2026-01-03"
        },
        "additionalneeds": "Super Bowl win"
    }

    // send POST request with static body
    //const response = await request.post("https://restful-booker.herokuapp.com/booking",{data:body}); 
    //instead of writting the BaseURL in every test, we can specify it on the playwright.config.ts file (line 29) and in the request specify only the endpoint
    //const response = await request.post("/booking",{data:body, ignoreHTTPSErrors: true});
    const response = await request.post("/booking",{data:body});
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
    //VALIDATE THE OBJECT UNDER key booking
    const bookingOjbect = responseBody.booking;
    expect(bookingOjbect).toMatchObject({
        "firstname": "Josh",
        "lastname": "Allen",
        "totalprice": 17,
        "depositpaid": true,
        //"bookingdates": {  -----> NESTED OBJECT validation in separate expect
        //    "checkin": "2025-01-12",
        //    "checkout": "2026-01-03"
        //},
        "additionalneeds": "Super Bowl win",
    }); 

    //validate nested json ojbect
    expect(bookingOjbect.bookingdates).toMatchObject({
        "checkin": "2025-01-12",
        "checkout": "2026-01-03"
    });

})



