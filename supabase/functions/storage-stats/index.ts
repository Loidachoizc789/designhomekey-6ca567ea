import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query storage stats using service role
    const { data, error } = await supabase.rpc("get_storage_stats");

    if (error) {
      // Fallback: query storage.objects directly with service role
      const { data: objects, error: objError } = await supabase
        .from("storage_objects_view")
        .select("*");

      // Use raw SQL via postgres
      const result = await fetch(`${supabaseUrl}/rest/v1/rpc/get_storage_stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
        },
      });

      if (!result.ok) {
        // Direct query approach
        const statsQuery = await fetch(
          `${supabaseUrl}/rest/v1/rpc/get_storage_stats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": serviceRoleKey,
              "Authorization": `Bearer ${serviceRoleKey}`,
            },
          }
        );
      }
    }

    // Use a simpler approach - list objects per bucket
    const buckets = ["category-images", "homepage-assets"];
    const stats = [];

    for (const bucketName of buckets) {
      let totalSize = 0;
      let fileCount = 0;

      const listFiles = async (path: string) => {
        const { data: files, error } = await supabase.storage
          .from(bucketName)
          .list(path, { limit: 1000 });

        if (error || !files) return;

        for (const file of files) {
          if (file.id) {
            // It's a file
            totalSize += (file.metadata?.size || 0);
            fileCount++;
          } else {
            // It's a folder
            await listFiles(path ? `${path}/${file.name}` : file.name);
          }
        }
      };

      await listFiles("");

      stats.push({
        bucket: bucketName,
        file_count: fileCount,
        total_bytes: totalSize,
      });
    }

    const totalBytes = stats.reduce((sum, s) => sum + s.total_bytes, 0);
    const totalFiles = stats.reduce((sum, s) => sum + s.file_count, 0);

    return new Response(
      JSON.stringify({
        buckets: stats,
        total_bytes: totalBytes,
        total_files: totalFiles,
        max_bytes: 1 * 1024 * 1024 * 1024, // 1GB
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
