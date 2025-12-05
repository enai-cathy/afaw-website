import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import CONFIG from "../config";
import { Helmet } from "react-helmet";
import { extractIdFromSlug, createSlugWithId } from "../utils/slugify";
import { marked } from "marked";

const API_BASE = CONFIG.apiBaseUrl;

const SinglePost = () => {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    // Extract ID from slug (e.g., "my-blog-post-123" -> 123)
    const postId = extractIdFromSlug(slug);
    
    if (!postId) {
      setError("Invalid post URL");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/posts/${postId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Post not found");
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setPost(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => (mounted = false);
  }, [slug]);

  // Validate and redirect to canonical URL if slug doesn't match
  useEffect(() => {
    if (post && slug) {
      const correctSlug = createSlugWithId(post.title, post.id);
      if (slug !== correctSlug) {
        console.log(`Redirecting from wrong slug "${slug}" to correct slug "${correctSlug}"`);
        navigate(`/blogs/${correctSlug}`, { replace: true });
      }
    }
  }, [post, slug, navigate]);

  const renderedContent = useMemo(() => {
    if (!post?.content) {
      return "";
    }
    return marked.parse(post.content);
  }, [post]);

  if (loading) {
    return (
      <Layout title="Loading... - Africa Access Water">
        <div
          style={{
            paddingTop: window.innerWidth < 768 ? "95px" : "130px",
            backgroundColor: "#001d23",
          }}
        />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout title="Post Not Found - Africa Access Water">
        <div
          style={{
            paddingTop: window.innerWidth < 768 ? "95px" : "130px",
            backgroundColor: "#001d23",
          }}
        />
        <div className="container mt-5">
          <div className="text-center">
            <h1 className="mb-3">Post Not Found</h1>
            <p className="text-muted">{error || "The post you're looking for doesn't exist."}</p>
            <Link to="/posts" className="btn btn-primary mt-3">
              Back to Posts
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Africa Access Water</title>
        <meta name="description" content={post.content.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.substring(0, 160)} />
        <meta property="og:image" content={post.image_url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
      </Helmet>

      <Layout title={`${post.title} - Africa Access Water`}>
        {/* Spacer to prevent navbar overlap */}
        <div
          style={{
            paddingTop: window.innerWidth < 768 ? "95px" : "130px",
            backgroundColor: "#001d23",
          }}
        />

        <div className="container-xxl mb-5 pb-5">
          <div className="container mt-5">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/posts">Posts</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Post Content */}
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <article>
                  {/* Post Header */}
                  <div className="mb-4">
                    <span className="badge bg-primary mb-2 text-uppercase">
                      {post.type}
                    </span>
                    <h1 className="display-4 fw-bold mb-3">{post.title}</h1>
                    <div className="text-muted">
                      <small>
                        Published on{" "}
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </small>
                    </div>
                  </div>

                  {/* Featured Image */}
                  {post.image_url && (
                    <div className="mb-4">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="img-fluid rounded shadow-lg w-100"
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  {/* Post Body */}
                  <div
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                  />

                  {/* Author info if available */}
                  {post.author_name && (
                    <div className="mt-5 pt-4 border-top">
                      <div className="d-flex align-items-center">
                        <div>
                          <h5 className="mb-1">Written by {post.author_name}</h5>
                          {post.author_bio && (
                            <p className="text-muted mb-0">{post.author_bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>

                {/* Back to Posts Button */}
                <div className="mt-5 text-center">
                  <Link to="/posts" className="btn btn-outline-primary">
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to All Posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SinglePost;
