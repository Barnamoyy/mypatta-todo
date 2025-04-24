import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Field = {
  label: string;
  placeholder: string;
  id: string;
  type: string;
  options?: string[];
};

type ModalProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  fields: Field[];
  onSubmit?: (values: Record<string, string>) => void;
  showCancelButton?: boolean;
  buttonColor?: string;
};

const Modal = ({
  dialogOpen,
  setDialogOpen,
  title = "Create New List",
  description = "Create a new list to organize your ideas.",
  fields,
  onSubmit,
  showCancelButton,
  buttonColor,
}: ModalProps) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // reset form values when dialog opens
  useEffect(() => {
    if (!dialogOpen) {
      setFormValues({});
    }
  }, [dialogOpen]);

  const handleChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleContinue = () => {
    if (onSubmit) {
      onSubmit(formValues);
    }
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md bg-[#f9f9f9]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                placeholder={field.placeholder}
                value={formValues[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                type={field.type}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="grid grid-cols-2">
          <DialogClose asChild>
            <>
              {showCancelButton && (
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border border-gray-300 text-gray-600"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              )}
              <Button
                type="button"
                variant="secondary"
                className={`text-white ${buttonColor ?? 'bg-green-600'}`}
                onClick={handleContinue}
              >
                Continue
              </Button>
            </>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
