const FB_PROJECT = "apple911-90eb6";
const FB_API_KEY  = "AIzaSyDdUgUX9SSi1CFcvKV7tVWirBpUEQugpy4";
const FB_BASE     = `https://firestore.googleapis.com/v1/projects/${FB_PROJECT}/databases/(default)/documents/apple911`;

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "missing key" });

  const url = `${FB_BASE}/${encodeURIComponent(key)}?key=${FB_API_KEY}`;

  try {
    const options = { method: req.method, headers: { "Content-Type": "application/json" } };
    if (req.method === "PATCH") options.body = JSON.stringify(req.body);

    const r = await fetch(url, options);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
