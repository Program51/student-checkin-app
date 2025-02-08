const request = require('supertest');
const app = require('../server'); // นำเข้า server.js

describe('API Testing - เช็คอิน', () => {
    it('ควรเช็คอินสำเร็จ', async () => {
        const res = await request(app).post('/api/checkin').send({
            studentName: "สมชาย",
            studentId: "12345",
            latitude: 13.7563,  // พิกัดที่อยู่ในโรงเรียน
            longitude: 100.5018
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'เช็คอินสำเร็จ!');
    });

    it('ควรปฏิเสธเช็คอินเมื่ออยู่นอกโรงเรียน', async () => {
        const res = await request(app).post('/api/checkin').send({
            studentName: "สมหญิง",
            studentId: "54321",
            latitude: 10.0000,  // พิกัดที่อยู่นอกโรงเรียน
            longitude: 99.0000
        });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'คุณอยู่นอกพื้นที่โรงเรียน');
    });
});
