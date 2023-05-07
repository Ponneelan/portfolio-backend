const { createClient } = require('@supabase/supabase-js')

const URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_API_KEY;
const client = createClient(URL, API_KEY)


module.exports = {
    client,
}