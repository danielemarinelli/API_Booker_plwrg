Download playwright and all dependencies needed. This framework tests the API calls (CRUD) , every test is tagged. To execute the tests locally ---->
npm run 'tagname' , for example ---> npm run post or npm run e2e

To run in GitHub Actions for CI, update line 132 of file playwright.yml under folder /.github/workflows , with the tests that you want to run. The trigger is the push command to main branch or a PR
