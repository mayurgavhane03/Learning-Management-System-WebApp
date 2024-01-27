import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Regular expression for validating email format
const emailRegexPattern: RegExp = /^[^\s]+@[^\s@]+\.[^\s@]+$/;

// Define the interface for the User document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePasswords: (password: string) => Promise<boolean>;
}

// Define the schema for the User document
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: String,
        },
    ],
}, { timestamps: true });

// Middleware to hash the password before saving to the database
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare entered password with the hashed password in the database
/* userSchema.methods.comparePasswords = async function (password: string): Promise<boolean> {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};
 */
userSchema.methods.comparePasswords = async function (enteredPassword: string): Promise<boolean> {
   return await bcrypt.compare(enteredPassword, this.password);
};




// Define the User model using the schema
const userModel: Model<IUser> = mongoose.model("User", userSchema);

// Export the User model
export default userModel;
