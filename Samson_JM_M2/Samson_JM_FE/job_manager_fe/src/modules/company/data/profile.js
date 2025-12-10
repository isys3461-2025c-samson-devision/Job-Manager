const mockProfile = {
  name: "DEVision",
  title: "Employer",
  email: "hr@devision.com",
  phone: "+084 123 456 789",
  location: "Ho Chi Minh City, Vietnam",
  about:
    "DEVision is a fast-growing software company focusing on HR tech solutions for SMEs in Southeast Asia. We build scalable, cloud-native systems that connect job seekers and employers across the region.",
  media: [
    {
      id: 1,
      type: "image",
      label: "Office space",
      url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    },
    {
      id: 2,
      type: "image",
      label: "Team culture",
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
    {
      id: 3,
      type: "video",
      label: "Company introduction",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ],
  skillsNeeded: [
    "Java",
    "Spring Boot",
    "React",
    "TypeScript",
    "Microservices",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
  ],
  achievements: [
    {
      title: "Top 10 HR Tech Startup Vietnam 2024",
      description: "Recognised for innovation in recruitment platforms.",
    },
    {
      title: "50+ Enterprise Customers",
      description: "Serving clients across Vietnam and Southeast Asia.",
    },
    {
      title: "ISO 27001 Ready",
      description: "Strong focus on data security and compliance.",
    },
  ],
};

export default mockProfile;
