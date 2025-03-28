import React, { useState } from "react";
import { EmployeeLayout } from "@/components/employee/employee-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { FileInput } from "@/components/ui/file-input";
import { User } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(user?.photo || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: "",
      linkedinUrl: "",
      location: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // We can directly use the already compressed image from the profilePhotoPreview state
      let photoDataUrl = profilePhotoPreview;
      
      // Update the profile with the form data
      await updateProfile({
        ...data,
        // photo: photoDataUrl || undefined
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Helper function to compress images
  const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round(height * maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round(width * maxHeight / height);
              height = maxHeight;
            }
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to data URL with compression
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const handleProfilePhotoChange = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      setProfilePhoto(file);
      
      try {
        // Compress the image before preview
        const compressedDataUrl = await compressImage(file);
        setProfilePhotoPreview(compressedDataUrl);
      } catch (error) {
        console.error('Failed to compress image:', error);
        
        // Fallback to original file reader if compression fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="documents">Documents & Certificates</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-1/3">
                        <div className="text-center">
                          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
                            {profilePhotoPreview ? (
                              <img
                                src={profilePhotoPreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-12 w-12 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="profile-photo"
                            className="text-sm text-primary font-medium cursor-pointer"
                          >
                            {profilePhotoPreview ? "Change Photo" : "Upload Photo"}
                          </label>
                          <input
                            id="profile-photo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleProfilePhotoChange(e.target.files)}
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Berlin, Germany" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>LinkedIn Profile</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="url" 
                                    placeholder="https://linkedin.com/in/username" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell us a little about yourself"
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="mr-2"
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/3">
                    <div className="text-center">
                      <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-2">
                        {profilePhotoPreview ? (
                          <img
                            // src={profilePhotoPreview}
                            // alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900">
                        User
                      </h3>
                      <p className="text-sm text-gray-500">Frontend Developer</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-2/3">
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.firstName} {user?.lastName}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.email}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          {user?.phone || "-"}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          Berlin, Germany
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          -
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Bio</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                          Passionate ML Engineer with expertise in Python, TypeScript, and modern web development techniques. Dedicated to creating intuitive and responsive user interfaces.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">Python</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">C++</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">JavaScript</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">HTML/CSS</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">Tailwind CSS</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">Machine Learning</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                  <div className="mt-3 space-y-4">
                    <div className="border-l-2 border-primary pl-4 pb-2">
                      <h4 className="text-md font-medium text-gray-900">AI Engineer</h4>
                      <p className="text-sm text-gray-600">XYZ Tech • 2020 - Present</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Developed Machine Learning Models using Python, JavaScript, and R.
                      </p>
                    </div>
                    <div className="border-l-2 border-gray-200 pl-4 pb-2">
                      <h4 className="text-md font-medium text-gray-900">Junior Developer</h4>
                      <p className="text-sm text-gray-600">ABC Company • 2018 - 2020</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Assisted in the development of responsive websites and web applications.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  <div className="mt-3 space-y-4">
                    <div className="border-l-2 border-primary pl-4 pb-2">
                      <h4 className="text-md font-medium text-gray-900">Bachelor of Science in Artificial Intelligence</h4>
                      <p className="text-sm text-gray-600">Szabist University Islamabad • 2024 - 2028</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Resume/CV</h3>
                  <div className="mt-3">
                    <FileInput
                      accept=".pdf,.doc,.docx"
                      description="PDF, DOC, DOCX up to 5MB"
                      label="Upload Resume"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
                  <div className="mt-3 space-y-3">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">React Developer Certificate</h4>
                          <p className="text-sm text-gray-600">Issued by: React Training • January 2022</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-md font-medium text-gray-900">Python Advanced</h4>
                          <p className="text-sm text-gray-600">Issued by: Python Academy • March 2021</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Certificate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Job Type Preferences</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">Full-time</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">Part-time</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">Remote</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700">Hybrid</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">Contract</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Salary Expectations</h3>
                  <div className="mt-3">
                    <div className="p-4 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-600">€60,000 - €80,000 per year</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Location Preferences</h3>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="p-3 border border-gray-200 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Berlin, Germany</p>
                      <p className="text-xs text-gray-600">Preferred</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Munich, Germany</p>
                      <p className="text-xs text-gray-600">Open to relocation</p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Remote (EU time zone)</p>
                      <p className="text-xs text-gray-600">Preferred</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Job Recommendations</p>
                        <p className="text-xs text-gray-600">Get personalized job recommendations based on your profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Application Updates</p>
                        <p className="text-xs text-gray-600">Receive updates on your job applications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Newsletter</p>
                        <p className="text-xs text-gray-600">Receive our weekly newsletter with career advice</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployeeLayout>
  );
}
