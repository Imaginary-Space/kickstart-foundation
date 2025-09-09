import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    
    logStep("Stripe keys verified");

    // Use the service role key to perform writes (bypass RLS)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No stripe-signature header found");
    }

    logStep("Verifying webhook signature");
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    logStep("Webhook verified successfully", { eventType: event.type });

    // Handle the subscription deleted event
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      logStep("Processing subscription cancellation", { 
        subscriptionId: subscription.id, 
        customerId 
      });

      // Get customer details from Stripe
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (!customer.email) {
        logStep("No email found for customer", { customerId });
        return new Response("No customer email found", { status: 400 });
      }

      logStep("Found customer email", { email: customer.email });

      // Determine subscription tier based on price
      let subscriptionTier = "Unknown";
      if (subscription.items.data.length > 0) {
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 999) {
          subscriptionTier = "Basic";
        } else if (amount <= 2099) {
          subscriptionTier = "Personal";
        } else {
          subscriptionTier = "Pro";
        }
        
        logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
      }

      // Get user_id from our subscribers table if it exists
      const { data: subscriberData } = await supabaseClient
        .from("subscribers")
        .select("user_id")
        .eq("email", customer.email)
        .single();

      const userId = subscriberData?.user_id || null;
      logStep("Found user_id", { userId });

      // Insert cancellation record
      const { error: insertError } = await supabaseClient
        .from("cancelled_subscriptions")
        .insert({
          user_id: userId,
          email: customer.email,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          subscription_tier: subscriptionTier,
          cancelled_at: new Date(subscription.canceled_at * 1000).toISOString(),
          cancellation_reason: subscription.cancellation_details?.reason || null,
        });

      if (insertError) {
        logStep("Error inserting cancellation record", { error: insertError });
        throw insertError;
      }

      logStep("Cancellation record inserted successfully");

      // Update subscribers table to mark as unsubscribed
      const { error: updateError } = await supabaseClient
        .from("subscribers")
        .update({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        })
        .eq("email", customer.email);

      if (updateError) {
        logStep("Error updating subscriber record", { error: updateError });
        // Don't throw here as the cancellation record was already inserted
      } else {
        logStep("Subscriber record updated successfully");
      }

      return new Response(JSON.stringify({ 
        received: true, 
        processed: "subscription_cancelled",
        email: customer.email 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle subscription updated (for scheduled cancellations)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Check if this is a cancellation scheduled for period end
      if (subscription.cancel_at_period_end) {
        const customerId = subscription.customer as string;
        
        logStep("Processing scheduled cancellation", { 
          subscriptionId: subscription.id, 
          customerId,
          periodEnd: subscription.current_period_end
        });

        // Get customer details
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        if (!customer.email) {
          logStep("No email found for customer", { customerId });
          return new Response("No customer email found", { status: 400 });
        }

        // Update subscribers table with cancellation info
        const { error: updateError } = await supabaseClient
          .from("subscribers")
          .update({
            subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("email", customer.email);

        if (updateError) {
          logStep("Error updating subscriber with scheduled cancellation", { error: updateError });
        } else {
          logStep("Subscriber updated with scheduled cancellation date");
        }
      }

      return new Response(JSON.stringify({ 
        received: true, 
        processed: "subscription_updated" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle payment failures
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      
      logStep("Processing payment failure", { 
        invoiceId: invoice.id, 
        customerId 
      });

      // Get customer details
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      if (customer.email) {
        // You could insert a payment failure record or send notifications here
        logStep("Payment failed for customer", { email: customer.email });
      }

      return new Response(JSON.stringify({ 
        received: true, 
        processed: "payment_failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // For other event types, just acknowledge receipt
    logStep("Event received but not processed", { eventType: event.type });
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});