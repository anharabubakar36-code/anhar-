import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Supabase Admin Client (Service Role Key)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// API Routes for Admin User Management
app.get("/api/admin/users", async (req, res) => {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    // Fetch profiles for these users
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*");
    
    if (profileError) throw profileError;

    const mergedUsers = users.map(user => ({
      ...user,
      profile: profiles.find(p => p.id === user.id)
    }));

    res.json(mergedUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/users", async (req, res) => {
  const { email, password, full_name, role, nis, kelas, jurusan } = req.body;
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (error) throw error;
    if (!user) throw new Error("User creation failed");

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: user.id,
        full_name,
        role,
        nis,
        kelas,
        jurusan
      });

    if (profileError) throw profileError;

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, full_name, role, nis, kelas, jurusan } = req.body;
  try {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
    if (authError) throw authError;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ full_name, role, nis, kelas, jurusan })
      .eq("id", id);

    if (profileError) throw profileError;

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
