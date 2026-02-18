"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/authContext";
import { formatDate } from "@/lib/formatDate";
import { profileSchema } from "@/defs/definitions";

interface ProfileData {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  barangay?: string;
  memberSince?: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    fullname: user?.fullname,
    email: user?.email,
    phone: user?.contactNumber,
    address: user?.address,
    barangay: user?.barangay,
    memberSince: user?.createdAt
      ? formatDate(new Date(user.createdAt))
      : undefined,
  });

  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const result = profileSchema.safeParse(editedProfile);
      if (!result.success) {
        const firstError = result.error.issues[0].message;
        toast.warning(firstError);
        return;
      }
      const res = await fetch(`/api/users/update/${user?.id}`, {
        method: "PATCH",
        body: JSON.stringify(editedProfile),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        toast.error("Something went wrong upon updating your profile.");
        return;
      }
      setProfile(editedProfile);

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast.error("Something went wrong");
      
    } finally {
      setIsEditing(false);
      setIsLoading(false)
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-primary">
                My Profile
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {profile.fullname ? profile?.fullname[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{profile.fullname}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                Member since {profile.memberSince}
              </p>
            </div>
          </div>

          <Separator />

          {/* Profile Fields */}
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  className="w-full"
                  id="fullname"
                  type="text"
                  value={editedProfile.fullname}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      fullname: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-foreground py-2">{profile.fullname}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      email: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-foreground py-2">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-foreground py-2">{profile.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Address
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editedProfile.address}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      address: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-foreground py-2">{profile.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              {isEditing ? (
                <Input
                  id="barangay"
                  value={editedProfile.barangay}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      barangay: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="text-foreground py-2">
                  {profile.barangay ? profile.barangay : "Unaffiliated"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
