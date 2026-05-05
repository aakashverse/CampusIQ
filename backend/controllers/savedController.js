const pool = require("../config/db");

// POST /api/saved/:collegeId — save or unsave (toggle)
const toggleSave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { collegeId } = req.params;

    // Check if already saved
    const existing = await pool.query(
      "SELECT id FROM saved_colleges WHERE user_id = $1 AND college_id = $2",
      [userId, collegeId]
    );

    if (existing.rows.length > 0) {
      // Unsave it
      await pool.query(
        "DELETE FROM saved_colleges WHERE user_id = $1 AND college_id = $2",
        [userId, collegeId]
      );
      return res.json({ saved: false, message: "College removed from saved" });
    } else {
      // Save it
      await pool.query(
        "INSERT INTO saved_colleges (user_id, college_id) VALUES ($1, $2)",
        [userId, collegeId]
      );
      return res.json({ saved: true, message: "College saved" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update saved status" });
  }
};

// GET /api/saved — get all saved colleges for current user
const getSaved = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT c.id, c.name, c.location, c.fees, c.rating, c.placement_percentage, c.image_url
       FROM colleges c
       JOIN saved_colleges sc ON sc.college_id = c.id
       WHERE sc.user_id = $1
       ORDER BY sc.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch saved colleges" });
  }
};

// GET /api/saved/ids — useful for frontend to know which colleges user has saved
const getSavedIds = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT college_id FROM saved_colleges WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows.map((r) => r.college_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch saved IDs" });
  }
};

module.exports = { toggleSave, getSaved, getSavedIds };