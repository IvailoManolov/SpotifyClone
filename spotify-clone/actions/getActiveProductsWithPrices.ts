import { ProductWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { merge } from "@supabase/auth-ui-shared";
import { cookies } from "next/headers";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .order('unit_amount');

    // Extract product IDs from the prices data
    // @ts-ignore
    const productIds = pricesData.map((price) => price.product_id);

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('active', true)
        .order('metadata->index')

    // Create a map to quickly look up prices by product_id
    // @ts-ignore
    const priceMap = new Map(pricesData.map((price) => [price.product_id, price]));

    // Merge product data with prices based on product_id
    // @ts-ignore
    const mergedData = data.map((product) => ({
        ...product,

        // @ts-ignore
        prices: pricesData.filter((price) => price.product_id === product.id),
    }));


    if (error) {
        console.log(error);
    }

    return (mergedData as any) || [];
}

export default getActiveProductsWithPrices;