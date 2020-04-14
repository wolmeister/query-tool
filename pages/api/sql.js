import mysql from 'mysql2/promise';

export default async (req, res) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'ffxiv',
  });
  const time = Date.now();
  try {
    const [results, fields] = await connection.query(req.query.query);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        time: Date.now() - time,
        results,
        fields: fields.map(f => f.name),
      })
    );
  } catch (err) {
    res.statusCode = 500;
    res.end(err.message);
  }
};
