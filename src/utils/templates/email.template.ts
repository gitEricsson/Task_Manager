const header = `<!DOCTYPE html>
    <html
    lang="en"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:v="urn:schemas-microsoft-com:vml"
    >
    <head>
    <title></title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <link
        href="https://fonts.googleapis.com/css?family=Montserrat"
        rel="stylesheet"
        type="text/css"
    />
    </head>
    <body style="background-color: #ddd0da; padding:2.3vh">
    <img src="https://example.com/logo.png" style="height: 14vh;"/>
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #ffffff;
        padding: 2vh;
      "
      width="100%"
    >
      <tbody style="font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif">
`
const footer = `<!-- footer -->
             <tr>
                <td>
                    <br/><br/>
                </td>
             </tr>
             <tr>
                <td>
                    <div style="background-color: #C4C4C4; height: 1px;"></div>
                </td>
             </tr>
             <tr>
                <td>
                    <br>
                </td>
             </tr>
             <tr>
                <td>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td >
                                    <img  src="https://example.com/logo.png" style="height: 10vh;"/>
                                </td>
                                <td style=" width: 20%;">
                                    <table style="width: 100%; text-align: end;">
                                        <tbody>
                                            <tr>
                                                <td style="width: fit-content;">
                                                    <a href="https://linkedin.com/company/example">

                                                        <img style="height: 3vh;" src="https://example.com/linkedin.png"/>
                                                    </a>
                                                </td>
                                                <td style="width: fit-content;">
                                                    <a href="https://www.instagram.com/example/">

                                                        <img style="height: 3vh;" src="https://example.com/instagram.png"/>
                                                    </a>
                                                </td>
                                                <td style="width: fit-content;">
                                                    <a href="">

                                                        <img style="height: 3vh;" src="https://example.com/icon1.png"/>
                                                    </a>
                                                </td>
                                                <td style="width: fit-content;">
                                                    <a href="">

                                                        <img style="height: 3vh;" src="https://example.com/icon2.png"/>
                                                    </a>
                                                </td>
                                             </tr>
                                     </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <br>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" colspan="2">
                                    <table>
                                        <tbody style="text-decoration: underline;  color: #696969; font-size: 12px;">
                                            <tr>
                                                <td style="padding-right: 12px;">
                                                    <a style="color: #696969; text-align: center;" href="https://www.example.com/blog">
                                                        Our Blog
                                                    </a>
                                                </td>
                                                <td>
                                                    <div style="height: 15px; background-color:#cacaca; width: 1px;"></div>
                                                </td>
                                                <td style="padding:0 12px;">
                                                    <a style="color: #696969; text-align: center;" href="https://www.example.com/terms-and-conditions">
                                                        Terms
                                                    </a>
                                                </td>
                                                <td>
                                                    <div style="height: 15px; background-color:#cacaca; width: 1px;"></div>
                                                </td>
                                                <td style="padding:0 12px;">
                                                    <a style="color: #696969; text-align: center;" href="https://www.example.com/privacy-policy">
                                                        Privacy
                                                    </a>
                                                </td>
                                                <td>
                                                    <div style="height: 15px; background-color:#cacaca; width: 1px;"></div>
                                                </td>
                                                <td style="padding:0 12px;">
                                                    <a style="color: #696969; text-align: center;" href="https://www.example.com/contact">
                                                        Contact Us
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <br>
                                </td>
                            </tr>
                            <tr  style=" width: 100%;">
                                <td colspan="2" style="text-align: center; color: #696969; font-size: 12px;">
                                    ©2024 Example Company, All rights reserved.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
             </tr>
      </tbody>
    </table>
  </body>
</html>`

export const emailTemplate = (messageBody: string) => {
    return `${header}
    <!-- header -->
    ${messageBody}
    <!-- footer -->
    ${footer}`       
}