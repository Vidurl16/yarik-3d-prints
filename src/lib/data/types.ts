export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: string;
  print_type?: string | null;
  faction?: string | null;
  role?: string | null;
  price_cents: number;
  currency: string;
  tags: string[];
  image_url: string | null;
  is_preorder: boolean;
  is_new: boolean;
  is_active: boolean;
  preorder_date: string | null;
  stock_quantity?: number | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DbOrder {
  id: string;
  user_id: string | null;
  email: string | null;
  currency: string | null;
  total_amount_cents: number | null;
  /** Legacy status field kept for compatibility; prefer payment_status */
  status: string | null;
  payment_provider: string | null;
  payment_session_id: string | null;
  payment_status: PaymentStatus;
  payment_event_ids: string[];
  payment_metadata: Record<string, unknown>;
  paid_at: string | null;
  shipping_address?: Record<string, string> | null;
  created_at: string;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name_snapshot: string | null;
  quantity: number;
  unit_amount_cents: number;
  created_at: string;
}

export interface DbCart {
  user_id: string;
  cart_json: unknown[];
  updated_at: string;
}
