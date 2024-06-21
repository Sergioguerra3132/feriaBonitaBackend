class RecoveryPasswordEmailTemplate {
    constructor(email, subject, text, userName, tempCode) {
        this.to = email;
        this.subject = subject || "Steel Shock Password Recovery";
        this.text = text || "";
        this.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Password Recovery</title>
            <link href="https://fonts.googleapis.com/css2?family=Shapiro+75&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Outfit+Sans&display=swap" rel="stylesheet">
        </head>
        <body style="margin:0; padding:0;">
            <div style="background-image: url('https://texelbit.com/Images/SteelRecovery.webp'); background-size: cover; background-repeat: no-repeat; background-position: center center; padding:0">
                <table align="center" width="90%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center" style="padding: 40px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" style="background-color:rgba(0, 0, 0, 0.87); border-radius:10px; padding:1%; box-shadow: 0px 3px 10px rgba(0,0,0,0.2);">
                                <tr>
                                    <td align="center">
                                        <img src="https://texelbit.com/Images/logo_steel_shock.png" alt="Steel Shock Logo" style="margin-bottom: 20px; max-width: 100px; width: auto; height: auto;">
                                        <h1 style="margin:0; font-family: 'Shapiro 75', sans-serif; font-size: 28px; line-height:32px; color:#00aa6c;">Password Recovery</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 1%;">
                                        <p style="margin:0; font-family: 'Outfit Sans', sans-serif; font-size: 20px; line-height:30px; color:#ffffff;">
                                            Hello, ${userName},
                                        </p>
                                        <p style="margin:0; font-family: 'Outfit Sans', sans-serif; font-size: 20px; line-height:30px; color:#ffffff;">
                                            We received a request to reset your password. To proceed, please log in to your account using the temporary code provided below.
                                        </p>
                                        <p style="margin-top: 20px; font-family: 'Outfit Sans', sans-serif; font-size: 22px; line-height:32px; color:#00aa6c; font-weight:bold;">
                                            Temporary Code:
                                        </p>
                                        <div>
                                            <p style="margin-top: 20px; font-family: 'Outfit Sans', sans-serif; font-size: 40px; line-height:32px; color:#00aa6c; font-weight:bold;">
                                                ${tempCode}
                                            </p>
                                            <p style="margin:1px 0; font-family: 'Outfit Sans', sans-serif; font-size: 10px; line-height:30px; color:#ffffff;">
                                                This code is valid for 30 minutes. Use it to log in and then you will be prompted to create a new password.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>`;
    }
}

module.exports = RecoveryPasswordEmailTemplate;
