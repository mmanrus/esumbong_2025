import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export default function UserDetailsDialog({
  open,
  onOpenChange,
  user,
  onDelete,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (userId: any) => void;
  onUpdate: (updatedUser: any) => void;

  user: any;
}) {
  // inside your component
  useEffect(() => {
    setFullname(user?.fullname || "");
    setEmail(user?.email || "");
    setContactNumber(user?.contactNumber || "");
    setType(user?.type || "");
    setPassword("");
    setChangePassword(false);
    setUnlockFullname(true);
    setUnlockEmail(true);
    setUnlockNumber(true);
    setIsEditing(true);
  }, [user]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(true);
  const [unlockFullname, setUnlockFullname] = useState(true);

  const [unlockType, setUnlockType] = useState(true);
  const [unlockEmail, setUnlockEmail] = useState(true);

  const [unlockNumber, setUnlockNumber] = useState(true);
  const [fullname, setFullname] = useState(user?.fullname);
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber);
  const [email, setEmail] = useState(user?.email);
  const [type, setType] = useState(user?.type);
  const [changePassword, setChangePassword] = useState(false);
  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/delete/${userId}`, {
        credentials: "include",
        method: "DELETE",
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ? error : "Error upon deleting user");
        setIsLoading(false);
        return;
      }
      const { message } = await res.json();
      toast.success(message);

      onDelete(user?.id); // remove from parent state
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = async () => {
    const formData = new FormData();

    // Only append if the field is unlocked AND has changed
    let hasChanges = false;
    if (!unlockFullname && fullname !== user.fullname) {
      formData.append("fullname", fullname);
      hasChanges = true;
    }
    if (!unlockNumber && contactNumber !== user.contactNumber) {
      formData.append("contactNumber", contactNumber);
      hasChanges = true;
    }
    if (!unlockEmail && email !== user.email) {
      formData.append("email", email);
      hasChanges = true;
    }
    if (!unlockType && type !== user.type) {
      formData.append("type", type);
      hasChanges = true;
    }
    if (changePassword && password.trim() !== "") {
      formData.append("password", password);
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.warning("No changes to save.");
      return;
    }
    try {
      const res = await fetch(`/api/users/update/${user?.id}`, {
        credentials: "include",
        method: "PATCH",
        body: formData,
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ? error : "Error upon editing user");
        return;
      }
      const { message } = await res.json();

      const updatedUser = {
        ...user,
        fullname,
        email,
        contactNumber,
        type,
      };
      if (onUpdate && updatedUser) onUpdate(updatedUser);
      toast.success(message);
      setIsEditing(true);
      return;
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col">
        <DialogHeader className="flex flex-row gap-3 items-center">
          <DialogTitle>User update or delete</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="input-demo-disabled">
            Email
            <Checkbox
              className="data-[state=checked]:"
              disabled={isEditing}
              checked={unlockEmail}
              onCheckedChange={(unlockEmail) => setUnlockEmail(!!unlockEmail)}
            />
          </FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEditing || unlockEmail}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-disabled">
            Fullname
            <Checkbox
              disabled={isEditing}
              checked={unlockFullname}
              onCheckedChange={(unlockFullname) =>
                setUnlockFullname(!!unlockFullname)
              }
            />
          </FieldLabel>

          <Input
            type="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            disabled={isEditing || unlockFullname}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-disabled">
            Contact Number
            <Checkbox
              disabled={isEditing}
              checked={unlockNumber}
              onCheckedChange={(checked) => setUnlockNumber(!!checked)}
            />
          </FieldLabel>

          <Input
            type="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            disabled={isEditing || unlockNumber}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="input-demo-disabled">
            Role
            <Checkbox
              disabled={isEditing}
              checked={unlockType}
              onCheckedChange={(checked) => setUnlockType(!!checked)}
            />
          </FieldLabel>
          <Select
            defaultValue={user?.type}
            onValueChange={setType}
            value={type}
            disabled={isEditing || unlockType}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer">
              <SelectItem value="barangay_official">
                Barangay Official
              </SelectItem>
              <SelectItem value="resident">Resident</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldGroup className="max-w-sm">
          <Field orientation="horizontal">
            <Checkbox
              id="terms-checkbox"
              name="terms-checkbox"
              disabled={isEditing}
              onCheckedChange={(checked) => setChangePassword(!!checked)}
              checked={changePassword}
            />
            <Label htmlFor="terms-checkbox">Change Password</Label>
          </Field>
        </FieldGroup>
        <div className="flex flex-row gap-2 items-center transition-all duration-200 ease-in-out">
          {!isEditing && (
            <Button
              className={`w-fit transform transition-all duration-200 ${
                isEditing ? "opacity-0 scale-90" : "opacity-100 scale-100"
              }`}
              disabled={isLoading}
              onClick={handleEdit}
            >
              Save
            </Button>
          )}
          <Button onClick={() => deleteUser(user?.id)}>
            {user?.isActive === true ? "Restrict user" : "Unrestrict user"}
          </Button>

          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Enable Editing" : "Disable Editing"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
