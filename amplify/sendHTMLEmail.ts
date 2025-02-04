import {SendEmailCommand} from "@aws-sdk/client-sesv2"
import {SESv2Client} from "@aws-sdk/client-sesv2"

export const sesClient = new SESv2Client()

export const sendHTMLEmail = async (
    fromEmailAddress: string,
    toEmailAddress: string,
    subject: string,
    html: string
)=>{
    const emailParams: any = {
        FromEmailAddress: fromEmailAddress,
        Destination: {
            ToEmailAddress: toEmailAddress
        },
        Content: {
            Simple: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html:{
                        Data: html
                    }
                }
            }
        }
    }

    const sendEmailCommand = new SendEmailCommand(emailParams)

    try{
        const data = await sesClient.send(sendEmailCommand)
        console.log(data)
    }catch(err){
        console.log(err)
    }
}
