"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Mail, User, Calendar, Camera, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Post {
  _id: string
  content: string
  image?: string
  createdAt: string
}

interface UserProfile {
  _id: string
  name: string
  email: string
  bio?: string
  profilePicture?: string
  createdAt: string
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [deletingPicture, setDeletingPicture] = useState(false)
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (userId && currentUser) {
      fetchProfile()
      fetchUserPosts()
    }
  }, [userId, currentUser])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setCurrentUser(userData)
      } else {
        localStorage.removeItem("token")
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      router.push("/login")
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`)
      if (response.ok) {
        const userData = await response.json()
        setProfile(userData)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      router.push("/")
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`)
      if (response.ok) {
        const postsData = await response.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error("Failed to fetch user posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 5MB")
      return
    }

    setUploadingPicture(true)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("profilePicture", file)

      const response = await fetch(`${API_BASE_URL}/users/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setProfile(updatedUser)
        setCurrentUser(updatedUser)
        toast.success("Profile picture updated successfully!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to update profile picture")
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error)
      toast.error("Failed to update profile picture")
    } finally {
      setUploadingPicture(false)
    }
  }

  const handleDeleteProfilePicture = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return

    setDeletingPicture(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/profile-picture`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setProfile(updatedUser)
        setCurrentUser(updatedUser)
        toast.success("Profile picture removed successfully!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to remove profile picture")
      }
    } catch (error) {
      console.error("Failed to delete profile picture:", error)
      toast.error("Failed to remove profile picture")
    } finally {
      setDeletingPicture(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const isOwnProfile = currentUser?._id === userId

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3"
            >
              <ArrowLeft className="h-4 w-4" />
              {/* <span className="hidden sm:inline">Back to Feed</span> */}
              {/* <span className="sm:hidden">Back</span> */}
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold text-blue-600 truncate">
              {isOwnProfile ? "My Profile" : `${profile?.name}'s Profile`}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="relative mx-auto sm:mx-0">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  {profile.profilePicture ? (
                    <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.name} />
                  ) : (
                    <AvatarFallback className="text-xl sm:text-2xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isOwnProfile && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      id="profile-picture"
                      disabled={uploadingPicture || deletingPicture}
                    />
                    <label htmlFor="profile-picture">
                      <Button
                        size="sm"
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 cursor-pointer"
                        disabled={uploadingPicture || deletingPicture}
                        asChild
                      >
                        <span>
                          {uploadingPicture ? (
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                          ) : (
                            <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                        </span>
                      </Button>
                    </label>
                    {profile.profilePicture && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={handleDeleteProfilePicture}
                        disabled={uploadingPicture || deletingPicture}
                      >
                        {deletingPicture ? (
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{profile.name}</h2>
                  {isOwnProfile && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mx-auto sm:mx-0 w-fit">
                      You
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="break-all">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Joined {formatJoinDate(profile.createdAt)}</span>
                  </div>
                </div>
                {profile.bio && (
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{profile.bio}</p>
                )}
                {isOwnProfile && (
                  <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                    <p>💡 Tip: Click the camera icon to upload a profile picture (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {isOwnProfile ? "Your Posts" : "Posts"} ({posts.length})
            </h3>
          </div>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-8 sm:py-12 text-center">
                <User className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">
                  {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      {profile.profilePicture ? (
                        <AvatarImage src={profile.profilePicture || "/placeholder.svg"} alt={profile.name} />
                      ) : (
                        <AvatarFallback className="text-xs sm:text-sm">
                          {profile.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                          {profile.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">{formatDate(post.createdAt)}</span>
                      </div>
                      {post.content && (
                        <p className="text-gray-700 whitespace-pre-wrap mb-3 text-sm sm:text-base break-words">
                          {post.content}
                        </p>
                      )}
                      {post.image && (
                        <div className="mt-3">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            width={500}
                            height={400}
                            className="rounded-lg object-cover max-h-64 sm:max-h-96 w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
