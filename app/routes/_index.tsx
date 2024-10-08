import { useState } from "react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { MapPin } from "lucide-react";

export const loader = async ({}: LoaderFunctionArgs) => {
  const cities = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Berlin", "Rome", "Moscow", "Dubai", "Singapore",
    "Barcelona", "Amsterdam", "Vienna", "Prague", "Seoul",
    "Bangkok", "Istanbul", "Rio de Janeiro", "Cape Town", "Toronto"
  ];
  return json({ cities });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const selectedCities = formData.getAll("selectedCities");
  // Here you would typically save the selected cities to a database
  return json({ message: `Saved ${selectedCities.length} cities` });
};

export default function Index() {
  const { cities } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const handleCitySelect = (city: string) => {
    setSelectedCities((prev) => 
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">City Selector</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Selected Cities</h2>
        <ScrollArea className="h-32 border rounded-md p-2">
          {selectedCities.length > 0 ? (
            <ul>
              {selectedCities.map((city) => (
                <li key={city} className="flex items-center mb-2">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No cities selected</p>
          )}
        </ScrollArea>
      </div>

      <Select onValueChange={handleCitySelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Form method="post" className="mt-6">
        {selectedCities.map((city) => (
          <input key={city} type="hidden" name="selectedCities" value={city} />
        ))}
        <Button type="submit" className="w-full">
          Save Selected Cities
        </Button>
      </Form>

      {actionData?.message && (
        <p className="mt-4 text-green-600 text-center">{actionData.message}</p>
      )}
    </div>
  );
}