import { getItemDisplayName, getItemImageUrl } from "../../utils/orders";

const ProductRow = ({ item }) => {
  const imageUrl = getItemImageUrl(item);
  const variant = item.variant || item.color || item.option || "";
  const sku = item.sku || item.product_sku || "";
  const description = item.description || item.product_description || "";
  const subtotal = Number(item.subtotal || item.price * item.quantity || 0).toLocaleString();
  const unitPrice = Number(item.price || 0).toLocaleString();

  return (
    <div className="tp-product-row">
      <div className="tp-product-row__image-cell">
        {imageUrl ? (
          <img src={imageUrl} alt={getItemDisplayName(item)} className="tp-product-row__image" />
        ) : (
          <div className="tp-product-row__image tp-product-row__image--placeholder">No Image</div>
        )}
      </div>

      <div className="tp-product-row__info">
        <div className="tp-product-row__name">{getItemDisplayName(item)}</div>
        <div className="tp-product-row__brand">{item.brand || "TechPulse"}</div>
        {sku && <div className="tp-product-row__meta">SKU: {sku}</div>}
        {variant && <div className="tp-product-row__meta">Variant: {variant}</div>}
        {description && <div className="tp-product-row__description">{description}</div>}
      </div>

      <div className="tp-product-row__qty">Qty {item.quantity}</div>
      <div className="tp-product-row__price">฿{unitPrice}</div>
      <div className="tp-product-row__subtotal">฿{subtotal}</div>
    </div>
  );
};

export default ProductRow;
