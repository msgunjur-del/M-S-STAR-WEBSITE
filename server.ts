import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Stripe
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

  // Initialize Nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // API routes
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { to, subject, orderId, status, trackingNumber, courier } = req.body;

      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Email not sent.");
        return res.status(200).json({ success: true, message: "Email skipped (SMTP not configured)" });
      }

      let htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #0f172a;">Order Update: ${orderId}</h2>
          <p style="color: #334155; font-size: 16px;">Your order status has been updated to: <strong style="color: #2563eb;">${status}</strong></p>
      `;

      if (status === 'Shipped' && trackingNumber) {
        htmlContent += `
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #0f172a;">Shipping Details</h3>
            <p style="margin: 5px 0; color: #475569;"><strong>Courier:</strong> ${courier || 'Standard Shipping'}</p>
            <p style="margin: 5px 0; color: #475569;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
          </div>
        `;
      }

      htmlContent += `
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">Thank you for shopping with M S STAR XEROX!</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"M S STAR XEROX" <${process.env.SMTP_USER}>`,
        to,
        subject: subject || `Update on your order ${orderId}`,
        html: htmlContent,
      });

      res.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects cents
        currency: "inr",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
