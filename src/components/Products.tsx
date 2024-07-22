import { Fragment } from "react/jsx-runtime";
import { useProduct, useProducts } from "../services/queries";
import { useState } from "react";

export default function Products() {
  const productsQuery = useProducts();
  const [selectProductId, setSelectProductId] = useState<number | null>(null);
  const productQuery = useProduct(selectProductId);
  return (
    <>
      {productsQuery.data?.pages.map((group, index) => (
        <Fragment key={index}>
          <div style={{ display: "flex", flexDirection: "column", width: '6.5rem' }}>
            {group.map((product) => (
              <button key={product.id} onClick={() => setSelectProductId(product.id)}>
                {product.name}
              </button>
            ))}
          </div>
        </Fragment>
      ))}
      <br />
      <div>
        <button
          onClick={() => productsQuery.fetchNextPage()}
          disabled={
            productsQuery.isFetchingNextPage || !productsQuery.hasNextPage
          }
        >
          {productsQuery.isFetchingNextPage
            ? "Loading more..."
            : productsQuery.hasNextPage
            ? "Load More"
            : "End of list"}
        </button>
      </div>
      <div>Selected list:</div>
      {JSON.stringify(productQuery.data)}
    </>
  );
}
