Download playwright and all dependencies needed. This framework tests the API calls (CRUD) , every test is tagged. To execute the tests locally ---->
npm run 'tagname' , for example ---> npm run post or npm run e2e

To run in GitHub Actions for CI, update line 209 of file playwright.yml under folder /.github/workflows , with the tests that you want to run. The trigger is the push command to main branch or a PR

To run TCs in Authentications.spec.ts, comment line 31 (baseURL) in playwright.config.ts and run the tests separatly. Be aware to create your own Github token from the setting section of your account  
