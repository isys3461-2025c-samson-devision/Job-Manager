import JobPostPreviewCard from "./JobPostPreviewCard";

export default function JobPostPreviewList({ posts }) {
  return (
    <div>
      <h5 className="fw-bold mb-3">Recent Job Posts</h5>
      {posts.map((post, i) => (
        <JobPostPreviewCard key={i} {...post} />
      ))}
    </div>
  );
}
