import type { APIGatewayProxyHandler } from "aws-lambda";
import { sendHTMLEmail } from "./sendHTMLEmail";
import { generateSignedUrl } from "./generateSignedUrl";
// import {env} from '$amplify/env/main'

export const handler = async (event: any) => {
  console.log("event", event);
  const body: any = JSON.parse(event.body)
  console.log(body)
  console.log(body.data.object.customer_details)
  const url = await generateSignedUrl(
    'songs',
    'airbnb.png',
    36
)
  await  sendHTMLEmail(
    process.env.VERIFIED_SES_FROM_EMAIL!,
    body.data.object.customer_details.email,
    'Your song has arrived',
    `
    <html>
    <body>
    <h1> Hello from My music! </h1>
    <p> Hey ${body.data.object.customer_details.name}, thank you for your purchase! </p>
    <p>Your song <a href="${url}">is ready </a> Hope you enjoy!</p>
    </body>
    </html>
    `
)
  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify("Hello from myFunction!"),
  };
};
