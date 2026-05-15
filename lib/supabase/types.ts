export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRole = "user" | "moderator" | "admin";
export type ComboSubmissionStatus = "draft" | "pending" | "changes_requested" | "approved" | "rejected";
export type ComboSource = "markdown" | "submission";
export type VoteValue = -1 | 1;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: ProfileRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      combo_votes: {
        Row: {
          user_id: string;
          combo_id: string;
          combo_source: ComboSource;
          vote: VoteValue;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          combo_id: string;
          combo_source: ComboSource;
          vote: VoteValue;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          vote?: VoteValue;
          updated_at?: string;
        };
        Relationships: [];
      };
      combo_submissions: {
        Row: {
          id: string;
          author_id: string;
          reviewer_id: string | null;
          status: ComboSubmissionStatus;
          review_notes: string | null;
          combo: Json;
          created_at: string;
          updated_at: string;
          submitted_at: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          author_id: string;
          reviewer_id?: string | null;
          status?: ComboSubmissionStatus;
          review_notes?: string | null;
          combo: Json;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          reviewer_id?: string | null;
          status?: ComboSubmissionStatus;
          review_notes?: string | null;
          combo?: Json;
          updated_at?: string;
          submitted_at?: string | null;
          reviewed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      combo_vote_totals: {
        Row: {
          combo_id: string;
          combo_source: ComboSource;
          upvotes: number;
          downvotes: number;
          score: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
