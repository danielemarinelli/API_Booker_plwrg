/*  
 To run this test comment the line baseURL in the playwright.config.ts file
1) No Auth (Public API) 
2) Basic Auth (User & password)
3) Bearer token
4) API key authentication
*/

import{test,expect} from "@playwright/test";

//1) No Auth

test("Public API - No Auth @AUTH", async ({request}) =>{
const resp=await request.get("https://restful-booker.herokuapp.com/booking", {ignoreHTTPSErrors: true});
expect(resp.ok()).toBeTruthy();
console.log(await resp.json());


});

// Basic Auth (User & password passed with headers following the syntax below)
// for this API, user is --> 'user' and password is --> 'pass'

test("Basic Auth  @AUTH", async ({request}) =>{
const resp=await request.get("https://httpbin.org/basic-auth/user/pass", {
                            headers:{Authorization:`Basic `+Buffer.from("user:pass").toString('base64')},
                            ignoreHTTPSErrors: true
                            });
expect(resp.ok()).toBeTruthy();
expect(resp.status()).toBe(200);
console.log(await resp.json());


});

// Bearer token
// to create a github token, go to settings -> Developer Settings -> Personal Token classic
// RETURNS all repos created by the user

test("Bearer token Auth - All repos of user  @AUTH", async ({request}) =>{
    const bearerToken = "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";  //token usually expires
    const resp=await request.get("https://api.github.com/user/repos", {
                            headers:{Authorization:`Bearer ${bearerToken}`},
                            ignoreHTTPSErrors: true
                            });
    expect(resp.ok()).toBeTruthy();
    expect(resp.status()).toBe(200);
    console.log(await resp.json());


});


// to create a github token, go to settings -> Developer Settings -> Personal Token classic
// RETURNS all info of the user

test("Bearer token Auth - All info of the user  @AUTH", async ({request}) =>{
    const bearerToken = "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";  //token usually expires
    const resp=await request.get("https://api.github.com/user", {
                            headers:{Authorization:`Bearer ${bearerToken}`},
                            ignoreHTTPSErrors: true
                            });
    expect(resp.ok()).toBeTruthy();
    expect(resp.status()).toBe(200);
    console.log(await resp.json());


});


// API key authentication , IS PART OF THE QUERY PARAMS
// must sign-in and generate a KEY (that will expire)

test("API Key auth1  @AUTH", async ({request}) =>{
    const resp=await request.get("https://api.openweathermap/data/2.5/weather", {
                            params:{
                                q:'Rome',   // from the doc, must pass 'q' as a city to find out the weather
                                appid:'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'  
                            },
                            ignoreHTTPSErrors: true
                            });
    expect(resp.ok()).toBeTruthy();
    expect(resp.status()).toBe(200);
    console.log(await resp.json());


});


// API key authentication , IS PART OF THE QUERY PARAMS
// must sign-in and generate a KEY (that will expire) that will be under the account page
// ref swagger -->> https://www.weatherapi.com/docs
// Retuens current weather of city

test.only("API Key auth2  @AUTH", async ({request}) =>{
    const resp=await request.get("https://api.weatherapi.com/v1/current.json", {
                            params:{
                                q:'New York',   // from the doc, must pass 'q' as a city to find out the weather
                                key:'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'  
                            },
                            ignoreHTTPSErrors: true
                            });
    expect(resp.ok()).toBeTruthy();
    expect(resp.status()).toBe(200);
    console.log(await resp.json());


});



