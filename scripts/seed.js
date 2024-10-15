var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
// 환경 변수 로드
dotenv.config();

// MongoDB 연결 설정
//const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI = "mongodb+srv://jihwan114:!SJH552016@runmongo.idlha08.mongodb.net/?retryWrites=true&w=majority&appName=RunMongo"
// `__dirname` 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('MONGODB_URI : ' + MONGODB_URI);
mongoose.connect(MONGODB_URI);
mongoose.connection.on('connected', function () { return __awaiter(_this, void 0, void 0, function () {
    var dataPath, jsonData, courses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Connected to MongoDB');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 6]);
                dataPath = path.join(__dirname, '../data/scripts/lottemart_courses.json');
                console.log("Reading data from ".concat(dataPath, "..."));
                jsonData = fs.readFileSync(dataPath, 'utf-8');
                courses = JSON.parse(jsonData);
                console.log("Inserting ".concat(courses.length, " courses into the database..."));
                // 데이터베이스에 데이터 삽입
                return [4 /*yield*/, Course.insertMany(courses)];
            case 2:
                // 데이터베이스에 데이터 삽입
                _a.sent();
                console.log('Data successfully inserted!');
                return [3 /*break*/, 6];
            case 3:
                error_1 = _a.sent();
                console.error('Error inserting data:', error_1);
                return [3 /*break*/, 6];
            case 4: 
            // 연결 종료
            return [4 /*yield*/, mongoose.connection.close()];
            case 5:
                // 연결 종료
                _a.sent();
                console.log('MongoDB connection closed.');
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});
