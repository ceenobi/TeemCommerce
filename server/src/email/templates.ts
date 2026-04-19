export const verifyAccountTemplate = (name: string, otp: string) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Verify Your Email - Teem Commerce</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0c0c18;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }

          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0c0c18;
            padding: 40px 0;
          }

          .container {
            width: 100%;
            max-width: 600px;
            background-color: #f5f5f5;
            margin: 0 auto;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }

          .header {
            background: linear-gradient(135deg, #007cbe 0%, #2d3047 100%);
            padding: 60px 20px;
            text-align: center;
          }

          .logo {
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.04em;
            text-transform: uppercase;
          }

          .content {
            padding: 50px 40px;
            color: #2d3047;
            text-align: center;
          }

          .title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #0c0c18;
          }

          .welcome-text {
            font-size: 18px;
            font-weight: 600;
            color: #007cbe;
            margin-bottom: 24px;
          }

          .text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #2d3047;
          }

          .otp-container {
            background-color: #ffffff;
            border: 2px dashed #007cbe;
            border-radius: 16px;
            padding: 30px;
            margin: 40px 0;
          }

          .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #fbaf00;
            letter-spacing: 12px;
            margin: 0;
          }

          .expiry-text {
            font-size: 14px;
            color: #64748b;
            margin-top: 20px;
          }

          .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 40px 0;
          }

          .footer {
            padding: 0 40px 60px;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }

          .footer-links {
            margin-bottom: 24px;
          }

          .footer-link {
            color: #007cbe;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
          }

          @media only screen and (max-width: 640px) {
            .container {
              border-radius: 0;
            }
            .content {
              padding: 40px 20px;
            }
            .otp-code {
              font-size: 36px;
              letter-spacing: 8px;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">TEEMCOMMERCE</div>
            </div>
            <div class="content">
              <h1 class="title">Welcome Home</h1>
              <p class="welcome-text">Hello ${name},</p>
              <p class="text">
                Welcome to Teem Commerce! We're thrilled to have you join our multi-tenant marketplace. To ensure the security of your account, please verify your email address.
              </p>
              
              <div class="otp-container">
                <p style="margin-bottom: 12px; font-weight: 600; text-transform: uppercase; font-size: 14px; color: #64748b;">Your Verification Code</p>
                <h2 class="otp-code">${otp}</h2>
                <p class="expiry-text">This code will expire in 30 minutes.</p>
              </div>

              <p class="text" style="font-size: 14px;">
                Simply enter this code in the verification screen to complete your registration.
              </p>

              <div class="divider"></div>
              
              <p class="text" style="font-size: 13px; margin-top: 24px; color: #94a3b8;">
                If you didn't create an account with Teem Commerce, you can safely ignore this email. Someone probably just made a typo.
              </p>
            </div>
            <div class="footer">
              <div class="footer-links">
                <a href="#" class="footer-link">Support</a>
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms</a>
              </div>
              <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} TEEMCOMMERCE Inc. All rights reserved.</p>
              <p>Lagos, Nigeria • Innovating Commerce</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

export const forgotPasswordTemplate = (name: string, otp: string) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
       <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Verify Your Email - Teem Commerce</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0c0c18;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }

          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0c0c18;
            padding: 40px 0;
          }

          .container {
            width: 100%;
            max-width: 600px;
            background-color: #f5f5f5;
            margin: 0 auto;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          }

          .header {
            background: linear-gradient(135deg, #007cbe 0%, #2d3047 100%);
            padding: 60px 20px;
            text-align: center;
          }

          .logo {
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.04em;
            text-transform: uppercase;
          }

          .content {
            padding: 50px 40px;
            color: #2d3047;
            text-align: center;
          }

          .title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #0c0c18;
          }

          .welcome-text {
            font-size: 18px;
            font-weight: 600;
            color: #007cbe;
            margin-bottom: 24px;
          }

          .text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 32px;
            color: #2d3047;
          }

          .otp-container {
            background-color: #ffffff;
            border: 2px dashed #007cbe;
            border-radius: 16px;
            padding: 30px;
            margin: 40px 0;
          }

          .otp-code {
            font-size: 42px;
            font-weight: 800;
            color: #fbaf00;
            letter-spacing: 12px;
            margin: 0;
          }

          .expiry-text {
            font-size: 14px;
            color: #64748b;
            margin-top: 20px;
          }

          .divider {
            height: 1px;
            background-color: #e2e8f0;
            margin: 40px 0;
          }

          .footer {
            padding: 0 40px 60px;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }

          .footer-links {
            margin-bottom: 24px;
          }

          .footer-link {
            color: #007cbe;
            text-decoration: none;
            margin: 0 12px;
            font-weight: 500;
          }

          @media only screen and (max-width: 640px) {
            .container {
              border-radius: 0;
            }
            .content {
              padding: 40px 20px;
            }
            .otp-code {
              font-size: 36px;
              letter-spacing: 8px;
            }
          }
        </style>
      </head>
      <body>
       <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="logo">TEEMCOMMERCE</div>
            </div>
            <div class="content">
              <h1 class="title">Reset Password</h1>
              <p class="welcome-text">Hello ${name},</p>
              <p class="text">
                You are receiving this email because you requested to reset your password. Please click the button below to reset your password.
              </p>
              
              <div class="otp-container">
                <p style="margin-bottom: 12px; font-weight: 600; text-transform: uppercase; font-size: 14px; color: #64748b;">Your Reset Password Code</p>
                <h2 class="otp-code">${otp}</h2>
                <p class="expiry-text">This code will expire in 30 minutes.</p>
              </div>

              <p class="text" style="font-size: 14px;">
                Simply enter this code in the verification screen to reset your password.
              </p>

              <div class="divider"></div>
              
              <p class="text" style="font-size: 13px; margin-top: 24px; color: #94a3b8;">
                If you didn't request to reset your password with Teem Commerce, you can safely ignore this email. Someone probably just made a typo.
              </p>
            </div>
            <div class="footer">
              <div class="footer-links">
                <a href="#" class="footer-link">Support</a>
                <a href="#" class="footer-link">Privacy Policy</a>
                <a href="#" class="footer-link">Terms</a>
              </div>
              <p style="margin-bottom: 8px;">© ${new Date().getFullYear()} TEEMCOMMERCE Inc. All rights reserved.</p>
              <p>Lagos, Nigeria • Innovating Commerce</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
