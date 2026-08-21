/*
# Create contact submissions table

1. New Tables
  - `contact_submissions`
    - `id` (uuid, primary key) - unique identifier for each submission
    - `full_name` (text, not null) - name of the person submitting the inquiry
    - `email` (text, not null) - contact email address
    - `phone` (text) - contact phone number
    - `company_name` (text) - name of the submitter's company, optional
    - `service_required` (text, not null) - which service the lead is interested in
    - `project_details` (text, not null) - free-text description of the project
    - `created_at` (timestamptz) - when the submission was made

2. Security
  - Enable RLS on `contact_submissions`.
  - This is a public-facing marketing site with no login, so the site itself
    runs as the `anon` role at all times.
  - Allow `anon` and `authenticated` to INSERT new leads (anyone can submit the form).
  - Do NOT allow `anon` or `authenticated` to SELECT, UPDATE, or DELETE rows,
    so a visitor can never read, edit, or remove another visitor's submitted
    contact details. Only the project owner (via the Supabase dashboard,
    which uses the privileged service role) can view submissions.

3. Notes
  - No UPDATE or DELETE policies are created, so those actions are denied to
    every client-side role by default once RLS is enabled.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  service_required text NOT NULL,
  project_details text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
