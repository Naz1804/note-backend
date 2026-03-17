const pool = require('../config/db')
const { sanitizeTitle, sanitizeContent, sanitizeTags } = require('../utils/sanitize')

exports.createNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Title required'})
        }

        const cleanTitle = sanitizeTitle(title);
        const cleanTags = sanitizeTags(tags);
        const cleanContent = sanitizeContent(content);

        const result = await pool.query(
            'INSERT INTO notes (user_id, title, content, tags) VALUES ($1, $2, $3, $4) RETURNING *', 
            [userId, cleanTitle, cleanContent, cleanTags]
        );
        const newNote = result.rows[0];

        res.json({ newNote })

    } catch (error) {
        console.error('Error creating note:', error)
        res.status(500).json({ message: 'Server error'})
    }
}

exports.findNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const findNote = await pool.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [id, userId])
        const note = findNote.rows[0]

        if (!note.id) {
            return res.status(404).json({ message: 'Cannot find note'})
        }

        res.json({ note })
    } catch (error) {
        console.error('failed to find note:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: 'Title required'})
        }

        const cleanTitle = sanitizeTitle(title);
        const cleanTags = sanitizeTags(tags);
        const cleanContent = sanitizeContent(content);

        const updateNote = await pool.query(
            'UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *',
            [cleanTitle, cleanContent, cleanTags, id, userId]
        );
        const updatedNote = updateNote.rows[0];

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }


        res.json({ updatedNote })
    } catch (error) {
        console.error('failed to update note:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.archiveNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await pool.query(
            'UPDATE notes SET archived = NOT archived WHERE id = $1 AND user_id = $2 RETURNING *', 
            [id, userId]
        );

        res.json({ message: 'Note archived!' })
    } catch (error) {
        console.error('failed to archive note:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [id, userId])

        res.json({ message: 'Note deleted!' })
    } catch (error) {
        console.error('failed to delete note:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.getAllNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const isArchived = req.path === '/archived'

        let allNotes;

        if (!isArchived) {
            const getNotes = await pool.query('SELECT * FROM notes WHERE user_id = $1 AND NOT archived ORDER BY updated_at DESC', [userId])
            allNotes = getNotes.rows
        }
        
        if(isArchived) {
            const getNotes = await pool.query('SELECT * FROM notes WHERE user_id = $1 AND archived ORDER BY updated_at DESC', [userId])
            allNotes = getNotes.rows
        }

        if(!allNotes) {
            return res.status(404).json({ message: 'You have no notes' });
        }

        res.json({ allNotes })

    } catch (error) {
        console.error('failed to retrieve note:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.searchNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { q } = req.query;

        const parseTags = q.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const searching = await pool.query(
            'SELECT * FROM notes WHERE user_id = $1 AND (title ILIKE $2 OR tags @> $3)', 
            [userId, `%${q}%`, parseTags]
        );
        const allNotes = searching.rows

        if(!allNotes) {
            return res.status(404).json({ message: 'You have no notes' });
        }

        res.json({ allNotes });
    } catch (error) {
        console.error('failed to search notes:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.getAllTags = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query('SELECT DISTINCT unnest(tags) as tag FROM notes WHERE user_id = $1 ORDER BY tag', [userId]);

        const tags = result.rows.map(row => row.tag);
        
        res.json({ tags })
    } catch (error) {
        console.error('failed to get all tags:', error)
        res.status(500).json({ message: 'server error' })
    }
}

exports.findTag = async (req, res) => {
    try {
        const userId = req.user.id;
        const { q } = req.query;

        const parseTags = q.split(',').map(tag => tag.trim()).filter(tag => tag);

        const findTags = await pool.query('SELECT * FROM notes WHERE user_id = $1 AND tags @> $2', [userId, parseTags]);
        const allNotes = findTags.rows

        if(!allNotes) {
            return res.status(404).json({ message: 'No notes related to this tag'})
        }

        res.json({ allNotes })
    } catch (error) {
        console.error('failed to find tag:', error)
        res.status(500).json({ message: 'server error' })
    }
}