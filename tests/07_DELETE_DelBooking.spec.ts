/*  E2E steps:
Pre-requisites:
    data will be retrived by a JSON file
    create token for the PUT/DELETE requests

1) Create a booking (POST) 
2) get booking (GET)
3) Update booking (PUT)  needed token
4) Delete Booking (DELETE)  needed token
*/

import{test,expect} from "@playwright/test";
import fs from 'fs';

// Utility function to read JSON data from external file
function readJson(filePath:string):any{
    return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

test("Delete Booking (end-to-end test flow) @E2E", async ({request}) =>{
    //1) Create a booking (POST) 
    console.log("======<<<<<STEP 1 - POST>>>>>>=========")
    const requestBodyFromFile=readJson('./testdata/post_request_body.json');
    const responseAfterPost=await request.post('/booking',{data:requestBodyFromFile, ignoreHTTPSErrors: true});
    const bodyResponse = await responseAfterPost.json();
    const bookingid = bodyResponse.bookingid;  //extracted bookingid from response body
    console.log(bodyResponse)
    console.log("ID ---->> ",bookingid);
    console.log("======<<<<<Booking is created>>>>>>=========")

    //2) Get a booking (GET) 
    console.log("======<<<<<STEP 2 - GET>>>>>>=========")
    const getResponse = await request.get(`/booking/${bookingid}`, {ignoreHTTPSErrors: true});
    const getResponseBody=await getResponse.json();
    console.log("======<<<<<Booking is displayed below>>>>>>=========")
    console.log(getResponseBody)

    //3) Update booking (PUT)  token needed
    console.log("======<<<<<STEP 3 - PUT (token needed)>>>>>>=========")
    //Create Token (follow documentation, Token is generated with POST)
    const requestBodyForToken=readJson('./testdata/post_token_body.json');
    const responseAfterPostForToken=await request.post('/auth',{data:requestBodyForToken, ignoreHTTPSErrors: true});
    console.log("======token generated=========")
    const bodyResponseToken = await responseAfterPostForToken.json();
    const tokenGenerated = bodyResponseToken.token;  //extracted token and use it for the PUT request
    //PUT request 
    const putRequestBodyFromFile=readJson('./testdata/put_request_body.json');
    const updatedResponse=await request.put(`/booking/${bookingid}`,
        {
            headers:{"Cookie":`token=${tokenGenerated}`},
            data:putRequestBodyFromFile,
            ignoreHTTPSErrors: true
        });   
    console.log(await updatedResponse.json());   
    console.log("Booking details updated!");    

    //4) Delete booking (DELETE)  token needed
    console.log("======<<<<<STEP 4 - DELETE (token needed)>>>>>>=========")

    const deleteResponse = await request.delete(`/booking/${bookingid}`,
        {
            headers:{"Cookie":`token=${tokenGenerated}`},
            ignoreHTTPSErrors: true
        });  

        //assertion delete response is not in JSON format, but it's text format
        expect(deleteResponse.statusText()).toBe("Created");
        expect(deleteResponse.status()).toBe(201);

        console.log("======<<<<<Booking is deleted successfully>>>>>>=========") 

});



