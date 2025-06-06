"use client";

import { CategoryDTO } from "@/types/database-types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
  category: CategoryDTO;
  onConfirmDelete: () => void;
}

export function AlertDialog({ category, onConfirmDelete }: AlertDialogProps) {
  return (
    <BaseAlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Usuń
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Usuń kategorię</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć kategorię &quot;{category.name}&quot;?
            Tej akcji nie można cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </BaseAlertDialog>
  );
}
