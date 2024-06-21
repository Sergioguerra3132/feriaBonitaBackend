class EmailTemplate {
  constructor(email, subject, text, userName, activationUrl) {
      this.to = email;
      this.subject = subject || "Survive the Apocalypse in Steel Shock";
      this.text = text || "";
      this.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <title>Activation</title>
          <link href="https://fonts.googleapis.com/css2?family=Shapiro+75&display=swap" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Outfit+Sans&display=swap" rel="stylesheet">
      </head>
      <body style="margin:0; padding:0;">
          <div style="background-image: url('https://texelbit.com/Images/SteelRegisterBackground.jpeg'); background-size: cover; background-repeat: no-repeat; background-position: center center; padding:0; ">
              <table align="center" width="90%" cellpadding="0" cellspacing="0">
                  <tr>
                      <td align="center" style="padding: 40px 0;">
                          <table border="0" cellpadding="0" cellspacing="0" style="background-color:rgba(26, 26, 26, 0.932); border-radius:10px; padding:5%; box-shadow: 0px 3px 10px rgba(0,0,0,0.2);">
                              <tr>
                                  <td align="center">
                                      <img src="https://texelbit.com/Images/logo_steel_shock.png" alt="Steel Logo" style="margin-bottom: 20px; max-width: 100px; width: auto; height: auto;">
                                      <h1 style="margin:0; font-family: 'Shapiro 75', sans-serif; font-size: 28px; line-height:32px; color:#00aa6c;">Welcome, ${userName} to Steel Shock</h1>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" style="padding: 5%;">
                                      <p style=" font-family: monospace;align-content: flex-start; margin:0; font-size: 20px; line-height:30px; color:#ffffff;">
                                        Step into Mech Arena, command your robots, and battle to survive. 
                                      </p>
                                      <p style="font-weight: 600; font-family: monospace;margin:0; font-size: 17px; line-height:30px; color:#ffffff;padding-top: 5%;">
                                        Your activation link is live for 2 hours.
                                      </p>
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center">
                                      <a href="${activationUrl}" style="font-family: monospace;background-color:#00aa6c; border:none; border-radius:3px; color:#ffffff; display:inline-block; font-size: 16px; line-height:45px; text-align:center; text-decoration:none; width:200px; box-shadow: 0px 3px 10px rgba(0,0,0,0.2);">Activate Now</a>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </div>
      </body>
      </html>
      `;
  }
}

module.exports = EmailTemplate;
