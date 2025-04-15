import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMeeting extends Document {
  title: string;
  location: string;
  emailNotification: 'on' | 'off';
  reminderTime: {
    value: number;
    unit: 'minutes' | 'hours';
  };
  roomId: string;
  description?: string;
  guestEmails: string[];
  guestPermissions: string[]; // e.g., ['modify event', 'invite others', 'see guest list']
  createdBy: Types.ObjectId // Assuming this is a user ID or email of the creator
  createdAt: Date;
}

const MeetingSchema: Schema<IMeeting> = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  emailNotification: { type: String, enum: ['on', 'off'], default: 'off' },
  reminderTime: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['minutes', 'hours'], required: true },
  },
  roomId: {type: String, required: true}, // Assuming roomId is a string, adjust as necessary;
  description: { type: String },
  guestEmails: { type: [String], default: [] },
  guestPermissions: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Meeting || mongoose.model<IMeeting>('Meeting', MeetingSchema);
