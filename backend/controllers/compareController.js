const pool = require("../config/db");
const { generateComparisonInsight } = require("../utils/llm");

// POST /api/compare
// Body: { collegeIds: [1, 2, 3] }
const compareColleges = async (req, res) => {
  try {
    const { collegeIds } = req.body;

    if (!Array.isArray(collegeIds) || collegeIds.length < 2 || collegeIds.length > 3) {
      return res.status(400).json({ error: "Provide 2 or 3 college IDs to compare" });
    }

    // Fetch college data from DB
    // Using ANY($1) is the pg way to do WHERE IN with an array
    const result = await pool.query(
      `SELECT id, name, location, fees, rating, placement_percentage, established_year
       FROM colleges
       WHERE id = ANY($1)`,
      [collegeIds]
    );

    if (result.rows.length < 2) {
      return res.status(404).json({ error: "Not enough colleges found" });
    }

    // Maintain the order the user requested
    const orderedColleges = collegeIds
      .map((id) => result.rows.find((c) => c.id === parseInt(id)))
      .filter(Boolean);

    // Call LLM to generate insights
    const insight = await generateComparisonInsight(orderedColleges);

    res.json({
      colleges: orderedColleges,
      insight,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Comparison failed" });
  }
};

module.exports = { compareColleges };