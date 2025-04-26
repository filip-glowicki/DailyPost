"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateCategory } from "@/actions/categories";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_DESCRIPTION_LENGTH = 250;

const formSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Opis musi mieć maksymalnie ${MAX_DESCRIPTION_LENGTH} znaków`,
    ),
});

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await generateCategory({
        name: data.name,
        description: data.description,
      });

      toast({
        title: "Sukces",
        description: "Kategoria została utworzona poprawnie.",
      });

      form.reset();
      onSuccess();
    } catch {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się utworzyć kategorii. Spróbuj ponownie.",
      });
    }
  };

  const descriptionLength = form.watch("description")?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="category-name">Nazwa</FormLabel>
              <FormControl>
                <Input
                  id="category-name"
                  placeholder="Wpisz nazwę kategorii"
                  aria-label="Nazwa kategorii"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="category-description">Opis</FormLabel>
                <span
                  className={`text-sm ${descriptionLength > MAX_DESCRIPTION_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
                  aria-label={`${descriptionLength} z ${MAX_DESCRIPTION_LENGTH} znaków`}
                >
                  {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <FormControl>
                <Textarea
                  id="category-description"
                  placeholder="Wpisz opis kategorii"
                  className="resize-none"
                  aria-label="Opis kategorii"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Utwórz kategorię</Button>
      </form>
    </Form>
  );
}
