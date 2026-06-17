import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the shared Supabase connection (builder's account)
    const { accessToken } = await base44.asServiceRole.connectors.getConnection("supabase");

    // Fetch all projects from Supabase Management API
    const response = await fetch("https://api.supabase.com/v1/projects", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Supabase API error: ${response.status} — ${errText}` }, { status: response.status });
    }

    const projects = await response.json();

    // Filter only active projects
    const activeProjects = projects.filter(
      (p) => p.status === "ACTIVE_HEALTHY" || p.status === "ACTIVE_UNHEALTHY"
    );

    return Response.json({
      total: projects.length,
      active: activeProjects.length,
      projects: activeProjects.map((p) => ({
        id: p.id,
        ref: p.ref,
        name: p.name,
        organization_id: p.organization_id,
        region: p.region,
        status: p.status,
        created_at: p.created_at,
        database: { host: p.database?.host, version: p.database?.version },
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});