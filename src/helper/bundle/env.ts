import * as dotenv from 'dotenv'

export const getEnv = () => {
    if (process.env.ENV) {
        dotenv.config({
            override: true,
            path: `environments/.env.${process.env.ENV}`

        })
    } else {
        console.error("NO ENV PASSED!")
    }

}