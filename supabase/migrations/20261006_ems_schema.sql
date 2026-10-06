-- ==============================================================================
-- EMPERIO EMS - SUPABASE DATABASE SCHEMA & RLS MIGRATION
-- Project: Employee Management System (EMS)
-- Prepared for: Abastillas, Charles R. (EMP-2024-089)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_initial TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT NOT NULL DEFAULT 'Engineering & Technology',
  position TEXT NOT NULL DEFAULT 'Senior Software Engineer',
  employment_type TEXT NOT NULL DEFAULT 'Full-Time Regular',
  hire_date DATE DEFAULT CURRENT_DATE,
  work_location TEXT DEFAULT 'Makati Central Tower / Hybrid',
  reporting_manager TEXT,
  emergency_name TEXT,
  emergency_relationship TEXT,
  emergency_phone TEXT,
  residential_address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ATTENDANCE LOGS TABLE
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  clock_in TIME,
  clock_out TIME,
  hours_worked NUMERIC(4, 2) DEFAULT 0,
  status TEXT CHECK (status IN ('present', 'late', 'absent', 'leave', 'holiday', 'weekend')) DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, log_date)
);

-- 4. ASSIGNED TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_code TEXT UNIQUE NOT NULL,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  project TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'medium', 'high', 'urgent')) DEFAULT 'normal',
  status TEXT CHECK (status IN ('pending', 'ongoing', 'finished')) DEFAULT 'pending',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Policy', 'HR Notice', 'Operations', 'Event')),
  author TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'urgent')) DEFAULT 'normal',
  summary TEXT NOT NULL,
  full_content TEXT NOT NULL,
  pdf_name TEXT,
  pdf_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-specific announcement read status tracking
CREATE TABLE IF NOT EXISTS public.announcement_reads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- 6. LEAVE CREDITS & LEAVE REQUESTS TABLES
CREATE TABLE IF NOT EXISTS public.leave_credits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  vacation_total INTEGER DEFAULT 15,
  vacation_used INTEGER DEFAULT 0,
  vacation_pending INTEGER DEFAULT 0,
  sick_total INTEGER DEFAULT 12,
  sick_used INTEGER DEFAULT 0,
  sick_pending INTEGER DEFAULT 0,
  emergency_total INTEGER DEFAULT 5,
  emergency_used INTEGER DEFAULT 0,
  emergency_pending INTEGER DEFAULT 0,
  special_total INTEGER DEFAULT 3,
  special_used INTEGER DEFAULT 0,
  special_pending INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  request_code TEXT UNIQUE NOT NULL,
  employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL CHECK (total_days > 0),
  reason TEXT NOT NULL,
  attachment_url TEXT,
  attachment_name TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reviewer TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Employees can view their own profile and edit their personal contacts
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. Attendance Logs: Users manage their own attendance records
CREATE POLICY "Users view own attendance" 
  ON public.attendance_logs FOR SELECT 
  USING (auth.uid() = employee_id);

CREATE POLICY "Users insert/update own attendance" 
  ON public.attendance_logs FOR ALL 
  USING (auth.uid() = employee_id);

-- 3. Tasks: Employees can view and update status of assigned tasks
CREATE POLICY "Employees view assigned tasks" 
  ON public.tasks FOR SELECT 
  USING (auth.uid() = employee_id);

CREATE POLICY "Employees update status of assigned tasks" 
  ON public.tasks FOR UPDATE 
  USING (auth.uid() = employee_id);

-- 4. Announcements: Authenticated users can view all announcements
CREATE POLICY "All authenticated users can view announcements" 
  ON public.announcements FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users manage own announcement reads" 
  ON public.announcement_reads FOR ALL 
  USING (auth.uid() = user_id);

-- 5. Leave: Employees can view and submit leave requests
CREATE POLICY "Employees view own leave credits" 
  ON public.leave_credits FOR SELECT 
  USING (auth.uid() = employee_id);

CREATE POLICY "Employees view own leave requests" 
  ON public.leave_requests FOR SELECT 
  USING (auth.uid() = employee_id);

CREATE POLICY "Employees create leave requests" 
  ON public.leave_requests FOR INSERT 
  WITH CHECK (auth.uid() = employee_id);

-- Profile Trigger for New Auth Users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, employee_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP-' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Employee'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    NEW.email
  );
  
  INSERT INTO public.leave_credits (employee_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
