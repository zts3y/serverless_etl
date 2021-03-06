# Serverless-ETL

## Goal
Create a [serverless framework](https://www.serverless.com) solution that will:
1. Create an S3 bucket
2. Create a DynamoDB table
3. Create a Lambda function that extracts the file from s3 and loads to the created DynamoDB table.
4. Create a Serverless plugin that calls the Lambda function to begin the ETL. 

## Dependencies
- Node.js installed (created using 12.16.1)
- Serverless installed as a global dependency (`npm install -g serverless`)
- AWS credentials configured in CLI. (`aws configure`)
- Update L7 of `package.json` to your desired s3 bucket name. 

## Executing
1. Ensure your `pwd` is set to the project solution directory.
2. Run `npm install` to install other dependencies.
3. Run `serverless invoke local --function etl --bucket zsarver-etl-input` to test the lambda function that loads DynamoDB.
3. Run `npm run deploy` to deploy the serverless stack.
4. Run `npm run etl` to execute the plug-in to load the file from s3 into DynamoDB.

## File Definitions
- serverless.yml 
    - Serverless framework definition for this stack.
    - Defines Lambda under "functions" section
    - Defines DynamoDB table under "resources" section
    - Defines S3 bucket under "resources" section with the name derived from a CLI parameter of `--bucket`
    - A custom post deploy hook has been defined that will upload the file located at `./resources/users.csv` to the defined S3 bucket.
- handler.js
    - Contains all Lambda functions.
- .serverless_plugins/etl/index.js
    - Custom Serverless framework plug `etl` that will call the Lambda to start the ETL. 
- resources/users.csv
    - Dummy data file that is deployed as a post deploy hook from the stack.
    - Update with additional data to test significantly larger use cases.