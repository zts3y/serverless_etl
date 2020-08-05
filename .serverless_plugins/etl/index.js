"use strict";
const AWS = require("aws-sdk");
AWS.config.region = "us-east-1";
let lambda = new AWS.Lambda();

class ETL {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      etl: {
        usage: "Executes lambda function that loads data from S3 to DynamoDB",
        lifecycleEvents: ["running"],
      },
    };

    this.hooks = {
      "before:etl:running": this.beforeETL.bind(this),
      "etl:running": this.etlRunning.bind(this),
      "after:etl:running": this.afterETLRunning.bind(this),
    };
  }

  beforeETL() {
    this.serverless.cli.log("ETL process beginning!");
  }

  async etlRunning() {
    this.serverless.cli.log("ETL running");
    const data = await lambda.invoke(
      {
        FunctionName: "serverless-etl-dev-hello",
        InvocationType: "RequestResponse",
      }
    ).promise();
    this.serverless.cli.log(data.Payload);
  }

  afterETLRunning() {
    this.serverless.cli.log("ETL process has completed");
  }
}

module.exports = ETL;
