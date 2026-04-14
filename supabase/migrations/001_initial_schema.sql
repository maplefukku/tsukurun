-- profiles: auth.users と 1:1 で紐づくユーザープロフィール
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  line_user_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "自分のプロフィールを参照" on profiles
  for select to authenticated using (auth.uid() = id);

create policy "自分のプロフィールを更新" on profiles
  for update to authenticated using (auth.uid() = id);

create policy "サインアップ時にプロフィール作成" on profiles
  for insert to authenticated with check (auth.uid() = id);

-- templates: アプリテンプレート（管理者が投入、全員参照可）
create table templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  html_template text not null,
  base_config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table templates enable row level security;

create policy "テンプレートは全員参照可" on templates
  for select to authenticated using (true);

-- projects: ユーザーが作成したプロジェクト
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  title text not null,
  template_id uuid references templates(id) on delete set null,
  config jsonb not null default '{}',
  generated_html text,
  status text not null default 'draft',
  published_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_user_id on projects(user_id);

alter table projects enable row level security;

create policy "自分のプロジェクトを参照" on projects
  for select to authenticated using (auth.uid() = user_id);

create policy "自分のプロジェクトを作成" on projects
  for insert to authenticated with check (auth.uid() = user_id);

create policy "自分のプロジェクトを更新" on projects
  for update to authenticated using (auth.uid() = user_id);

create policy "自分のプロジェクトを削除" on projects
  for delete to authenticated using (auth.uid() = user_id);

-- conversations: プロジェクトに紐づくチャット会話
create table conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table conversations enable row level security;

create policy "自分のプロジェクトの会話を参照" on conversations
  for select to authenticated using (
    exists (select 1 from projects where projects.id = project_id and projects.user_id = auth.uid())
  );

create policy "自分のプロジェクトに会話を作成" on conversations
  for insert to authenticated with check (
    exists (select 1 from projects where projects.id = project_id and projects.user_id = auth.uid())
  );

-- messages: 会話内のメッセージ
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "自分の会話のメッセージを参照" on messages
  for select to authenticated using (
    exists (
      select 1 from conversations c
      join projects p on p.id = c.project_id
      where c.id = conversation_id and p.user_id = auth.uid()
    )
  );

create policy "自分の会話にメッセージを追加" on messages
  for insert to authenticated with check (
    exists (
      select 1 from conversations c
      join projects p on p.id = c.project_id
      where c.id = conversation_id and p.user_id = auth.uid()
    )
  );

-- published_sites: 公開されたサイト（slug で公開アクセス可）
create table published_sites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  slug text not null unique,
  html_snapshot text not null,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_published_sites_slug on published_sites(slug);

alter table published_sites enable row level security;

create policy "公開サイトは誰でも参照可" on published_sites
  for select using (true);

create policy "自分のプロジェクトのサイトを作成" on published_sites
  for insert to authenticated with check (
    exists (select 1 from projects where projects.id = project_id and projects.user_id = auth.uid())
  );

create policy "自分のプロジェクトのサイトを更新" on published_sites
  for update to authenticated using (
    exists (select 1 from projects where projects.id = project_id and projects.user_id = auth.uid())
  );

-- updated_at 自動更新トリガー
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

create trigger published_sites_updated_at before update on published_sites
  for each row execute function update_updated_at();

-- サインアップ時に profiles を自動作成
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
