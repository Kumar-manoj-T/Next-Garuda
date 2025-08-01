import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const formData = await request.json()

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Business Email (to you)
    const businessMailOptions = {
      from: process.env.EMAIL_USER,
      to: "garudattd1@gmail.com", // Your business email
      subject: `New Booking Request - ${formData.packageType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">🎯 New Booking Request</h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-top: 0;">Customer Details:</h3>
              <p><strong>Package Type:</strong> ${formData.packageType}</p>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Number of Persons:</strong> ${formData.persons}</p>
              <p><strong>Date:</strong> ${formData.date}</p>
              <p><strong>Time:</strong> ${formData.time}</p>
              ${formData.selectedOption ? `<p><strong>Selected Option:</strong> ${formData.selectedOption}</p>` : ""}
            </div>
            
            ${
              formData.message
                ? `
              <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1d4ed8; margin-top: 0;">Customer Message:</h3>
                <p style="font-style: italic;">"${formData.message}"</p>
              </div>
            `
                : ""
            }
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="text-align: center; color: #6b7280; font-size: 14px;">
              <em>Submitted on: ${new Date().toLocaleString()}</em>
            </p>
          </div>
        </div>
      `,
    }

    // Client Confirmation Email
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: `Booking Confirmation - ${formData.packageType} | Garuda Tours & Travels`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">🙏 Garuda Tours & Travels</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Your Spiritual Journey Partner</p>
            </div>
            
            <!-- Confirmation Message -->
            <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 30px;">
              <h2 style="color: #16a34a; margin: 0 0 10px 0;">✅ Booking Confirmation Received!</h2>
              <p style="margin: 0; color: #166534;">Dear ${formData.name}, thank you for choosing Garuda Tours & Travels. We have received your booking request and will contact you shortly.</p>
            </div>
            
            <!-- Booking Details -->
            <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 Your Booking Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Package:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.packageType}</td>
                </tr>
                ${
                  formData.selectedOption
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Selected Option:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.selectedOption}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Number of Persons:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.persons}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Preferred Date:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Preferred Time:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Contact Number:</td>
                  <td style="padding: 8px 0; color: #374151;">${formData.phone}</td>
                </tr>
              </table>
            </div>
            
            <!-- Next Steps -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #92400e; margin-top: 0;">📞 What Happens Next?</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>Our team will review your booking request</li>
                <li>We'll contact you within 2-4 hours to confirm details</li>
                <li>Final itinerary and payment details will be shared</li>
                <li>Get ready for an amazing spiritual journey!</li>
              </ul>
            </div>
            
            <!-- Contact Information -->
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1d4ed8; margin-top: 0;">📞 Contact Us</h3>
              <p style="margin: 5px 0; color: #1e40af;"><strong>Phone:</strong> +91 98407 89844, +91 98407 89857</p>
              <p style="margin: 5px 0; color: #1e40af;"><strong>Email:</strong> garudattd1@gmail.com</p>
              <p style="margin: 5px 0; color: #1e40af;"><strong>Address:</strong> No.83, Nehru Nagar, 1st Street, 13th Main Road, Anna Nagar West, Chennai</p>
            </div>
            
            <!-- Message if provided -->
            ${
              formData.message
                ? `
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #374151; margin-top: 0;">💬 Your Message:</h3>
                <p style="font-style: italic; color: #6b7280; margin: 0;">"${formData.message}"</p>
              </div>
            `
                : ""
            }
            
            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Thank you for choosing Garuda Tours & Travels<br>
                <em>Your trusted partner for spiritual journeys</em>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                Booking ID: GT${Date.now()} | Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Send emails using Nodemailer
    const businessEmailPromise = transporter.sendMail(businessMailOptions)
    const clientEmailPromise = transporter.sendMail(clientMailOptions)

    // Send Telegram Message
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
    const telegramChatId = process.env.TELEGRAM_CHAT_ID

    const telegramMessage = `
🎯 *New Booking Request*

📦 *Package:* ${formData.packageType}
👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Phone:* ${formData.phone}
👥 *Persons:* ${formData.persons}
📅 *Date:* ${formData.date}
⏰ *Time:* ${formData.time}
${formData.selectedOption ? `🎫 *Option:* ${formData.selectedOption}` : ""}
💬 *Message:* ${formData.message || "No message provided"}

⏰ *Submitted:* ${new Date().toLocaleString()}
🆔 *Booking ID:* GT${Date.now()}
    `

    let telegramResponse
    try {
        console.log("Sending Telegram :",telegramBotToken, telegramChatId)
      telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
          parse_mode: "Markdown",
        }),
      })
    } catch (fetchError) {
      console.error("Telegram fetch error:", fetchError)
      // Treat fetch error as a failure
      telegramResponse = { ok: false, status: 500, statusText: "Network or API issue" }
    }

    // Evaluate results from all services
    const emailResults = await Promise.allSettled([businessEmailPromise, clientEmailPromise])

    const businessEmailSuccess = emailResults[0].status === "fulfilled"
    const clientEmailSuccess = emailResults[1].status === "fulfilled"
    const telegramSuccess = telegramResponse.ok // Check .ok property of the fetch Response

    const failedServices = []
    if (!businessEmailSuccess)
      failedServices.push(`Business Email (${emailResults[0].reason?.message || "unknown error"})`)
    if (!clientEmailSuccess) failedServices.push(`Client Email (${emailResults[1].reason?.message || "unknown error"})`)
    if (!telegramSuccess) {
      let telegramErrorDetails = "unknown error"
      try {
        const errorBody = await telegramResponse.json()
        telegramErrorDetails = errorBody.description || JSON.stringify(errorBody)
      } catch (e) {
        // If response is not JSON or already consumed
        telegramErrorDetails = telegramResponse.statusText || `status ${telegramResponse.status}`
      }
      failedServices.push(`Telegram (${telegramErrorDetails})`)
    }

    if (businessEmailSuccess && clientEmailSuccess && telegramSuccess) {
      return NextResponse.json({
        success: true,
        message: "Booking request submitted successfully! You will receive a confirmation email shortly.",
      })
    } else {
      console.error("Some notification services failed:", {
        businessEmail: businessEmailSuccess ? "Success" : emailResults[0].reason,
        clientEmail: clientEmailSuccess ? "Success" : emailResults[1].reason,
        telegram: telegramSuccess ? "Success" : telegramResponse.statusText || "Telegram error",
        failedDetails: failedServices,
      })

      // If at least one email or telegram succeeded, consider it a partial success
      if (businessEmailSuccess || clientEmailSuccess || telegramSuccess) {
        return NextResponse.json({
          success: true,
          message: `Booking submitted. Some notifications might be delayed: ${failedServices.join(", ")}.`,
        })
      } else {
        // All critical services failed
        return NextResponse.json(
          {
            success: false,
            message: `Failed to submit booking request. All notifications could not be sent. Please try again or contact us directly.`,
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Error submitting booking (catch block):", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again or contact us directly.",
      },
      { status: 500 },
    )
  }
}
