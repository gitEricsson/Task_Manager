class EmailTemplate {
  /**
   * Email Verification Message Template
   * @param firstName
   * @param otp
   * @param duration
   * @returns HTML string
   */
  public static verifyEmailContent(
    firstName: string | undefined,
    otp: string,
    duration: number
  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${firstName},
        </strong></p>
    <p style="margin-bottom: 2rem">
    Please use the following code
        <strong> 
            <span 
                style="font-size: 1rem;
                color:#ce11a5">${otp}
            </span>
        </strong>
            to verify your email.
        </p>
        <p>This code <b style="color:#ce11a5">expires in ${duration} minute(s)</b></p>

    <small>
        <p style="margin-bottom:10px">Please note:</p>
        <ul>
            <li>After verification, you'll be able to access all features of your account.</li>
            <li>If you didn't request this code, please ignore this message.</li>
            <li>For your account's security, please don't share this code with anyone.</li>
        </ul>
        ${this.footer()}
        </small>`;
  }

  /**
   * Welcome Mail Message Template
   * @param firstName
   * @returns HTML string
   */
  public static welcomeContent(
    firstName: string | undefined,

  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${firstName},
        </strong></p>
    <p>
        Welcome aboard! We’re thrilled to have you join our community. 
        </p>

        Here are a few things to get you started:</p>
    <ul>
        <li>Explore Our Platform: <br>
            ⇝ Log in to our website/app using your credentials. <br>
            ⇝ Take a tour of our features and services. <br>
            ⇝ Don’t hesitate to reach out if you have any questions. <br>
            <br>
        <li>
            Connect with Us: <br>
            ⇝ Follow us on social media for updates and behind-the-scenes content. <br>
            ⇝ Join our community to connect with other users. <br>
            <br>
        </li>
        <li>
            Stay Informed: <br>
            ⇝ Subscribe to our newsletter to receive the latest news, tips, and special offers. <br>
            <br>
            </li>
        </li>
        <li>
            Need Help? <br>
            ⇝ Our support team is here to assist you. Just visit our support page.
        </li>
    </ul>
    <p style="margin-bottom: 2rem">
        Once again, welcome! We’re excited to have you on board. 🚀
        Best regards,
        </p>

    <small>
        ${this.footer()}
        </small>`;
  }

  /**
   * User Creation Message Template
   * @param firstName
   * @param role
   * @param defaultPassword
   * @returns HTML string
   */
  public static userCreationContent(
    firstName: string | undefined,
    role: string,
    defaultPassword: string
  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${firstName},
        </strong></p>
    <p>
        A new user has been created for you by the administrator. 
        </p>
    <p style="font-size: 18px; color: #333; background-color: #f0f0f0; padding: 5px; border-radius: 5px; display: inline-block;">
        Your role is: <strong style="color: #ce11a5;">${role}</strong>
    </p>
    <p>
        Please note that your default password is: <strong style="color: #ce11a5;">${defaultPassword}</strong>. 
        We highly recommend that you change your password upon your first login to ensure the security of your account.
    </p>
    <p>
        Here are a few steps to get you started:</p>
    <ul>
        <li>Log in to your account using your User ID and the default password.</li>
        <li>Change your password immediately after logging in.</li>
        <li>If you have any questions or need assistance, feel free to reach out to our support team.</li>
    </ul>
    <p style="margin-bottom: 2rem">
        Welcome to our community! We’re excited to have you on board. 🚀
        Best regards,
        </p>

    <small>
        ${this.footer()}
    </small>`;
  }

  /**
   * Forgot Password message Template
   * @param firstName
   * @param otp
   * @param duration
   * @returns HTML string
   */
  public static forgotPasswordContent(
    firstName: string | undefined,
    otp: string,
    duration: number
  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${firstName},
        </strong></p>
    <p>We noticed you requested a password reset for your account.</p>
    <p style="margin-bottom: 2rem">
        <strong>Please enter the following code 
            <span 
                style="font-size: 1rem;
                color:#ce11a5">${otp}
                </span> to reset your password.
            </strong>
        </p>
        <p>This code <b style="color:#ce11a5">expires in ${duration} minute(s)</b></p>

    <small>
        <p style="margin-bottom:10px">Please pay attention:</p>
        <ul>
            <li>After verification, you will be able to change your password</li>
            <li>If you did not request a verification code,<br>
                please sign in to your account and change your password to ensure your account's security.</li>
            <li>In order to protect your account, please do not allow others access to your email.</li>
        </ul>
        ${this.footer()}
    </small>`;
  }

  /**
   * MFA Message Template
   * @param firstName
   * @param otp
   * @param duration
   * @returns HTML string
   */
  public static MFAContent(
    firstName: string | undefined,
    otp: string,
    duration: number
  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${firstName},
        </strong></p>
    <p>To ensure the security of your account, we've sent you a verification code for 2-factor authentication.</p>
    <p style="margin-bottom: 2rem">
        <strong>Please use the following code 
            <span 
                style="font-size: 1rem;
                color:#ce11a5">${otp}
                </span> for authentication.
            </strong>
        </p>
        <p>This code <b style="color:#ce11a5">expires in ${duration} minute(s)</b></p>

    <small>
        <p style="margin-bottom:10px">Please note:</p>
        <ul>
            <li>After verification, you'll have an additional layer of security for accessing your account.</li>
            <li>If you didn't request this code, please ignore this message.</li>
            <li>For your account's security, please don't share this code with anyone.</li>
        </ul>
        ${this.footer()}
    </small>`;
  }

  /**
   * Footer
   * @returns HTML string
   */
  private static footer(): string {
    return `<hr>
        <p style="text-align: center">&copy; 2024 <a style="color: #ce11a5; text-decoration: none" href="#" target="_blank">Our Company</a>. All rights reserved.</p>`;
  }

  /**
   * Generates an HTML email content for notifying users about the status update
   * of their multi-factor authentication (MFA).
   *
   * @param name - The name of the user to personalize the email.
   * @param status - The updated status of the user's MFA (e.g., enabled, disabled).
   * @returns A string containing the HTML content of the email.
   */
  static mfaStatusUpdateContent(name: string, status: string): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${name},
        </strong></p>
    <p>Your 2-factor authentication has been <strong>${status}</strong>.</p>
    <p style="margin-bottom: 2rem">
        If you did not make this change, please contact our support team immediately.
        </p>
    <small>
        <p style="margin-bottom:10px">Please note:</p>
        <ul>
            <li>For your account's security, please don't share your authentication code with anyone.</li>
            <li>If you have any questions, please don't hesitate to reach out to our support team.</li>
        </ul>
        ${this.footer()}
    </small>`;
  }

  static emailVerificationReminderContent(
    name: string,
    email: string,
    codeRequestLink: string
  ): string {
    return `<p style="margin-bottom: 1rem">
        <strong>
        Hello ${name},
        </strong></p>
    <p>We noticed you haven't verified your email address <strong>${email}</strong>.</p>
    <p style="margin-bottom: 2rem">
        Please verify your email address to enjoy all the features of your account.
        </p>
    <p>Click the link below to request a new verification code:</p>
    <a href="${codeRequestLink}" style="color: #ce11a5; text-decoration: none;">Request New Code</a>
    <small>
        <p style="margin-bottom:10px">Please note:</p>
        <ul>
            <li>For your account's security, please don't share your verification code with anyone.</li>
            <li>If you have any questions, please don't hesitate to reach out to our support team.</li>
        </ul>
        ${this.footer()}
    </small>`;
  }
}

export default EmailTemplate;