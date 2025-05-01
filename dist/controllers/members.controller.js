"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHeads = exports.handleProfileDetails = exports.handleMemberOnboarding = exports.handleRefreshToken = exports.handleLogin = exports.getMemberById = exports.getMembers = void 0;
const membersModel_1 = __importDefault(require("../models/membersModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const divisionGroupModel_1 = __importDefault(require("../models/divisionGroupModel"));
const secretKey = process.env.SECRET_KEY;
const refreshKey = process.env.REFRESH_KEY;
const getMembers = async (req, res) => {
    try {
        const { search, division, group, campusStatus, attendance, membershipStatus, divisionRole, page, limit, } = req.query;
        const query = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { firstName: regex },
                { middleName: regex },
                { lastName: regex },
                { email: regex },
                { universityId: regex }
            ];
        }
        if (division)
            query.division = division;
        if (group)
            query.group = group;
        if (campusStatus)
            query.campusStatus = campusStatus;
        if (attendance)
            query.attendance = attendance;
        if (membershipStatus)
            query.membershipStatus = membershipStatus;
        if (divisionRole)
            query.divisionRole = divisionRole;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);
        const [members, total] = await Promise.all([
            membersModel_1.default.find(query)
                .select('-password -refreshToken')
                .skip(skip)
                .limit(parsedLimit)
                .sort({ createdAt: -1 }),
            membersModel_1.default.countDocuments(query)
        ]);
        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parsedLimit),
            totalMembers: total,
            members
        });
    }
    catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ message: 'Error fetching members', error });
    }
};
exports.getMembers = getMembers;
const getMemberById = async (req, res) => {
    const id = req.params.id;
    try {
        const member = await membersModel_1.default.findById(id).select("-password -refreshToken");
        if (!member) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        res.status(200).json({
            member
        });
    }
    catch (error) {
        res.status(501).json({ message: "Error retrieving Member", error: error });
    }
};
exports.getMemberById = getMemberById;
const handleLogin = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "Login request body is empty" });
        return;
    }
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }
    try {
        const foundMember = await membersModel_1.default.findOne({ email });
        if (!foundMember) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        const passwordMatch = await bcrypt_1.default.compare(password, foundMember.password);
        if (!passwordMatch) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole }, secretKey, { expiresIn: "5h" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole }, refreshKey, { expiresIn: "7d" });
        await membersModel_1.default.updateOne({ email }, { $set: { refreshToken } });
        res.status(200).json({
            message: "Login Successful",
            token,
            refreshToken
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.handleLogin = handleLogin;
const handleRefreshToken = async (req, res) => {
    var _a;
    let refreshToken = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!refreshToken) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
    }
    try {
        const foundMember = await membersModel_1.default.findOne({ refreshToken });
        if (!foundMember) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, refreshKey, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: "Token verification failed" });
            }
            const newAccessToken = jsonwebtoken_1.default.sign({ id: foundMember._id, email: foundMember.email, clubRole: foundMember.clubRole }, secretKey, { expiresIn: "2h" });
            res.status(200).json({
                message: "Token refreshed",
                token: newAccessToken
            });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.handleRefreshToken = handleRefreshToken;
const handleMemberOnboarding = async (req, res) => {
    const { clubRole } = req.user;
    if (clubRole === "Member") {
        res.status(403).json({ message: `${clubRole} can not add a new member` });
        return;
    }
    const currentDivisions = await divisionGroupModel_1.default.distinct('division');
    const { firstName, lastName, division, group, email, generatedPassword } = req.body;
    const emailExist = await membersModel_1.default.findOne({ email });
    if (emailExist) {
        res.status(400).json('Email already used');
        return;
    }
    if (!currentDivisions.includes(division)) {
        res.status(400).json(`${division} not present`);
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(generatedPassword, 10);
    const newMember = new membersModel_1.default({
        firstName,
        lastName,
        division,
        group,
        email,
        password: hashedPassword
    });
    await newMember.save();
    res.status(200).json({ message: "New member created successfully", newMember });
    // const sendResult = await sendOnboardingEmail(email, generatedPassword)
    // res.status(200).json({ message: "New member created successfuly", result: sendResult })
    //add link in the email for the new member to log in with
};
exports.handleMemberOnboarding = handleMemberOnboarding;
const handleProfileDetails = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, birthDate, github, gender, telegramHandle, graduationYear, specialization, department, mentor, universityId, instagramHandle, linkedinHandle, codeforcesHandle, cv, leetcodeHandle, bio, resources } = req.body;
        const profilePicture = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
        const foundMember = await membersModel_1.default.findOne({ email: email }).exec();
        if (!foundMember) {
            res.status(404).json({ message: "Member not found" });
            return;
        }
        const updateData = {
            firstName, lastName, phoneNumber, birthDate, github,
            gender, telegramHandle, graduationYear, specialization,
            department, universityId, instagramHandle, linkedinHandle,
            codeforcesHandle, leetcodeHandle, cv, bio, mentor, profilePicture, resources
        };
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined || updateData[key] === null) {
                delete updateData[key];
            }
        });
        await membersModel_1.default.updateOne({ email: email }, { $set: Object.assign({}, updateData) });
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update member profile", error });
    }
};
exports.handleProfileDetails = handleProfileDetails;
const getAllHeads = async (req, res) => {
    try {
        const heads = await membersModel_1.default.find({ clubRole: { $ne: "Member" } }).select("firstName middleName lastName clubRole email");
        if (!heads || heads.length === 0) {
            res.status(400).json({ message: "No heads found" });
            return;
        }
        res.status(200).json({ length: heads.length, heads });
    }
    catch (error) {
        res.status(500).json({ message: "Cannot get heads", error });
    }
};
exports.getAllHeads = getAllHeads;
