import React, { createContext, useContext, useEffect, useState } from "react";

const TestimonialContext = createContext();

export const TestimonialProvider = ({ children }) => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // TEMP STATIC DATA (Replace with DB/API later)
    const staticTestimonials = [
      {
        id: 1,
        name: "Iswarya",
        message: "This mock interview platform gave me real confidence.",
        createdAt: "2025-04-12T20:10:28Z",
        profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
      },  
      {
        id: 2,
        name: "Kaviya",
        message: "Voice-based interviews are a game changer!",
        createdAt: "2025-04-11T19:53:34Z",
        profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
      },
      {
        id: 3,
        name: "Aswin",
        message: "This mock interview platform gave me real confidence.",
        createdAt: "2025-04-11T19:53:34Z",
        profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
      },
      {
        id: 4,
        name: "Aswathi",
        message: "The mock interview platform helped me prepare better for my next interview.",
        createdAt: "2025-04-11T19:53:34Z",
        profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
      },
      {
        id: 5,
        name: "Jeni Anil",
        message: "nothing to say",
        createdAt: "2025-04-11T19:53:34Z",
        profile: "https://cdn-icons-png.flaticon.com/512/281/281764.png",
      },
    ];
    
    // SET STATIC TESTIMONIALS
    setTestimonials(staticTestimonials);

    // Uncomment below when real backend is ready
    /*
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("https://nextdevpathserver.vercel.app/api/testimonial");
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      } catch (err) {
        console.error("❌ Failed to fetch testimonials", err);
      }
    };

    fetchTestimonials();
    */
  }, []);

  return (
    <TestimonialContext.Provider value={{ testimonials, setTestimonials }}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonialContext = () => useContext(TestimonialContext);
