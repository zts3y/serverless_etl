"use strict";

const AWS = require("aws-sdk");
const csv = require("csvtojson");
const { map } = require("p-iteration");
const { v4: uuidv4 } = require("uuid");

//TODO: Investigate a batch load function.
async function saveItemInDB(item) {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: "users",
    Item: {
      id: uuidv4(),
      ...item,
    },
  };

  return dynamoDB
    .put(params)
    .promise()
    .then((res) => res)
    .catch((err) => err);
}

exports.etl = async (event) => {
  const S3 = new AWS.S3();

  //TODO: Reference bucketname as a variable based on what is passed during the sls deploy
  const params = {
    Bucket: "zsarver-etl-input",
    Key: "users.csv",
  };

  let data = async function () {
    // get csv file and create stream
    const stream = S3.getObject(params).createReadStream();
    // convert csv file (stream) to JSON format data
    const json = await csv().fromStream(stream);

    return json;
  };

  let csvData = await data();
  await map(csvData, async (item) => {
    await saveItemInDB(item);
  }).catch(() => {
    throw {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error has occurred during processing",
          input: event,
        },
        null,
        2
      ),
    };
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "File processing complete",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
