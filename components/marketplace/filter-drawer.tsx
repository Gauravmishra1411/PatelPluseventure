
"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";


const categories = ["Templates", "UI Kits", "Icons", "Themes", "Framer", "Webflow", "Illustrations", "Mobile"];
const ratings = [5, 4, 3, 2, 1];

export default function FilterDrawer() {
  const [priceRange, setPriceRange] = useState([50]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Refine your search to find the perfect product.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-6">
          
          <div>
            <Label className="text-lg font-semibold">Category</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
                {categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category.toLowerCase()} />
                        <Label htmlFor={category.toLowerCase()}>{category}</Label>
                    </div>
                ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label htmlFor="price-range" className="text-lg font-semibold">Price Range</Label>
            <div className="flex items-center gap-4 mt-2">
                <span>₹0</span>
                <Slider id="price-range" max={500} step={10} value={priceRange} onValueChange={setPriceRange} />
                <span>₹{priceRange[0]}</span>
            </div>
          </div>

          <Separator />

          <div>
             <Label className="text-lg font-semibold">Rating</Label>
             <RadioGroup defaultValue="any" className="mt-2">
                {ratings.map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
                        <Label htmlFor={`rating-${rating}`}>{rating} Stars & Up</Label>
                    </div>
                ))}
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="rating-any" />
                    <Label htmlFor="rating-any">Any</Label>
                </div>
             </RadioGroup>
          </div>
        </div>
        <div className="p-4 border-t">
            <Button className="w-full">Apply Filters</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
