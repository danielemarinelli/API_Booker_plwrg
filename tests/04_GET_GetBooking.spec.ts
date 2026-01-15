

import{test,expect} from "@playwright/test"

test("Get booking details by ID as path parameter @GET", async ({request}) =>{
    console.log("GET request with path parameters")
    const idBooking = 211;
    // GET Request with idBooking passed as PATH PARAMETER
    // backtick operator ` from this site: https://www.alt-codes.net/  
    const response = await request.get(`/booking/${idBooking}`);

    //parse the response to validate the response body
    const bodyResponse = await response.json();
    console.log(bodyResponse);
    //assertions
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

});


test("Get booking details by Full Name as query parameter", async ({request}) =>{
    console.log("GET request with Full Name as query parameters")
    const firstname = "James";
    const lastname = "Bond";
    // GET Request with firstname and lastname passed as QUERY PARAMETERS
    const response = await request.get("/booking", {
            params:{
                firstname,
                lastname}
        }
    );

    //parse the response to validate the response body
    const bodyResponse = await response.json();
    console.log(bodyResponse);
    //assertions
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    /*
    RESPONSE BODY IS an array of IDs:
    [
    {
        "bookingid": 1276
    }
    ]
    */

    //check body is not empty (at least one data in the body)
    expect(bodyResponse.length).toBeGreaterThan(0);
    console.log(bodyResponse.length);
    //other three validations: 
    //key should exist and be 'bookingid', the value should be a number and greater that 0 , for each bookingid of the response
    for(let item of bodyResponse)
    {
        expect(item).toHaveProperty("bookingid");
        expect(typeof item.bookingid).toBe("number");
        expect(item.bookingid).toBeGreaterThan(0);
    }


});

