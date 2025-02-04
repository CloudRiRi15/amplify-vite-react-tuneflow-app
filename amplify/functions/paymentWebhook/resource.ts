import { defineFunction, secret } from "@aws-amplify/backend";
export const paymentWebhook = defineFunction({
    name: 'paymentWebhook',
    entry: 'handler.ts',
    environment: {
        SIGNATURE: secret('SIGNATURE'),
        SONG_PATH: 'songs/amplify-suno.mp3',
        VERIFIED_SES_FROM_EMAIL: 'rejoiceymucheri@gmail.com' // replace this with your verified 
    }
})
