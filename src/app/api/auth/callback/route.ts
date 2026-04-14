import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookiesToSet: Array<{
      name: string;
      value: string;
      options?: Record<string, unknown>;
    }> = [];

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.push(...cookies);
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
