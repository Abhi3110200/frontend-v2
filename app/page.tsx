"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, UserIcon, Plus, X, ImageIcon } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"
// import { Toaster } from "@/components/ui/sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Post {
  _id: string
  content: string
  image?: string
  author: {
    _id: string
    name: string
    email: string
    profilePicture?: string
  }
  createdAt: string
}

interface UserProfile {
  _id: string
  name: string
  email: string
  profilePicture?: string
  bio?: string
}

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchPosts()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      // Fixed: Changed from /auth/user to /auth/me to match backend
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        console.log("User authenticated:", userData) // Debug log
      } else {
        console.log("Auth failed, removing token") // Debug log
        localStorage.removeItem("token")
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)
      if (response.ok) {
        const postsData = await response.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() && !selectedImage) return

    setPosting(true)
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("content", newPost)
      if (selectedImage) {
        formData.append("image", selectedImage)
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const post = await response.json()
        setPosts([post, ...posts])
        setNewPost("")
        setSelectedImage(null)
        setImagePreview(null)
        toast.success("Post created successfully!")
      } else {
        toast.error("Failed to create post")
      }
    } catch (error) {
      console.error("Failed to create post:", error)
      toast.error("Failed to create post")
    } finally {
      setPosting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">LinkedIn</h1>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => router.push(`/profile/${user?._id}`)}
                className="flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <Button variant="ghost" size="sm" onClick={() => router.push(`/profile/${user?._id}`)} className="p-2">
                <UserIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:py-8 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="sm:mb-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Create Post */}
        <Card className="sm:mb-8 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create a Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover max-h-64 w-full"
                  />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="post-image" />
                  <label htmlFor="post-image">
                    <Button variant="outline" size="sm" className="cursor-pointer bg-transparent" asChild>
                      <span>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Image
                      </span>
                    </Button>
                  </label>
                </div>

                <Button
                  onClick={handleCreatePost}
                  disabled={(!newPost.trim() && !selectedImage) || posting}
                  className="ml-auto"
                >
                  {posting ? "Posting..." : "Share Post"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="sm:space-y-6 space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Community Feed</h3>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-8 sm:py-12 text-center">
                <p className="text-gray-500 text-sm sm:text-base">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      {post?.author?.profilePicture ? (
                        <AvatarImage src={post.author.profilePicture || "/placeholder.svg"} alt={post.author.name} />
                      ) : (
                        <AvatarFallback className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          {post.author.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      )}



                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col items-start md:flex-row md:items-center gap-0 mb-2  md:mb-2 md:gap-2">
                        <button
                          onClick={() => router.push(`/profile/${post.author._id}`)}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {post.author.name}
                        </button>
                        <span className="text-gray-500 text-sm">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                      {post.image && (
                        <div className="mt-3">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt="Post image"
                            width={500}
                            height={400}
                            className="rounded-lg object-cover max-h-96 w-full"
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
