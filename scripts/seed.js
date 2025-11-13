const { neon } = require('@neondatabase/serverless');

async function seed() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Connecting to the database...');
  
  try {
    console.log('Beginning database seeding...');
    
    // Create the "posts" table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT
      );
    `;
    console.log('✅ "posts" table created or already exists.');

    // Clear existing data
    await sql`DELETE FROM posts;`;
    console.log('🗑️  Cleared existing data from "posts" table.');

    // Insert new data
    await sql`
      INSERT INTO posts (title, content) VALUES
      ('Project Alpha', 'Initial thoughts: Strong technical foundation but lacks a clear business model.'),
      ('Project Beta', 'Excellent presentation and a very innovative use of technology. A strong contender.'),
      ('Project Gamma', 'The concept is promising, but the prototype is unstable and needs more work.');
    `;
    console.log('🌱 Seeded 3 initial posts.');

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

seed();
