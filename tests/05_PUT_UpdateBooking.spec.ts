/*  steps:
Pre-requisites:
    data will be retrived by a JSON file
    create token for the PUT request

1) Create a booking (POST) and save the bookingid from response
2) Update booking (PUT) using the same bookingid (TOKEN REQUIRED)
*/

import{test,expect} from "@playwright/test";
import fs from 'fs';

function readJson(filePath:string):any{
    return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

test("Update Booking (PUT) @PUT", async ({request}) =>{
    //1) Create a booking (POST) 
    const requestBodyFromFile=readJson('./testdata/post_request_body.json');
    const responseAfterPost=await request.post('/booking',{data:requestBodyFromFile, ignoreHTTPSErrors: true});
    console.log(responseAfterPost)
    console.log("======<<<<<>>>>>>=========")
    console.log(await responseAfterPost.json())
    expect(responseAfterPost.ok()).toBeTruthy();

    const bodyResponse = await responseAfterPost.json();
    const bookingid = bodyResponse.bookingid;  //extracted bookingid from response body
    console.log("ID ---->> ",bookingid);

    //Create Token (follow documentation, Token is generated with POST)
    const requestBodyForToken=readJson('./testdata/post_token_body.json');
    const responseAfterPostForToken=await request.post('/auth',{data:requestBodyForToken, ignoreHTTPSErrors: true});
    console.log("======<<<<<>>>>>>=========")
    console.log(await responseAfterPostForToken.json())
    expect(responseAfterPostForToken.ok()).toBeTruthy();

    const bodyResponseToken = await responseAfterPostForToken.json();
    const tokenGenerated = bodyResponseToken.token;  //extracted token and use it for the PUT request
    console.log("token generated is ---->> ",tokenGenerated);

    //PUT request need TOKEN(from header with Cookie as key) and BOOKINGID(as path parameter)
    const putRequestBodyFromFile=readJson('./testdata/put_request_body.json');
    const updatedResponse=await request.put(`/booking/${bookingid}`,
        {
            headers:{"Cookie":`token=${tokenGenerated}`},
            data:putRequestBodyFromFile
        });
    console.log("======<<<<<>>>>>>=========")    
    console.log(await updatedResponse.json());
    expect(updatedResponse.ok()).toBeTruthy();
    expect(updatedResponse.status()).toBe(200);    
    console.log("Booking details updated!");    

});



