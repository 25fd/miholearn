# miholearn-Falgun api Task

<!-- GETTING STARTED -->
## 1. User SignUp API
This api add new user in dababse
### CURL
 ```sh
 curl --location --request POST 'http://localhost:3000/api/v1/user/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uname": "Palak_23",
    "password": "pan@123"
}
'
  ```
  
  ## 2. User Login API
* This api allow existing user to login
### CURL
 ```sh
curl --location --request POST 'http://localhost:3000/api/v1/user/login' \
--header 'deviceId: test123' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uname": "Palak_23",
    "password": "pan@123"
}
'
  ```
  * After successful loging this api return auth token and refresh token to access othe apis.
  
  ## 3. User Greet API
* This api return greeting message provided that authorisation token should be valid
### CURL
 ```sh
curl --location --request GET 'http://localhost:3000/api/v1/user/greet' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDRmMWY1ZjJkZGRlYjM1ZDA3NDZiZCIsImRldmljZUlkIjoidGVzdDEyMyIsImlhdCI6MTYyNzcxNDA4MiwiZXhwIjoxNjI3NzI4NDgyfQ.r7PYDjGrh1vVODqDPPhL1glUWq27XxVZjFPSODxv6Ss'
  ```
  
  
  ## 4. Get new auth toke API
* This api return new auth token and refresh token provided that refresh token should be valid
### CURL
 ```sh
curl --location --request GET 'http://localhost:3000/api/v1/user/get-new-token' \
--header 'refreshtoken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDNiMWNmYzMwOTg2ODM3ZDBiZTM5MiIsImRldmljZUlkIjoidGVzdDEyMyIsImlhdCI6MTYyNzcxMjg2NCwiZXhwIjoxNjI3Nzk5MjY0fQ.xqQX_O-XstckEVbtvrR8EfFTxDyphes5tGWxaQeb6rM' \
--header 'deviceid: test123'
```
 ## Flow of renew tokens
 * At the time of successfull login api retuen authToken and refreshToken that valid got 4 hours and 24 hours respectively.Also, this tokens are stored in database in token table with userId and deviceId.
 * The auth Token should be passed in headers to access the greet api.
 * The greet api pass through the middleware in which authToken and user data are verfied. If auth token is valid then furthure code would be exceuted otherwise return error.
 * In case of auth token expried after 4 hours get new token api should be called. This api check deviceId,userdata, refresh token, that is passed in headers, if it is valid, it will give new auth and refresh token and new tokens would have been saved in database.
 * For is unique user onle one entry of auth token and refresh token can be saved in database.
