# empGetStatus Service

## Setup instructions
- Clone the repo.
```bash
https://github.com/aseelAcc99/Estarta-Task.git
cd Estarta-Task
```
- Create the .env file and add the following:
```
PORT: yourData  
DB_NAME: yourData 
DB_USER: yourData
DB_PASSWORD: yourData  
DB_HOST: yourData  
DB_PORT: yourData  
JWT_SECRET: yourData
JWT_EXPIRES_IN: yourData
```
- Install the dependencies.
```bash
npm install
```
- If you have Users and Salaries tables ignore this step, otherwise run this to add the tables with the sample data:
```bash
npm run init-db
```
- To start the express server, run the following.
```bash
npm run start
```

## Execution instructions
1. Firt go to login to get the token
  **Endpoint:**  
   `POST [baseurl]/api/login`

   **Body (JSON):**
   ```json
   {
     "NationalNumber": "yourValue",
     "Username": "yourValue"
   }
   ```

   > [!NOTE]
   > be careful for capitalization of the body values, and both values should be strings

   If the login is successful, you will receive a JWT token in the response.
   
2. Use the returned token in Bearer Authorization to access the protected endpoint:
  **Endpoint:**  
   `POST [baseurl]/api/getEmpStatus`
   
4. Use the Postman Collection file included in the folder to test all endpoints.

## Description of the Architecture
This service was created using **Node.js**. I followed the MVC structure while adhering to core classes and responsibilities.

### Project Structure
- **config/** -> Configuration files (db connection, constants)  
- **controllers/** -> Handle incoming requests from routes and return responses  
- **database/** -> Database connection and setup  
- **middleware/** -> Custom middlewares (authentication, errorHandling)  
- **models/** -> Data schemas 
- **routes/** -> API route definitions  
- **services/** -> Business logic and dataAccess   
- **utils/** -> Utility/helper functions  
- **README.md** 
- **app.js** -> Express app setup  
- **server.js** -> Server startup and configuration, main entry point of the app
- **.env** -> enivoronment variables

## Implemented Bonus Features
- Authnication:
  - Implemented using JSON Web Tokens (JWT).
  - Created a login API that generates a token based on the username and nationalNumber.
  - Developed an authentication middleware that validates the token for every API request to ensure secure access.
- Caching
  - Implemented a caching service using the node-cache framework.
  - Stores the latest data using the key format emp[nationalNumber].
  - Reduces database calls and improves response time for frequently accessed data.
- Database Retry:
  - created async function that's called every database request and runs max 3 times before timing out.

 ## My Notes
 - I added some data to the provided sample data to try to cover all cases.
 - In the Salaries table, I noticed some of te primary key Ids were replicted so I made the id in the table SERIAL.
 - The login is based on the nationalnumber and username values.
 - Case sensitivity is crucial in the body request.
 - Business Logic Assumptions:
     - I applied the tax deduction on the yearly total, and eventho the data only has the same year for all the salaries records I assumed that in real life the data will cover more than that.
     - The average is calculated based on the sum after the tax deduction.
