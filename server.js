const express = require('express');
const bodyParser = require('body-parser');
const db = require('./firebase');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 게시글 목록 가져오기
app.get('/api/meetings', async (req, res) => {
  try {
    // 'createdAt' 필드를 기준으로 내림차순으로 정렬
    const snapshot = await db.collection('meetings')
      .orderBy('createdAt', 'desc')  // 'desc'는 내림차순, 'asc'는 오름차순
      .get();
    
    const meetings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
