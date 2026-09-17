const pool = require("../db");

async function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  details = "",
}) {
  await pool.query(
    `INSERT INTO audit_logs
     (
       user_id,
       action,
       resource_type,
       resource_id,
       details
     )
     VALUES ($1,$2,$3,$4,$5)`,
    [
      userId,
      action,
      resourceType,
      String(resourceId),
      details,
    ]
  );
}

module.exports = {
  logAudit,
};