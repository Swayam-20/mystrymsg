import * as React from "react";
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Hr,
} from "@react-email/components";

interface VerificationOtpEmailProps {
    username: string;
    otp: string;
};

export default function VerificationOtpEmail({
    username,
    otp
}: VerificationOtpEmailProps) {
    return (
        <Html>
        <Head />
        {/* Inbox preview text */}
        <Preview>Your OTP code for verification</Preview>

        <Body style={main}>
            <Container style={container}>
            <Section style={header}>
                <Text style={heading}>🔐 Verify Your Email</Text>
            </Section>

            <Section>
                <Text style={text}>Hi {username},</Text>
                <Text style={text}>
                Use the following One Time Password (OTP) to verify your email
                address. This code will expire in <b>10 minutes</b>.
                </Text>

                <Text style={otpBox}>{otp}</Text>

                <Text style={smallText}>
                Didn’t request this? You can safely ignore this email.
                </Text>

                <Hr />
                <Text style={footer}>Thanks, <br /> The Support Team</Text>
            </Section>
            </Container>
        </Body>
        </Html>
    );
}

/* 🎨 Inline styles for email compatibility */
const main = {
    backgroundColor: "#f4f4f4",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
};

const container = {
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    maxWidth: "500px",
    };

const header = { marginBottom: "20px" };

const heading = { fontSize: "22px", fontWeight: "bold", color: "#333" };

const text = { fontSize: "16px", color: "#333", lineHeight: "24px" };

const otpBox = {
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "6px",
    color: "#007bff",
    backgroundColor: "#f0f8ff",
    padding: "12px 24px",
    textAlign: "center" as const,
    borderRadius: "6px",
    margin: "20px 0",
};

const smallText = { fontSize: "14px", color: "#555", marginTop: "16px" };

const footer = { fontSize: "12px", color: "#888", marginTop: "20px" };
