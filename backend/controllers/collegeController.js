const pool = require("../config/db");

// GET 
const getColleges = async (req, res) => {
  try {
    const { search = "", location = "", maxFees = "", page = 1, limit = 9 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    // Build dynamic WHERE clause
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (location) {
      params.push(`%${location}%`);
      conditions.push(`location ILIKE $${params.length}`);
    }

    if (maxFees) {
      params.push(parseInt(maxFees));
      conditions.push(`fees <= $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM colleges ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    params.push(parseInt(limit));
    params.push(offset);
    const dataResult = await pool.query(
      `SELECT id, name, location, fees, rating, placement_percentage, image_url
       FROM colleges ${whereClause}
       ORDER BY rating DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      colleges: dataResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch colleges" });
  }
};

// GET /api/colleges/:id
const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT c.*, 
        COALESCE(json_agg(co.name ORDER BY co.name) FILTER (WHERE co.name IS NOT NULL), '[]') as courses
       FROM colleges c
       LEFT JOIN college_courses co ON co.college_id = c.id
       WHERE c.id = $1
       GROUP BY c.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch college" });
  }
};

module.exports = { getColleges, getCollegeById };