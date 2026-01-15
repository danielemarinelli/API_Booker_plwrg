/*  steps:
Pre-requisites:
    partial data to update will be retrived by a JSON file
    create token for the PATCH request

1) Create a booking (POST) and save the bookingid from response
2) Update booking (PATCH) using the same bookingid (TOKEN REQUIRED)
*/

import{test,expect} from "@playwright/test";
import fs from 'fs';

function readJson(filePath:string):any{
    return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

test("Partial Update Booking (PATCH) @PATCH", async ({request}) =>{
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

    //PATCH request need TOKEN(from header with Cookie as key) and BOOKINGID(as path parameter)
    const patchRequestBodyFromFile=readJson('./testdata/patch_request_body.json');
    const partialUpdatedResponse=await request.patch(`/booking/${bookingid}`,
        {
            headers:{"Cookie":`token=${tokenGenerated}`},
            data:patchRequestBodyFromFile,
            ignoreHTTPSErrors: true
        });
    console.log("======<<<<<>>>>>>=========")    
    console.log(await partialUpdatedResponse.json());
    expect(partialUpdatedResponse.ok()).toBeTruthy();
    expect(partialUpdatedResponse.status()).toBe(200);    
    console.log("Booking details updated partially!");    

});



