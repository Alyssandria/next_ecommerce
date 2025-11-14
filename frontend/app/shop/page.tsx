"use client";

import { ProductCard } from "@/components/product-card";
import { fetchApi } from "@/lib/utils";
import { ApiResponse, Product } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const res = await fetchApi('/products');


      const json = await res.json() as ApiResponse<null>;

      if (!json.success) {
        setTimeout(() => toast.error("Something went wrong, Please try again later"))
        return;
      }

      const items = json.data as { limit: number, products: Product[], skip: number, total: number }

      setProducts(items.products);
      setLoading(false);
      console.log(json);
    }

    fetchData();

  }, []);

  return (
    <div>
      {products.map(el => (
        <ProductCard data={el} />
      ))}
      Hello from shop
    </div>
  )
}
