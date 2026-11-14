import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { _id: false }
);

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    collegeName: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    yearOfStudy: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      required: true,
    },

    projectName: {
      type: String,
      required: true,
      minlength: 5,
    },

    pptLink: {
      type: String,
      required: true,
    },

    prototypeLink: {
      type: String,
      required: true,
    },

    demoVideoLink: {
      type: String,
      default: "",
    },

    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    teamMembers: {
      type: [teamMemberSchema],
      required: true,
      validate: {
        validator: function (members) {
          return members.length === this.teamSize;
        },
        message: "Team member count must equal team size.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const HackathonRegistration = mongoose.model(
  "HackathonRegistration",
  hackathonRegistrationSchema
);

export default HackathonRegistration;