interface CartItemProps {
  item: {
    name: string;
    //size: string;
    quantity: number;
    //vendor: string;
    price: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => (
  <div className="flex border-b pb-6">
    {/* Image */}
    <div className="w-24 h-24 bg-gray-300 mr-4 flex-shrink-0" />

    {/* Info */}
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          <p className="text-lg font-bold">${item.price}</p>
        </div>
        <div className="flex items-end">
          <p className="text-sm text-gray-600 underline cursor-pointer">Remove</p>
        </div>
      </div>
    </div>
  </div>
);

export default CartItem;

//<p>Size: {item.size}</p>
//<p className="text-sm text-gray-500 mt-1">by {item.vendor}</p>