import { useEffect, useState } from 'react'
import {
  Search,
  Heart,
  MessageSquare,
  Share2,
  TrendingUp,
  PlusCircle,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

type Post = {
  id: string
  author: string
  time: string
  tag: string
  text: string
  likes: number
  comments: number
  liked: boolean
}

type Comment = {
  id: string
  postId: string
  author: string
  text: string
  time: string
}

const TRENDING = [
  '#IrregularPeriods',
  '#PCOSsupport',
  '#PostpartumBody',
  '#FertilityJourney',
  '#PeriodPoverty',
]

const TAGS = [
  'Symptoms',
  'Mental health',
  'PCOS',
  'Fertility',
  'General',
]

const API_URL = 'http://localhost:5000/api/community'

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const [query, setQuery] = useState('')

  const [isPostModalOpen, setIsPostModalOpen] =
    useState(false)

  const [selectedPost, setSelectedPost] =
    useState<Post | null>(null)

  const [newPostText, setNewPostText] =
    useState('')

  const [newPostTag, setNewPostTag] =
    useState('General')

  const [newComment, setNewComment] =
    useState('')

  const [loadingPosts, setLoadingPosts] =
    useState(true)

  const [loadingComments, setLoadingComments] =
    useState(false)

  const [creatingPost, setCreatingPost] =
    useState(false)

  const [addingComment, setAddingComment] =
    useState(false)

  // ==========================================
  // GET TOKEN
  // ==========================================

  function getToken() {
    return localStorage.getItem('token')
  }

  // ==========================================
  // FETCH ALL POSTS
  // ==========================================

  async function fetchPosts() {
    try {
      setLoadingPosts(true)

      const token = getToken()

      if (!token) {
        console.error('No authentication token found')
        setPosts([])
        return
      }

      const response = await fetch(
        `${API_URL}/posts`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch posts'
        )
      }

      setPosts(data.posts || [])
    } catch (error) {
      console.error(
        'Failed to load community posts:',
        error
      )
    } finally {
      setLoadingPosts(false)
    }
  }

  // ==========================================
  // LOAD POSTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchPosts()
  }, [])

  // ==========================================
  // CREATE POST
  // ==========================================

  async function createPost() {
    const text = newPostText.trim()

    if (!text) return

    try {
      setCreatingPost(true)

      const token = getToken()

      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(
        `${API_URL}/posts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
            tag: newPostTag,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to create post'
        )
      }

      setPosts((currentPosts) => [
        data.post,
        ...currentPosts,
      ])

      setNewPostText('')
      setNewPostTag('General')
      setIsPostModalOpen(false)
    } catch (error) {
      console.error(
        'Failed to create post:',
        error
      )
    } finally {
      setCreatingPost(false)
    }
  }

  // ==========================================
  // LIKE / UNLIKE POST
  // ==========================================

  async function toggleLike(id: string) {
    try {
      const token = getToken()

      if (!token) {
        console.error('No authentication token found')
        return
      }

      // Optimistic UI update
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked
                  ? Math.max(0, post.likes - 1)
                  : post.likes + 1,
              }
            : post
        )
      )

      if (selectedPost?.id === id) {
        setSelectedPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                liked: !currentPost.liked,
                likes: currentPost.liked
                  ? Math.max(
                      0,
                      currentPost.likes - 1
                    )
                  : currentPost.likes + 1,
              }
            : null
        )
      }

      const response = await fetch(
        `${API_URL}/posts/${id}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to update like'
        )
      }

      // Sync with backend result
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                likes: data.likes,
                liked: data.liked,
              }
            : post
        )
      )

      if (selectedPost?.id === id) {
        setSelectedPost((currentPost) =>
          currentPost
            ? {
                ...currentPost,
                likes: data.likes,
                liked: data.liked,
              }
            : null
        )
      }
    } catch (error) {
      console.error(
        'Failed to update like:',
        error
      )

      // Reload correct state from database
      fetchPosts()
    }
  }

  // ==========================================
  // GET COMMENTS
  // ==========================================

  async function fetchComments(postId: string) {
    try {
      setLoadingComments(true)

      const token = getToken()

      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(
        `${API_URL}/posts/${postId}/comments`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to fetch comments'
        )
      }

      setComments(data.comments || [])
    } catch (error) {
      console.error(
        'Failed to load comments:',
        error
      )
    } finally {
      setLoadingComments(false)
    }
  }

  // ==========================================
  // OPEN COMMENTS
  // ==========================================

  function openComments(post: Post) {
    setSelectedPost(post)
    setNewComment('')
    setComments([])
    fetchComments(post.id)
  }

  // ==========================================
  // ADD COMMENT
  // ==========================================

  async function addComment() {
    const text = newComment.trim()

    if (!text || !selectedPost) return

    try {
      setAddingComment(true)

      const token = getToken()

      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(
        `${API_URL}/posts/${selectedPost.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to add comment'
        )
      }

      setComments((currentComments) => [
        ...currentComments,
        data.comment,
      ])

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === selectedPost.id
            ? {
                ...post,
                comments: data.commentsCount,
              }
            : post
        )
      )

      setSelectedPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              comments: data.commentsCount,
            }
          : null
      )

      setNewComment('')
    } catch (error) {
      console.error(
        'Failed to add comment:',
        error
      )
    } finally {
      setAddingComment(false)
    }
  }

  // ==========================================
  // CLOSE COMMENTS
  // ==========================================

  function closeComments() {
    setSelectedPost(null)
    setComments([])
    setNewComment('')
  }

  // ==========================================
  // TRENDING FILTER
  // ==========================================

  function filterByTrendingTag(tag: string) {
    const cleanTag = tag
      .replace('#', '')
      .toLowerCase()

    const matchingPost = posts.find((post) => {
      const searchableText =
        `${post.text} ${post.tag}`.toLowerCase()

      return searchableText.includes(cleanTag)
    })

    if (matchingPost) {
      setQuery(cleanTag)
    } else {
      setQuery('')
    }
  }

  // ==========================================
  // SEARCH
  // ==========================================

  const filtered = posts.filter((post) =>
    `${post.text} ${post.tag} ${post.author}`
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">
            Community
          </h1>

          <p className="text-muted-foreground mt-1">
            Ask, share and hear from people on the same
            path — fully anonymous.
          </p>
        </div>

        <Button
          onClick={() =>
            setIsPostModalOpen(true)
          }
        >
          <PlusCircle size={17} />
          New post
        </Button>
      </div>

      {/* Search */}

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search posts..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-input-background border border-border text-sm focus-ring focus-visible:border-bloom"
        />
      </div>

      {/* Main content */}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Posts */}

        <div className="lg:col-span-2 space-y-4">
          {/* Loading */}

          {loadingPosts && (
            <Card>
              <CardContent>
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Loading community posts...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts */}

          {!loadingPosts &&
            filtered.map((post) => (
              <Card key={post.id}>
                <CardContent>
                  {/* Post header */}

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-dusk-soft text-dusk flex items-center justify-center text-xs font-medium">
                        {post.author.split(' ')[1]?.[0] ||
                          'A'}
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {post.author}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {post.time}
                        </p>
                      </div>
                    </div>

                    <Badge tone="dusk">
                      {post.tag}
                    </Badge>
                  </div>

                  {/* Post */}

                  <p className="text-sm leading-relaxed mb-4">
                    {post.text}
                  </p>

                  {/* Actions */}

                  <div className="flex items-center gap-5 text-sm text-muted-foreground">
                    {/* Like */}

                    <button
                      onClick={() =>
                        toggleLike(post.id)
                      }
                      className={`flex items-center gap-1.5 focus-ring ${
                        post.liked
                          ? 'text-bloom'
                          : 'hover:text-foreground'
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={
                          post.liked
                            ? 'currentColor'
                            : 'none'
                        }
                      />

                      {post.likes}
                    </button>

                    {/* Comments */}

                    <button
                      onClick={() =>
                        openComments(post)
                      }
                      className="flex items-center gap-1.5 hover:text-foreground focus-ring"
                    >
                      <MessageSquare size={16} />

                      {post.comments}
                    </button>

                    {/* Share */}

                    <button
                      className="flex items-center gap-1.5 hover:text-foreground focus-ring"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {/* Empty state */}

          {!loadingPosts &&
            filtered.length === 0 && (
              <Card>
                <CardContent>
                  <div className="py-10 text-center">
                    <MessageSquare
                      size={32}
                      className="mx-auto mb-3 text-muted-foreground"
                    />

                    <p className="text-sm font-medium">
                      {posts.length === 0
                        ? 'No community posts yet'
                        : 'No posts found'}
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      {posts.length === 0
                        ? 'Be the first person to share something with the community.'
                        : `No posts match "${query}".`}
                    </p>

                    {posts.length === 0 && (
                      <Button
                        className="mt-4"
                        onClick={() =>
                          setIsPostModalOpen(true)
                        }
                      >
                        <PlusCircle size={16} />
                        Create first post
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Trending */}

        <Card className="h-fit">
          <CardContent>
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <TrendingUp
                size={17}
                className="text-bloom"
              />

              Trending
            </h3>

            <ul className="space-y-3">
              {TRENDING.map((tag) => (
                <li key={tag}>
                  <button
                    onClick={() =>
                      filterByTrendingTag(tag)
                    }
                    className="text-sm text-bloom hover:underline"
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* New Post Modal */}

      <Modal
        open={isPostModalOpen}
        onClose={() => {
          setNewPostText('')
          setNewPostTag('General')
          setIsPostModalOpen(false)
        }}
        title="Create a new post"
      >
        <div className="space-y-4">
          {/* Category */}

          <div>
            <label className="text-sm font-medium block mb-2">
              Category
            </label>

            <select
              value={newPostTag}
              onChange={(e) =>
                setNewPostTag(e.target.value)
              }
              className="w-full h-11 px-3 rounded-xl bg-input-background border border-border text-sm focus-ring"
            >
              {TAGS.map((tag) => (
                <option
                  key={tag}
                  value={tag}
                >
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Text */}

          <div>
            <label className="text-sm font-medium block mb-2">
              What's on your mind?
            </label>

            <textarea
              value={newPostText}
              onChange={(e) =>
                setNewPostText(e.target.value)
              }
              placeholder="Share your experience, question, or thoughts..."
              rows={5}
              className="w-full px-3.5 py-3 rounded-xl bg-input-background border border-border text-sm resize-none focus-ring"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Your post will be shared anonymously with
            the community.
          </p>

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => {
                setNewPostText('')
                setNewPostTag('General')
                setIsPostModalOpen(false)
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={createPost}
              disabled={
                !newPostText.trim() ||
                creatingPost
              }
            >
              {creatingPost
                ? 'Publishing...'
                : 'Publish post'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Comments Modal */}

      <Modal
        open={selectedPost !== null}
        onClose={closeComments}
        title="Comments"
      >
        {selectedPost && (
          <div className="space-y-5">
            {/* Original post */}

            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-dusk-soft text-dusk flex items-center justify-center text-xs font-medium">
                  {selectedPost.author.split(' ')[1]?.[0] ||
                    'A'}
                </div>

                <p className="text-xs font-medium">
                  {selectedPost.author}
                </p>
              </div>

              <p className="text-sm leading-relaxed">
                {selectedPost.text}
              </p>
            </div>

            {/* Comments list */}

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {loadingComments && (
                <div className="py-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Loading comments...
                  </p>
                </div>
              )}

              {!loadingComments &&
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 shrink-0 rounded-full bg-dusk-soft text-dusk flex items-center justify-center text-xs font-medium">
                      {comment.author.split(' ')[1]?.[0] ||
                        'A'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {comment.author}
                        </p>

                        <span className="text-xs text-muted-foreground">
                          {comment.time}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}

              {!loadingComments &&
                comments.length === 0 && (
                  <div className="py-5 text-center">
                    <MessageSquare
                      size={25}
                      className="mx-auto mb-2 text-muted-foreground"
                    />

                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to share your thoughts.
                    </p>
                  </div>
                )}
            </div>

            {/* Add comment */}

            <div className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) =>
                  setNewComment(e.target.value)
                }
                placeholder="Write a supportive comment..."
                rows={3}
                className="w-full px-3.5 py-3 rounded-xl bg-input-background border border-border text-sm resize-none focus-ring"
              />

              <Button
                onClick={addComment}
                disabled={
                  !newComment.trim() ||
                  addingComment
                }
                className="w-full"
              >
                {addingComment
                  ? 'Adding...'
                  : 'Add comment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}