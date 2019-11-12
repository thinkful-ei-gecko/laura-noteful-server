CREATE TABLE notes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE NOT NULL,
  note_title VARCHAR(60) NOT NULL,
  note_content VARCHAR(600),
  date_modified TIMESTAMP DEFAULT now() NOT NULL
  );