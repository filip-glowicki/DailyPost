"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CategoriesResponseDTO, PostDTO } from "@/types/database-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CategorySelect } from "./CategorySelect";
import { LengthSlider } from "./LengthSlider";

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Tytuł jest wymagany")
    .max(200, "Tytuł jest za długi"),
  prompt: z.string().max(500, "Prompt jest za długi").optional(),
  category_id: z.string().min(1, "Kategoria jest wymagana"),
  size: z.string().optional(),
  content: z.string().max(5000, "Treść jest za długa").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: PostDTO | null;
  categories: CategoriesResponseDTO;
  mode: "auto" | "manual" | "edit";
  isLoading: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  onModeChange: (mode: "auto" | "manual") => void;
}

export function PostForm({
  initialData,
  categories,
  mode,
  isLoading,
  onSubmit,
  onModeChange,
}: PostFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      prompt: initialData?.prompt || "",
      category_id: initialData?.category_id || "",
      size: initialData?.size || "medium",
      content: initialData?.content || "",
    },
  });

  const isAutoMode = mode === "auto";
  const isEditMode = mode === "edit";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        data-test-id="post-form"
      >
        {!isEditMode && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAutoMode}
              onCheckedChange={(checked) =>
                onModeChange(checked ? "auto" : "manual")
              }
              aria-label="Generowanie AI"
              data-test-id="ai-generation-switch"
            />
            <Label>Generowanie AI</Label>
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tytuł</FormLabel>
              <FormControl>
                <Input
                  placeholder="Wprowadź tytuł posta"
                  {...field}
                  data-test-id="post-title-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <FormControl>
                <CategorySelect
                  categories={categories}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAutoMode && (
          <>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Wprowadź prompt dla generacji AI"
                        className="min-h-[100px]"
                        maxLength={500}
                        {...field}
                        data-test-id="post-prompt-textarea"
                      />
                      <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                        {field.value?.length || 0}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Długość posta</FormLabel>
                  <FormControl>
                    <LengthSlider
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {!isAutoMode && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treść</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Wprowadź treść posta"
                      className="min-h-[200px]"
                      maxLength={5000}
                      {...field}
                      data-test-id="post-content-textarea"
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {field.value?.length || 0}/5000
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          data-test-id="post-submit-button"
        >
          {isLoading
            ? "Ładowanie..."
            : isEditMode
              ? "Zapisz zmiany"
              : isAutoMode
                ? "Generuj"
                : "Zapisz"}
        </Button>
      </form>
    </Form>
  );
}
