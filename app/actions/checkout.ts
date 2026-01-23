"use server";

import { supabase } from "@/app/lib/database";
import { redirect } from "next/navigation";

type OrderData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    region: string;
    postalCode?: string;
  };
  notes?: string;
  items: Array<{
    id: string;
    title: string;
    price: number;
    qty: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

export async function createOrderAndOpenWhatsApp(orderData: OrderData) {
  try {
    // Generate order number
    const orderNumber = await generateOrderNumber();

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        total: orderData.total,
        shipping_address: orderData.shippingAddress,
        billing_address: orderData.shippingAddress, // Use shipping as billing for now
        notes: orderData.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      // We don't yet have a reliable UUID product_id in the cart (often it's a slug),
      // so we store only the name/price here and keep product_id null for now.
      product_id: null,
      product_name: item.title,
      quantity: item.qty,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Format WhatsApp message
    const whatsappMessage = formatWhatsAppMessage(orderNumber, orderData);

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp phone number (you can make this configurable via env)
    const whatsappPhone = process.env.WHATSAPP_PHONE || "233XXXXXXXXX"; // Replace with your WhatsApp business number
    // Remove any non-digit characters from phone number
    const cleanPhone = whatsappPhone.replace(/\D/g, "");

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Redirect to WhatsApp
    redirect(whatsappUrl);
  } catch (error) {
    console.error("Error in createOrderAndOpenWhatsApp:", error);
    throw error;
  }
}

async function generateOrderNumber(): Promise<string> {
  // Get count of orders today
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lt("created_at", `${today}T23:59:59.999Z`);

  const orderCount = (count || 0) + 1;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${dateStr}-${String(orderCount).padStart(4, "0")}`;
}

function formatWhatsAppMessage(orderNumber: string, orderData: OrderData): string {
  const itemsText = orderData.items
    .map((item) => `• ${item.title} x${item.qty} - ${formatCurrency(item.price * item.qty)}`)
    .join("\n");

  const shippingAddressText = [
    orderData.shippingAddress.street,
    orderData.shippingAddress.city,
    orderData.shippingAddress.region,
    orderData.shippingAddress.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return `🛒 *New Order - ${orderNumber}*

*Customer Information:*
👤 Name: ${orderData.customerName}
📧 Email: ${orderData.customerEmail}
📱 Phone: ${orderData.customerPhone}

*Shipping Address:*
📍 ${shippingAddressText}

*Order Items:*
${itemsText}

*Order Summary:*
Subtotal: ${formatCurrency(orderData.subtotal)}
Shipping: ${orderData.shipping === 0 ? "Free" : formatCurrency(orderData.shipping)}
*Total: ${formatCurrency(orderData.total)}*

${orderData.notes ? `*Notes:*\n${orderData.notes}\n\n` : ""}Please confirm this order. Thank you! 🙏`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
}
