# Serverless-ETL

## Dependencies
- Node.js installed (created using 12.16.1)
- Serverless installed as a global dependency (`npm install -g serverless`)
- AWS credentials configured in CLI. (`aws configure`)
- Update L7 of `package.json` to your desired s3 bucket name. 

## Executing
1. Ensure your `pwd` is set to the project solution directory.
2. Run `npm install` to install other dependencies.
3. Run `npm run deploy` to deploy the serverless stack.
4. Run `npm run etl` to execute the plug-in to load the file from s3 into DynamoDB.

## Code Explained
- serverless.yml 
    - Serverless framework definition for this stack.
    - Defines Lambda under "functions" section
    - Defines DynamoDB table under "resources" section
    - Defines S3 bucket under "resources" section with the name derived from a CLI parameter of `--bucket`
    - A custom post deploy hook has been defined that will upload the file located at `./resources/users.csv` to the defined S3 bucket.
- handler.js
    - Contains all Lambda functions.