export interface Preview{
    user_id: string;
    user_name: string;
    shopping_cart: Number[];
    coupon_applied: string;
    total_before_discount: Number;
    total_after_discount: Number;
    shipping_cost: Number;
    final_total: Number;
    address: string;
    payment_status: string;
    status: string;

}