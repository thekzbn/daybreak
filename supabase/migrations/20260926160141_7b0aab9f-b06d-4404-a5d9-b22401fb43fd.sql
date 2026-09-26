CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  display_name text NOT NULL DEFAULT 'Daybreaker',
  avatar_url text,
  wallpaper text NOT NULL DEFAULT 'pastel-cyber' CHECK (wallpaper IN ('pastel-cyber','retro-grid','vintage-lavender','pixel-clouds')),
  sound_muted boolean NOT NULL DEFAULT false,
  desktop_layout jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_all" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 240),
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  is_recommended boolean NOT NULL DEFAULT false,
  priority smallint NOT NULL DEFAULT 4 CHECK (priority BETWEEN 1 AND 99),
  is_active boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  focus_seconds integer NOT NULL DEFAULT 0 CHECK (focus_seconds >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_own_all" ON public.tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX tasks_user_date_idx ON public.tasks(user_id, task_date);
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, note_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_own_all" ON public.notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.stickies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'pink' CHECK (color IN ('pink','lilac','yellow','mint')),
  position_x integer NOT NULL DEFAULT 120,
  position_y integer NOT NULL DEFAULT 120,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stickies TO authenticated;
GRANT ALL ON public.stickies TO service_role;
ALTER TABLE public.stickies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stickies_own_all" ON public.stickies FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER stickies_updated_at BEFORE UPDATE ON public.stickies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.reading_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  url text NOT NULL,
  spine_color text NOT NULL DEFAULT 'rose',
  slot smallint NOT NULL CHECK (slot BETWEEN 1 AND 5),
  progress smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, slot)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_queue TO authenticated;
GRANT ALL ON public.reading_queue TO service_role;
ALTER TABLE public.reading_queue ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reading_queue_own_all" ON public.reading_queue FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER reading_queue_updated_at BEFORE UPDATE ON public.reading_queue FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.budget_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month date NOT NULL,
  income numeric(12,2) NOT NULL DEFAULT 0 CHECK (income >= 0),
  fixed_costs numeric(12,2) NOT NULL DEFAULT 0 CHECK (fixed_costs >= 0),
  saving_goal numeric(12,2) NOT NULL DEFAULT 0 CHECK (saving_goal >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_settings TO authenticated;
GRANT ALL ON public.budget_settings TO service_role;
ALTER TABLE public.budget_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budget_settings_own_all" ON public.budget_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER budget_settings_updated_at BEFORE UPDATE ON public.budget_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  icon text NOT NULL DEFAULT 'coin',
  monthly_limit numeric(12,2) NOT NULL DEFAULT 0 CHECK (monthly_limit >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_categories TO authenticated;
GRANT ALL ON public.budget_categories TO service_role;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budget_categories_own_all" ON public.budget_categories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER budget_categories_updated_at BEFORE UPDATE ON public.budget_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id uuid REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL DEFAULT '',
  spent_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expenses_own_all" ON public.expenses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX expenses_user_date_idx ON public.expenses(user_id, spent_on);
CREATE TRIGGER expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.daily_archives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  archive_date date NOT NULL,
  completed_tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  focus_seconds integer NOT NULL DEFAULT 0 CHECK (focus_seconds >= 0),
  notes text NOT NULL DEFAULT '',
  spend_total numeric(12,2) NOT NULL DEFAULT 0 CHECK (spend_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, archive_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_archives TO authenticated;
GRANT ALL ON public.daily_archives TO service_role;
ALTER TABLE public.daily_archives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_archives_own_all" ON public.daily_archives FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER daily_archives_updated_at BEFORE UPDATE ON public.daily_archives FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();