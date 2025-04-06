import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail", // Or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendBookingStatusEmail(to: string, status: string, bookingTitle: string) {
    const mailOptions = {
        from: `"Lab Booking Admin" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Booking Status Updated: ${bookingTitle}`,
        html: `
      <h2>Your Lab Booking Status</h2>
      <p>The status of your booking titled <strong>${bookingTitle}</strong> has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
      <p>Thank you for using our lab booking system.</p>
    `,
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully")
    } catch (err) {
        console.error("Failed to send email:", err)
    }
}
