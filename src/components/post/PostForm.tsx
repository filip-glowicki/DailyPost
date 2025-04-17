"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CategoriesResponseDTO, PostDTO } from "@/types";
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
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  prompt: z.string().max(500, "Prompt is too long").optional(),
  category_id: z.string().min(1, "Category is required"),
  size: z.string().optional(),
  content: z.string().max(1000, "Content is too long").optional(),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isEditMode && (
          <div className="flex items-center space-x-2">
            <Switch
              checked={isAutoMode}
              onCheckedChange={(checked) =>
                onModeChange(checked ? "auto" : "manual")
              }
            />
            <Label>AI Generation {isAutoMode ? "Enabled" : "Disabled"}</Label>
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
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
              <FormLabel>Category</FormLabel>
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
                        placeholder="Enter your prompt for AI generation"
                        className="min-h-[100px]"
                        maxLength={500}
                        {...field}
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
                  <FormLabel>Post Length</FormLabel>
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
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Enter your post content"
                      className="min-h-[200px]"
                      maxLength={1000}
                      {...field}
                    />
                    <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                      {field.value?.length || 0}/1000
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Loading..."
            : isEditMode
              ? "Save Changes"
              : isAutoMode
                ? "Generate Post"
                : "Save Post"}
        </Button>
      </form>
    </Form>
  );
}
