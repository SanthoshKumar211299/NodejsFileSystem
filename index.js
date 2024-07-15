import express from 'express';
import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';

const PORT = 4000;
const app = express();
const folderPath = 'TimeStamp';

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.use(express.json());

// Endpoint to create a file with current timestamp
app.get('/', (req, res) => {
  let today = format(new Date(), 'dd-MM-yyyy-HH-mm-ss');
  const filePath = path.join(folderPath, `TimeStamp${today}.txt`);
  
  fs.writeFileSync(filePath, `${today}`, 'utf8');

  try {
    let data = fs.readFileSync(filePath, 'utf8');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Endpoint to retrieve all text files in the folder
app.get('/getTextFiles', (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred while listing the files from the directory');
    } else {
      const textFiles = files.filter((file) => path.extname(file) === '.txt');
      res.status(200).json(textFiles);
    }
  });
});

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
