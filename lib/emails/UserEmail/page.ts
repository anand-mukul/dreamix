export default function UseremailTemplate(userFirstname: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>We Received your feedback!</title>
        </head>
        <body style="background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen-Sans, Ubuntu, Cantarell, &quot;Helvetica Neue&quot;, sans-serif;">
            <div style="margin: 0 auto; padding: 20px 0 48px; max-width: 37.5em;">
             <img src="https://dreamix.vercel.app/assets/images/logo-text.png" width="full" height="70" alt="dreamix" style="display: block; margin: 0 auto;">
                <p style="font-size: 16px; line-height: 26px;">Hi ${userFirstname},</p>
                <p style="font-size: 16px; line-height: 26px;">Thanks you for your valuable feedback We will surely look into that!!</p>
                <div style="text-align: center;">
                    <a href="https://dreamix.vercel.app" style="background-color: #5F51E8; border-radius: 3px; color: #fff; font-size: 16px; text-decoration: none; text-align: center; display: inline-block; padding: 12px;">Explore More</a>
                </div>
                <p style="font-size: 16px; line-height: 26px;">
                    Best,<br>
                    The Dreamix team
                </p>
                <hr style="width: 100%; border: none; border-top: 1px solid #cccccc; margin: 20px 0;">
                <p style="font-size: 12px; line-height: 24px; color: #8898aa;">
                    Copyright © ${new Date().getFullYear()} Dreamix Inc. <br>
                    All rights reserved
                </p>
            </div>
        </body>
        </html>
    `;
}