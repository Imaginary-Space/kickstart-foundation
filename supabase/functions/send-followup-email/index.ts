import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FollowUpEmailRequest {
  cancellationId: string;
  email: string;
  subscriptionTier: string;
  cancelledAt: string;
  cancellationReason?: string;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-FOLLOWUP-EMAIL] ${step}${detailsStr}`);
};

const serve_handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }

    // Verify admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      throw new Error("Access denied: Admin role required");
    }

    logStep("Admin authentication verified", { userId: userData.user.id });

    const { cancellationId, email, subscriptionTier, cancelledAt, cancellationReason }: FollowUpEmailRequest = await req.json();

    if (!cancellationId || !email) {
      throw new Error("Missing required fields: cancellationId and email");
    }

    logStep("Sending follow-up email", { email, subscriptionTier, cancellationId });

    // Create email content
    const cancelDate = new Date(cancelledAt).toLocaleDateString();
    const reasonText = cancellationReason || "Not specified";
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
          We're Sorry to See You Go
        </h2>
        
        <p>Hi there,</p>
        
        <p>We noticed that you recently cancelled your <strong>${subscriptionTier}</strong> subscription on ${cancelDate}.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">We'd Love Your Feedback</h3>
          <p>Your experience matters to us. Could you help us understand what led to your cancellation?</p>
          <p><strong>Reason provided:</strong> ${reasonText}</p>
        </div>
        
        <h3 style="color: #333;">What's New Since You Left</h3>
        <ul>
          <li>🚀 Improved AI photo analysis with better accuracy</li>
          <li>📱 Enhanced mobile experience</li>
          <li>⚡ Faster processing speeds</li>
          <li>🎯 New batch processing features</li>
        </ul>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2d7d2d;">Special Offer Just for You</h3>
          <p>We'd love to have you back! Here's a special 50% discount for the first 3 months if you decide to resubscribe within the next 30 days.</p>
          <p><strong>Use code:</strong> <code style="background-color: #fff; padding: 2px 6px; border-radius: 3px;">COMEBACK50</code></p>
        </div>
        
        <p>If you have any questions or would like to discuss your experience, please don't hesitate to reach out to us.</p>
        
        <p>Best regards,<br>
        <strong>The Photo Rename Team</strong><br>
        <a href="mailto:support@photorenameapp.com" style="color: #007cba;">support@photorenameapp.com</a></p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">
          This email was sent because you recently cancelled your subscription. If you believe this was sent in error, please contact our support team.
        </p>
      </div>
    `;

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "A Class With Harry <noreply@aclasswithharry.com>",
      to: [email],
      subject: "We'd love your feedback - Special offer inside! 🎁",
      html: emailHtml,
    });

    if (emailResponse.error) {
      throw new Error(`Resend error: ${emailResponse.error.message}`);
    }

    logStep("Email sent successfully", { emailId: emailResponse.data?.id });

    // Mark follow-up as sent in the database
    const { error: updateError } = await supabaseClient
      .from("cancelled_subscriptions")
      .update({ follow_up_sent: true })
      .eq("id", cancellationId);

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`);
    }

    logStep("Follow-up marked as sent", { cancellationId });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: "Follow-up email sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-followup-email", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(serve_handler);