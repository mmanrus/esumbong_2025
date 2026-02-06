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

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  memberSince: string;
}

const initialProfile: ProfileData = {
  firstName: "Juan",
  lastName: "Dela Cruz",
  email: "resident@gmail.com",
  phone: "+63 912 345 6789",
  address: "123 Main Street, Purok 1",
  barangay: "Barangay San Antonio",
  memberSince: "January 2024",
};

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editedProfile, setEditedProfile] =
    useState<ProfileData>(initialProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success("Profile Updated", {
      description: "Your profile has been updated successfully.",
    });
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
                {profile.firstName[0]}
                {profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                Member since {profile.memberSince}
              </p>
            </div>
          </div>

          <Separator />

          {/* Profile Fields */}
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={editedProfile.firstName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        firstName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={editedProfile.lastName}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        lastName: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-foreground py-2">{profile.lastName}</p>
                )}
              </div>
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
                <p className="text-foreground py-2">{profile.barangay}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
