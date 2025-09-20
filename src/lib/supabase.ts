import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xtbbqoxymvcoxetiyejm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YmJxb3h5bXZjb3hldGl5ZWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDEwNDgsImV4cCI6MjA3MzY3NzA0OH0.Yv5gXnXj2buI6jW93WBa7hM4_oXggJU3y44UdyMKS7g";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for our database tables
export interface ContactSubmission {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  job_title: string | null;
  job_details: string;
  inquiry_type: string;
  status: "new" | "contacted" | "resolved";
}

export interface Testimonial {
  id: number;
  created_at: string;
  name: string;
  company: string;
  rating: number;
  text: string;
  project: string;
  approved: boolean;
}

export interface Event {
  id: number;
  created_at: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: "upcoming" | "completed";
  attendees: number;
  highlights: string[];
}

// API functions
export const contactAPI = {
  async submitForm(
    data: Omit<ContactSubmission, "id" | "created_at" | "status">,
  ) {
    const { data: result, error } = await supabase
      .from("contact_submissions")
      .insert([{ ...data, status: "new" }])
      .select();

    if (error) throw error;
    return result[0];
  },

  async getSubmissions() {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};

export const testimonialsAPI = {
  async getApproved() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async submit(data: Omit<Testimonial, "id" | "created_at" | "approved">) {
    const { data: result, error } = await supabase
      .from("testimonials")
      .insert([{ ...data, approved: false }])
      .select();

    if (error) throw error;
    return result[0];
  },
};

export const eventsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUpcoming() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "upcoming")
      .order("date", { ascending: true });

    if (error) throw error;
    return data;
  },
};
