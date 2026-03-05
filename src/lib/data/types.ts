export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: string;
  price_cents: number;
  currency: string;
  tags: string[];
  image_url: string | null;
  is_preorder: boolean;
  is_new: boolean;
  is_active: boolean;
  preorder_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  email: string | null;
  currency: string | null;
  total_amount_cents: number | null;
  status: string | null;
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
