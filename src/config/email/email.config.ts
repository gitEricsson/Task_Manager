import {google} from 'googleapis';
import AppConfig from '../app.config';
import { NextFunction, Request, Response } from 'express';



const oauth2Client = new google.auth.OAuth2(
    AppConfig.sendEmail.clientId,
    AppConfig.sendEmail.clientSecret,
    AppConfig.sendEmail.redirectUri
)

export const gmailAuthController = {
    
    initiateAuth : async (req: Request, res: Response, next: NextFunction) => {
        try{
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://mail.google.com/'],
            })
            console.log("AUTH URL:::", authUrl)
            return res.redirect(authUrl)
        }catch(error: any){
            console.log("Error Initiating Auth::", error)
            next(error)
        }
    },
    
    handleCallback : async (req: Request, res: Response, next: NextFunction) => {
        try{
            const {code} = req.query;
            console.log("CODE::", code)
            const {tokens} = await oauth2Client.getToken(code as string);
            console.log("TOKENS:: ", tokens)
            oauth2Client.setCredentials(tokens)
            return res.json({ message: 'Authenticated successfully', tokens });
        }catch(error: any){
            console.log("Error handling Callback:::", error )
            next(error)
        }
    },
    
    verifyAndRefreshToken: async (req: Request, res: Response, next: NextFunction) => {
       try {
           const {tokens} = req.body;
           console.log("TOKENS:::", tokens)
           oauth2Client.setCredentials(tokens)
           
           const tokenInfo = await oauth2Client.getAccessToken()
           console.log("TOKEN_INFO:::", tokenInfo)
        if(!tokenInfo.token){
            if (tokens.refresh_token) {
                const { credentials } = await oauth2Client.refreshAccessToken()
                console.log("CREDENTIALS:::::", credentials)
                return res.json({ message: 'Token refreshed successfully', credentials });
            } else{
                return res.redirect('/auth/initiate');
            }
        } else {
            return res.json({ message: 'Token is still valid' });
        }
    }catch(error: any){
        console.log("V=A=RE:::error:::", error)
        next(error)
    }
    }

}