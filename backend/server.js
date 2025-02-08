require('dotenv').config();
const express = require('express');
const mongoose = require('./database');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// กำหนดพิกัด GPS ของโรงเรียน
const SCHOOL_LOCATION = { lat: 13.7563, lng: 100.5018, radius: 100 }; // กรุงเทพฯ

// โมเดลสำหรับบันทึกข้อมูลเช็คอิน
const Checkin = mongoose.model('Checkin', new mongoose.Schema({
    studentName: String,
    studentId: String,
    checkinTime: Date,
    latitude: Number,
    longitude: Number,
}));

// ตรวจสอบว่านักเรียนอยู่ภายในรัศมีโรงเรียนหรือไม่
const isWithinSchool = (lat, lng) => {
    const distance = Math.sqrt(Math.pow(lat - SCHOOL_LOCATION.lat, 2) + Math.pow(lng - SCHOOL_LOCATION.lng, 2)) * 111000;
    return distance <= SCHOOL_LOCATION.radius;
};

// เส้นทาง API เช็คอิน
app.post('/api/checkin', async (req, res) => {
    const { studentName, studentId, latitude, longitude } = req.body;

    if (!isWithinSchool(latitude, longitude)) {
        return res.status(400).json({ message: 'คุณอยู่นอกพื้นที่โรงเรียน' });
    }

    const checkin = new Checkin({ studentName, studentId, checkinTime: new Date(), latitude, longitude });
    await checkin.save();

    res.json({ message: 'เช็คอินสำเร็จ!', data: checkin });
});

// ดึงข้อมูลการเช็คอินทั้งหมด
app.get('/api/checkins', async (req, res) => {
    const checkins = await Checkin.find();
    res.json(checkins);
});

// รันเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
