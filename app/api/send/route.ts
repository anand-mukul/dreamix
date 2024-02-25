import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserById } from "@/lib/actions/user.actions";
import AdminemailTemplate from "@/lib/emails/AdminEmail/page";
import { render } from "@react-email/components";
import UseremailTemplate from "@/lib/emails/UserEmail/page";

interface CreateEmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

interface FeedbackFormData {
    userName: string;
    userEmail: string;
    imageId: string;
    imageURL: string;
    message: string;
    reaction: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await getUserById(userId);
        if (!user) return new NextResponse("User not found", { status: 404 });

        const body = await req.json();
        const { imageURL, imageId, message, reaction }: FeedbackFormData = body;

        // Validate request data
        if (!imageURL || !imageId || !message || !reaction) {
            return new NextResponse("Invalid input data", { status: 400 });
        }

        // Construct user details
        const userName = `${user.firstName} ${user.lastName}`;
        const userEmail = user.email;

        // Send email to admin
        const adminEmailOptions: CreateEmailOptions = {
            from: 'Dreamix <feedback@femprishtest.online>',
            to: 'mukulanand.biz@gmail.com',
            subject: 'Feedback',
            html: render(AdminemailTemplate({ userName, userEmail, imageId, imageURL, message, reaction })),
        };

        const { error: adminError } = await resend.emails.send(adminEmailOptions);
        if (adminError) {
            console.error('Error sending email to admin:', adminError);
            return new NextResponse('Error sending email to admin', { status: 500 });
        }

        // Send confirmation email to user
        const userConfirmationOptions: CreateEmailOptions = {
            from: 'Dreamix <feedback@femprishtest.online>',
            to: userEmail,
            subject: 'Feedback Confirmation',
            html: UseremailTemplate(user.firstName),
        };

        const { error: userConfirmationError } = await resend.emails.send(userConfirmationOptions);
        if (userConfirmationError) {
            console.error('Error sending confirmation email to user:', userConfirmationError);
            return new NextResponse('Error sending email to user', { status: 500 });
        }

        return new NextResponse("Email sent successfully", { status: 200 });
    } catch (error) {
        console.error('Error sending feedback:', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
