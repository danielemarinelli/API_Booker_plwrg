/*
TC -> create booking
request type -> POST
request body -> Random/Dynamic Data from faker

Pre-requisites:
1- install faker library to generate dynamic data (npm install @faker-js/faker)
2- install luxon, library to work with dates and times in JS/TS (npm install luxon)

*/


import{test,expect} from "@playwright/test"
import {faker} from "@faker-js/faker"
import {DateTime} from "luxon"

test("Create POST request using faker library for body @POST", async ({request}) =>{
    //payload to send with POST request from JSON file
    //data generation randomly
    const fakerfirstname=faker.person.firstName();
    const fakerlastname=faker.person.lastName();
    const fakertotalprice=faker.number.int({min:100, max:5000});
    const fakerdepositpaid=faker.datatype.boolean();

    const fakercheckin=DateTime.now().toFormat("yyyy-MM-dd");  //now() gives today date
    const fakercheckout=DateTime.now().plus({day:5}).toFormat("yyyy-MM-dd");  // checkout 5 days later than today's date

    const fakeradditionalneeds = "Super Bowl win"

    //payload to send with POST request generated with faker
    let bodyFaker ={
        "firstname": fakerfirstname,
        "lastname": fakerlastname,
        "totalprice": fakertotalprice,
        "depositpaid": fakerdepositpaid,
        "bookingdates": {
            "checkin": fakercheckin,
            "checkout": fakercheckout,
        },
        "additionalneeds": fakeradditionalneeds,
    }


    // send POST request from json file
    //const response = await request.post("https://restful-booker.herokuapp.com/booking",{data:body}); 
    //instead of writting the BaseURL in every test, we can specify it on the playwright.config.ts file (line 29) and in the request specify only the endpoint
    const response = await request.post("/booking",{data:bodyFaker, ignoreHTTPSErrors: true});
    
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
    //VALIDATE THE RESPONSE fields 
    const bookingOjbect = responseBody.booking;
    expect(bookingOjbect).toMatchObject({
        "firstname": bodyFaker.firstname,
        "lastname": bodyFaker.lastname,
        "totalprice": bodyFaker.totalprice,
        "depositpaid": bodyFaker.depositpaid,
        "additionalneeds": bodyFaker.additionalneeds
    }); 

    //validate nested json ojbect
    expect(bookingOjbect.bookingdates).toMatchObject({
        "checkin": bodyFaker.bookingdates.checkin,
        "checkout": bodyFaker.bookingdates.checkout
    });

})



