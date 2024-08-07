export const queryToSelectTotalWorkingTimeForAUser = `
        SELECT
          DATE_TRUNC('day', start_time) AS date,
          SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) AS hours,
          ARRAY_AGG(description) AS descriptions
        FROM time_log
        WHERE user_id = $1 AND end_time IS NOT NULL
        GROUP BY DATE_TRUNC('day', start_time)
        ORDER BY date ASC
      `;

export const queryToSelectTotalWorkingTimeForAllUser = (userFilter: string) => {
  return `
       SELECT
          DATE_TRUNC('day', start_time) AS date,
          SUM(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) AS hours,
          ARRAY_AGG(description) AS descriptions,
          user_id
        FROM time_log
        WHERE end_time IS NOT NULL
        ${userFilter}
        GROUP BY DATE_TRUNC('day', start_time), user_id
        ORDER BY date ASC, user_id ASC
    `;
};
