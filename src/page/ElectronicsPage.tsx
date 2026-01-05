
'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/product';

const ElectronicsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // This is a placeholder for your actual API call.
      // You should replace this with a call to your products API.
      const data = [
        { id: 1, name: 'Laptop', price: 1200, brand: 'BrandA', stock: 10 },
        { id: 2, name: 'Smartphone', price: 800, brand: 'BrandB', stock: 20 },
        { id: 3, name: 'Headphones', price: 150, brand: 'BrandA', stock: 30 },
      ];
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products.');
      toast({
        title: 'Error',
        description: `Failed to fetch products: ${err.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [search, products]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Electronics</h1>
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
      </div>
      
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 md:p-4">S.N.</TableHead>
                  <TableHead className="p-2 md:p-4">Name</TableHead>
                  <TableHead className="p-2 md:p-4">Brand</TableHead>
                  <TableHead className="text-right p-2 md:p-4">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="p-2 md:p-4">{index + 1}</TableCell>
                      <TableCell className="font-medium p-2 md:p-4">{product.name}</TableCell>
                      <TableCell className="font-medium p-2 md:p-4">{product.brand}</TableCell>
                      <TableCell className="text-right p-2 md:p-4">${product.price}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElectronicsPage;
