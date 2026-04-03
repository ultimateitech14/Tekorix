"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteJobDialogProps = {
  open: boolean;
  jobTitle: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteJobDialog({ open, jobTitle, isDeleting, onConfirm, onClose }: DeleteJobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => (value ? null : onClose())}>
      <DialogContent className="border-border/70 bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase tracking-[0.08em]">Delete Job</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will permanently remove <span className="text-foreground">{jobTitle}</span>. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
